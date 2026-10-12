/* ===================== LỚP NỐI SUPABASE (thay window.claude của bản claude.ai) =====================
   Giữ nguyên toàn bộ logic app v7: app vẫn gọi window.claude.use('db'|'user'|'downloads'|'assets'|'sample').
   Chỉ dùng URL + khoá publishable (công khai). Mọi quyền do RLS trên Supabase quyết định. */
const SB_URL = 'https://mihlrktmodxnqvxlbtdp.supabase.co';
const SB_KEY = 'sb_publishable_fsuVJ44ZpJkBjhsBNvx68Q_G5NKXRz-';
const sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
let SB_USER = null, SB_PROFILE = null;

const isoZ = t => t ? new Date(t).toISOString() : null;
const sbErr = (error) => { const e = new Error(error?.message || 'Lỗi CSDL'); e.code = error?.code || 'db_error'; return e; };
async function must(p) { const { data, error } = await p; if (error) throw sbErr(error); return data; }
async function projUuid(legacy) { const r = await must(sb.from('qs_projects').select('id').eq('legacy_id', legacy).maybeSingle()); return r?.id || null; }

/* ---------- Ánh xạ collection của app → bảng qs_* ---------- */
const COLS = {
  projects: {
    tables: ['qs_projects'],
    async list() { const rows = await must(sb.from('qs_projects').select('legacy_id,doc')); return rows.filter(r => r.doc && Object.keys(r.doc).length).map(r => [r.legacy_id, r.doc]); },
    async set(id, d) {
      let rows = await must(sb.from('qs_projects').update({ doc: d }).eq('legacy_id', id).select('id'));
      if (!rows.length) rows = await must(sb.from('qs_projects').insert({ doc: d, legacy_id: id, code: d.ma || id, name: d.ten || '', type: 'nha', area_m2: 1 }).select('id'));
      const pid = rows[0].id;
      // dòng dự toán chuẩn hoá (phục vụ báo cáo); tài liệu gốc vẫn là doc
      await must(sb.from('qs_estimate_lines').delete().eq('project_id', pid));
      const L = (d.lines || []).map((l, i) => ({
        project_id: pid, sort: i, price_code: l.custom ? null : (CAT[l.code] ? l.code : null),
        code: l.code || '', name: l.name || '', unit: l.unit || '', qty: +l.qty || 0, cost: +l.cost || 0,
        bien: ['TC', 'VT', 'TB', 'DV', 'PN'].includes(l.bien) ? l.bien : 'TC', k_tech: l.kkt || null, enabled: l.on !== false,
        owner_supplied: !!l.cdt, is_custom: !!l.custom, ai_conf: l.ai || null, kts_price: l.kts != null && l.kts !== '' ? +l.kts : null, source: l.src || null }));
      for (let i = 0; i < L.length; i += 500) await must(sb.from('qs_estimate_lines').insert(L.slice(i, i + 500)));
      await must(sb.from('qs_project_members').delete().eq('project_id', pid));
      const M = (d.assignees || []).filter(x => /^[0-9a-f-]{36}$/i.test(x)).map(u => ({ project_id: pid, user_id: u }));
      if (M.length) await must(sb.from('qs_project_members').insert(M));
    },
    async del(id) { await must(sb.from('qs_projects').delete().eq('legacy_id', id)); }
  },
  expenses: {
    tables: ['qs_expenses'],
    async list() {
      const rows = await must(sb.from('qs_expenses').select('data,created_at,project:qs_projects(legacy_id)').order('created_at'));
      const g = {}; for (const r of rows) { const k = r.project?.legacy_id; if (!k) continue; (g[k] = g[k] || { rows: [] }).rows.push(r.data); }
      return Object.entries(g);
    },
    async set(id, d) {
      const pid = await projUuid(id); if (!pid) throw sbErr({ message: 'Không tìm thấy dự án' });
      await must(sb.from('qs_expenses').delete().eq('project_id', pid));
      const R = (d.rows || []).map(x => ({ project_id: pid, code: x.code || null, description: [x.doc, x.vendor].filter(Boolean).join(' · ') || null, amount: +x.amount || 0, spent_on: x.date || null, data: x }));
      if (R.length) await must(sb.from('qs_expenses').insert(R));
    },
    async del(id) { const pid = await projUuid(id); if (pid) await must(sb.from('qs_expenses').delete().eq('project_id', pid)); }
  },
  proposals: {
    tables: ['qs_price_proposals'],
    async list() { const rows = await must(sb.from('qs_price_proposals').select('legacy_id,id,code,cost,reason,status,created_at,data')); return rows.map(r => [r.legacy_id || r.id, Object.keys(r.data || {}).length ? r.data : { code: r.code, cost: +r.cost, why: r.reason, status: r.status, at: isoZ(r.created_at) }]); },
    async set(id, d) {
      const row = { code: d.code, cost: +d.cost || 0, reason: d.why || '', status: ['cho', 'duyet', 'tuchoi'].includes(d.status) ? d.status : 'cho', data: d };
      const u = await must(sb.from('qs_price_proposals').update(row).eq('legacy_id', id).select('id'));
      if (!u.length) await must(sb.from('qs_price_proposals').insert({ ...row, legacy_id: id }));
    },
    async del(id) { await must(sb.from('qs_price_proposals').delete().eq('legacy_id', id)); }
  },
  catalog: {
    tables: ['qs_price_catalog'],
    async list() {
      const rows = await must(sb.from('qs_price_catalog').select('code,name,unit,spec,cost,bien,market_min,market_max,source,active,created_at,data').eq('is_custom', true));
      return rows.map(r => [r.code, Object.keys(r.data || {}).length ? { ...r.data, active: r.active } : { name: r.name, unit: r.unit, spec: r.spec || '', cost: +r.cost, bien: r.bien, mmin: +r.market_min || 0, mmax: +r.market_max || 0, src: r.source || '', active: r.active, at: isoZ(r.created_at) }]);
    },
    async set(code, d) {
      const row = { group_code: code.slice(0, 4), name: d.name, unit: d.unit || 'gói', spec: d.spec || '', cost: Math.max(0, +d.cost || 0), bien: ['TC', 'VT', 'TB', 'DV', 'PN'].includes(d.bien) ? d.bien : 'TC', market_min: +d.mmin || 0, market_max: +d.mmax || 0, source: d.src || '', active: d.active !== false, data: d, updated_at: new Date().toISOString() };
      const u = await must(sb.from('qs_price_catalog').update(row).eq('code', code).select('code'));
      if (!u.length) await must(sb.from('qs_price_catalog').insert({ ...row, code, is_custom: true, created_by: SB_USER.id }));
    },
    async del(code) { await must(sb.from('qs_price_catalog').update({ active: false }).eq('code', code)); }
  },
  settings: {
    tables: ['qs_settings'],
    async list() { const rows = await must(sb.from('qs_settings').select('key,value')); return rows.map(r => [r.key, r.value]); },
    async set(k, d) { await must(sb.from('qs_settings').upsert({ key: k, value: d, updated_by: SB_USER.id, updated_at: new Date().toISOString() })); },
    async del(k) { await must(sb.from('qs_settings').delete().eq('key', k)); }
  },
  versions: {
    tables: ['qs_price_versions'],
    async list() { const rows = await must(sb.from('qs_price_versions').select('no,label,issued_at,params,data').order('no')); return rows.map(r => ['v' + r.no, Object.keys(r.data || {}).length ? r.data : { no: r.no, label: r.label, date: r.issued_at, changes: {}, params: r.params || {}, status: 'issued' }]); },
    async set(id, d) { await must(sb.from('qs_price_versions').upsert({ no: d.no, label: d.label || id, issued_at: d.date || undefined, params: d.params || {}, data: d, issued_by: SB_USER.id })); },
    async del(id) { await must(sb.from('qs_price_versions').delete().eq('no', +String(id).replace(/^v/, ''))); }
  },
  roles: {
    tables: ['qs_profiles'],
    async list() { const rows = await must(sb.from('qs_profiles').select('id,role,active,role_set_at,role_set_by').not('role', 'is', null)); return rows.map(r => [r.id, { role: r.role, active: r.active, at: isoZ(r.role_set_at), by: r.role_set_by }]); },
    async set(id, d) { await must(sb.from('qs_profiles').update({ role: d.role, active: d.active !== false }).eq('id', id)); },
    async del(id) { await must(sb.from('qs_profiles').update({ role: null }).eq('id', id)); }
  },
  audit: {
    tables: ['qs_audit_log'],
    async list() {
      const since = new Date(Date.now() - 8 * 864e5).toISOString();
      const rows = await must(sb.from('qs_audit_log').select('at,user_id,role,action,ref,detail').gte('at', since).order('at').limit(3000));
      const g = {}; for (const r of rows) { const day = isoZ(r.at).slice(0, 10); (g[day] = g[day] || { entries: [] }).entries.push({ at: isoZ(r.at), uid: r.user_id, role: r.role, act: r.action, ref: r.ref || '', d: r.detail || '' }); }
      return Object.entries(g);
    },
    async set(day, d) { // nhật ký chỉ thêm: ghi mục mới nhất
      const e = (d.entries || []).slice(-1)[0]; if (!e) return;
      await must(sb.from('qs_audit_log').insert({ user_id: SB_USER.id, role: ['sale', 'dutoan', 'chihuy', 'gd'].includes(e.role) ? e.role : null, action: e.act, ref: e.ref || null, detail: e.d || null }));
    },
    async del() { }
  }
};

/* ---------- API kiểu tài liệu cho app ---------- */
const listeners = {}; // col -> Set(fn)
async function refresh(col) {
  const L = listeners[col]; if (!L || !L.size) return;
  try { const docs = (await COLS[col].list()).map(([id, d]) => ({ id, data: () => d })); for (const l of L) l.ok({ docs }); }
  catch (e) { console.error('[supa] tải', col, e); for (const l of L) l.err && l.err(e); }
}
const timers = {};
const soon = col => { clearTimeout(timers[col]); timers[col] = setTimeout(() => refresh(col), 250); };
function watchTables() {
  const ch = sb.channel('cnv-db');
  for (const [col, c] of Object.entries(COLS)) for (const t of c.tables) ch.on('postgres_changes', { event: '*', schema: 'public', table: t }, () => soon(col));
  ch.subscribe();
}
const DB = {
  collection(col) {
    return {
      onSnapshot(ok, err) { (listeners[col] = listeners[col] || new Set()).add({ ok, err }); refresh(col); return () => { }; }
    };
  },
  doc(path) {
    const i = path.indexOf('/'); const col = path.slice(0, i), id = path.slice(i + 1);
    const C = COLS[col]; if (!C) throw new Error('Không hỗ trợ ' + col);
    return {
      async set(data) { await C.set(id, data); soon(col); },
      async delete() { await C.del(id); soon(col); }
    };
  }
};

/* ---------- Người dùng ---------- */
const USER = {
  async me() { return { id: SB_USER.id, name: SB_PROFILE?.full_name || SB_USER.email, email: SB_USER.email, isOwner: SB_PROFILE?.role === 'gd' && SB_PROFILE?.active !== false, canEdit: SB_PROFILE?.role === 'gd' }; },
  async profiles(ids) { const rows = await must(sb.from('qs_profiles').select('id,full_name,email').in('id', ids)); return Object.fromEntries(rows.map(r => [r.id, { name: r.full_name || r.email }])); },
  async search(q) {
    q = (q || '').trim().replace(/[%,()]/g, ' ');
    let qr = sb.from('qs_profiles').select('id,full_name,email,active').limit(8);
    if (q) qr = qr.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
    const rows = await must(qr); return rows.map(r => ({ id: r.id, name: (r.full_name || r.email) + (r.active ? '' : ' · chờ duyệt'), isMe: r.id === SB_USER.id }));
  }
};

/* ---------- Tải file về máy ---------- */
const MIME = { xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pdf: 'application/pdf', html: 'text/html;charset=utf-8', json: 'application/json', csv: 'text/csv;charset=utf-8', txt: 'text/plain;charset=utf-8', zip: 'application/zip' };
const DOWNLOADS = {
  async save({ filename, data }) {
    const ext = (filename.split('.').pop() || '').toLowerCase();
    const blob = data instanceof Blob ? data : new Blob([data], { type: MIME[ext] || 'application/octet-stream' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }
};

/* ---------- Lưu bản vẽ gốc (bucket riêng tư drawings) ---------- */
const ASSETS = {
  async upload(file, opts) {
    const safe = (file.name || 'file').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.-]+/g, '_').slice(-80);
    const path = `${SB_USER.id}/${Date.now().toString(36)}-${safe}`;
    const { error } = await sb.storage.from('drawings').upload(path, file, { contentType: opts?.type || file.type || undefined, upsert: false });
    if (error) throw sbErr(error); return { id: path };
  },
  async url(id) { const { data, error } = await sb.storage.from('drawings').createSignedUrl(id, 3600); if (error) throw sbErr(error); return data.signedUrl; }
};

/* ---------- AI bóc khối lượng: Edge Function analyze-drawing (khoá Anthropic nằm trong secrets) ---------- */
const blobB64 = b => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = no; r.readAsDataURL(b); });
function parseJsonLoose(t) {
  t = String(t || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return JSON.parse(t); } catch (e) { }
  const a = t.indexOf('{'), b = t.lastIndexOf('}'); if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { } }
  const x = new Error('invalid_json'); x.code = 'invalid_json'; throw x;
}
const SAMPLE = {
  async limits() { return { images: { maxCount: 8 } }; },
  async json(prompt, opts = {}) {
    const images = [];
    for (const b of opts.images || []) images.push({ media_type: b.type || 'image/jpeg', data: await blobB64(b) });
    const { data: { session } } = await sb.auth.getSession();
    let r;
    try {
      r = await fetch(`${SB_URL}/functions/v1/analyze-drawing`, { method: 'POST', signal: opts.signal, headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ prompt, images, tier: opts.modelTier || 'complex' }) });
    } catch (e) { const x = new Error(e.name === 'AbortError' ? 'cancelled' : 'network'); x.code = e.name === 'AbortError' ? 'cancelled' : 'network'; throw x; }
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.error) { const x = new Error(j.error?.message || ('HTTP ' + r.status)); x.code = j.error?.code || (r.status === 404 ? 'sampling_disabled' : 'http_' + r.status); throw x; }
    try { opts.onText && opts.onText({ text: j.text || '' }); } catch (e) { }
    return parseJsonLoose(j.text);
  }
};

window.claude = { async use(name) { return { db: DB, user: USER, downloads: DOWNLOADS, assets: ASSETS, sample: SAMPLE }[name] || null; } };

/* ---------- Đăng nhập email ---------- */
function loginScreen(msg) {
  const el = document.getElementById('app');
  el.innerHTML = `<div class="login"><div class="panel stack" style="max-width:380px;margin:12vh auto;padding:28px">
   <div class="brand"><img class="logo" src="assets/logo.png" alt="CENOVA Design &amp; Build" width="132" height="36"><span class="appname">APP DỰ TOÁN</span></div>
   <h2 style="margin:8px 0 0">Đăng nhập</h2>
   <label class="f"><span class="lbl">Email hoặc tên đăng nhập</span><input id="lg_email" type="text" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="ten@cenovaasia.com hoặc admin"></label>
   <label class="f"><span class="lbl">Mật khẩu</span><input id="lg_pw" type="password" autocomplete="current-password" placeholder="Để trống nếu muốn nhận link qua email"></label>
   <div class="row" style="gap:8px;flex-wrap:wrap"><button class="b pri" id="lg_go">Đăng nhập</button><button class="b" id="lg_link">Gửi link đăng nhập qua email</button></div>
   <button class="b sm ghost" id="lg_reset" style="align-self:flex-start">Quên / đặt mật khẩu</button>
   <div id="lg_msg" class="sm ${msg ? '' : 'muted'}">${msg || 'Tài khoản do Giám đốc mời. Lần đầu: bấm “Gửi link đăng nhập”, mở email và bấm link.'}</div></div></div>`;
  const $m = t => { document.getElementById('lg_msg').textContent = t; };
  const em = () => { const v = document.getElementById('lg_email').value.trim().toLowerCase(); return v && !v.includes('@') ? v + '@cenova.local' : v; };
  document.getElementById('lg_go').onclick = async () => {
    const pw = document.getElementById('lg_pw').value;
    if (!em()) return $m('Nhập email.');
    if (!pw) return document.getElementById('lg_link').click();
    $m('Đang đăng nhập…'); const { error } = await sb.auth.signInWithPassword({ email: em(), password: pw });
    if (error) $m('Không đăng nhập được: ' + (error.message === 'Invalid login credentials' ? 'sai email hoặc mật khẩu' : error.message));
  };
  document.getElementById('lg_link').onclick = async () => {
    if (!em()) return $m('Nhập email.');
    $m('Đang gửi…'); const { error } = await sb.auth.signInWithOtp({ email: em(), options: { emailRedirectTo: location.origin + location.pathname } });
    $m(error ? 'Không gửi được: ' + error.message : 'Đã gửi link tới ' + em() + '. Mở email và bấm link để vào app.');
  };
  document.getElementById('lg_reset').onclick = async () => {
    if (!em()) return $m('Nhập email trước.');
    const { error } = await sb.auth.resetPasswordForEmail(em(), { redirectTo: location.origin + location.pathname + '#dat-mat-khau' });
    $m(error ? 'Không gửi được: ' + error.message : 'Đã gửi email đặt mật khẩu tới ' + em() + '.');
  };
  document.getElementById('lg_pw').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('lg_go').click(); });
}
function userChip() {
  let c = document.getElementById('sb_chip'); if (c) return;
  c = document.createElement('div'); c.id = 'sb_chip';
  c.innerHTML = `<span>${SB_USER.email}</span><button class="b sm ghost" id="sb_pw">Đặt mật khẩu</button><button class="b sm ghost" id="sb_out">Đăng xuất</button>`;
  document.body.appendChild(c);
  c.querySelector('#sb_out').onclick = async () => { await sb.auth.signOut(); location.reload(); };
  c.querySelector('#sb_pw').onclick = setPassword;
}
async function setPassword() {
  const p = prompt('Mật khẩu mới (ít nhất 8 ký tự):'); if (!p) return;
  if (p.length < 8) return alert('Mật khẩu cần ít nhất 8 ký tự.');
  const { error } = await sb.auth.updateUser({ password: p });
  alert(error ? 'Không đổi được: ' + error.message : 'Đã đặt mật khẩu. Lần sau đăng nhập bằng email + mật khẩu.');
}
async function loadProfile() {
  for (let i = 0; i < 5; i++) { // hồ sơ được tạo bằng trigger ngay khi có tài khoản
    const { data } = await sb.from('qs_profiles').select('id,full_name,email,role,active').eq('id', SB_USER.id).maybeSingle();
    if (data) return data; await new Promise(r => setTimeout(r, 600));
  }
  return null;
}
/* Bảng giá vốn chuẩn: chỉ tải sau khi đăng nhập (không nằm trong mã trang) */
async function loadBaseCatalog() {
  const rows = await must(sb.from('qs_price_catalog').select('code,name,unit,spec,cost,bien,market_min,market_max,source,data').eq('is_custom', false));
  rows.sort((a, b) => (+a.data?.i || 0) - (+b.data?.i || 0));
  window.__CAT_RAW__ = rows.map(r => [r.code, r.name, r.unit, r.spec || '', +r.cost, r.bien, +r.market_min, +r.market_max, r.source || '', r.data?.url || '', r.data?.conf || '', r.data?.ref || '']);
  if (window.__CAT_RAW__.length < 300) throw new Error('Bảng giá tải về không đủ (' + window.__CAT_RAW__.length + ' mã)');
}
function loadScript2(src) { return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Không tải được ' + src)); document.body.appendChild(s); }); }
let booted = false;
async function cnvBoot(start) {
  const go = async (session) => {
    if (!session) { booted = false; loginScreen(); return; }
    if (booted) return; booted = true;
    SB_USER = session.user; SB_PROFILE = await loadProfile();
    if (!SB_PROFILE || SB_PROFILE.active === false) { const em = SB_USER.email; await sb.auth.signOut(); booted = false; loginScreen('Tài khoản ' + em + ' chưa được Giám đốc duyệt hoặc đã bị khoá. Nhờ Giám đốc gán vai trò ở màn Người dùng rồi đăng nhập lại.'); return; }
    document.getElementById('app').innerHTML = '<div class="empty" style="margin:20vh auto;text-align:center">Đang tải bảng giá…</div>';
    try { await loadBaseCatalog(); await loadScript2(APP_BUNDLE); }
    catch (e) { document.getElementById('app').innerHTML = '<div class="banner warn" style="margin:20vh auto;max-width:520px">Không tải được app: ' + (e.message || e) + '. Tải lại trang thử lại.</div>'; return; }
    userChip(); watchTables(); start();
    if (location.hash === '#dat-mat-khau') { history.replaceState(null, '', location.pathname); setPassword(); }
  };
  const { data: { session } } = await sb.auth.getSession();
  await go(session);
  sb.auth.onAuthStateChange((ev, s) => { if (ev === 'SIGNED_IN' && !booted) go(s); if (ev === 'SIGNED_OUT') location.reload(); });
}

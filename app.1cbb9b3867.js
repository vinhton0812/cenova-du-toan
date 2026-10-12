const CAT_RAW=window.__CAT_RAW__;
/* ===================== DANH MỤC & THAM SỐ ===================== */
const LAYERS={1:'Xây dựng & hoàn thiện',2:'Cơ điện (M&E)',3:'Nội thất & thiết bị',4:'Thiết kế & pháp lý',9:'Chi phí chung'};
const LCOL={1:'var(--l1)',2:'var(--l2)',3:'var(--l3)',4:'var(--l4)',9:'var(--l9)'};
const GROUPS={
 '1-02':'Xây tô cải tạo','1-03':'Chống thấm','1-04':'Sàn (vinyl, epoxy, gạch)','1-05':'Trần thạch cao, trần thả','1-06':'Vách thạch cao, vách kính','1-07':'Ốp tường (HPL, PVC, than tre)','1-08':'Sơn','1-09':'Cửa','1-10':'Mặt tiền, bảng hiệu','1-11':'Phần thô nhà phố','1-12':'Vật liệu chính bán lại','1-13':'Che chắn bức xạ (chì)',
 '2-01':'Điện động lực, tủ điện, UPS','2-02':'Chiếu sáng','2-03':'Cấp thoát nước, nước nóng','2-04':'Khí nén, hút, oxy','2-05':'Điều hòa, thông gió, xông hơi','2-06':'Điện nhẹ (mạng, camera, âm thanh)','2-07':'PCCC','2-08':'Xử lý nước thải y tế',
 '3-01':'Tủ kệ gỗ công nghiệp','3-02':'Quầy lễ tân, đá','3-03':'Đồ inox y tế','3-04':'Giường spa, ghế salon, gương','3-05':'Rèm, decor, ghế chờ','3-06':'Thiết bị chuyên dụng (ghế nha, đèn khám)','3-07':'Ván & phụ kiện bán lẻ',
 '4-01':'Thiết kế 2D/3D, M&E','4-02':'Giấy phép hoạt động, bức xạ','4-03':'Hồ sơ PCCC','4-04':'Môi trường, nước thải',
 '1-00':'Ngoài danh mục – xây dựng (cần báo giá)','2-00':'Ngoài danh mục – M&E (cần báo giá)','3-00':'Ngoài danh mục – nội thất (cần báo giá)','4-00':'Ngoài danh mục – thiết kế, pháp lý','9-00':'Ngoài danh mục – chi phí chung','9-02':'Vận chuyển, phí tòa nhà','9-03':'Bao che, vệ sinh, giàn giáo','9-05':'Nhân công ngày'};
const BIEN_LABEL={TC:'B1 thi công/trọn gói',VT:'B2 vật tư bán lại',TB:'B3 thiết bị mua hộ',DV:'B4 dịch vụ thuê ngoài',PN:'Phí nhà nước'};
const CAT={}, REF={};
CAT_RAW.forEach(r=>{const [code,name,unit,spec,cost,bien,mmin,mmax,src,url,conf,ref]=r;
  CAT[code]={code,name,unit,spec,cost,bien,mmin,mmax,src,url,conf,ref,layer:+code[0],grp:code.slice(0,4)};REF[ref]=code;});
const PARAMS0={B1:.25,B2:.10,B3:.10,B4:.15,PN:0,VAT:.10,QL:.04,DP:.07,KCAP:.35,LAP:.05,HL:30};
const BIEN_KEY={TC:'B1',VT:'B2',TB:'B3',DV:'B4',PN:'PN'};
const KDK=[
 {id:'small',label:'Mặt bằng nhỏ dưới 80 m²',pct:.06,scope:'all',auto:true},
 {id:'hem',label:'Hẻm dưới 3 m, không có bãi tập kết',pct:.04,scope:'all'},
 {id:'caitao',label:'Cải tạo khi cơ sở vẫn hoạt động',pct:.20,scope:'TC',note:'chỉ áp dòng thi công/nhân công'},
 {id:'gap',label:'Tiến độ gấp',pct:.12,scope:'TC',note:'chỉ áp dòng thi công/nhân công'},
 {id:'tinh',label:'Công trình ngoại tỉnh',pct:.07,scope:'all'},
 {id:'tang5',label:'Tầng 5 trở lên, không có thang hàng',pct:.04,scope:'all'}];
const KDD=[{id:'pho',label:'Nhà phố thuê',pct:0},{id:'shop',label:'Shophouse, trệt chung cư',pct:.05},{id:'vp',label:'Tòa văn phòng',pct:.12},{id:'tttm',label:'Trung tâm thương mại',pct:.22}];
const KKT=[{id:'',label:'—',k:1},{id:'cove',label:'Vinyl bo góc cove ×1,10',k:1.10},{id:'laser',label:'Cách âm phòng laser ×1,20',k:1.20},{id:'ups',label:'Điện 3 pha có UPS ×1,15',k:1.15},{id:'kho',label:'Thi công khó ×1,10',k:1.10}];
const STATUS=[['nhap','Nháp'],['gui','Đã gửi khách'],['ky','Đã ký'],['thicong','Đang thi công'],['quyettoan','Quyết toán']];

/* Gói điểm: [ref, khối lượng mỗi điểm, thiết bị (true = có thể đánh dấu CĐT cấp)] */
const POINTS={
 GHE_NHA:{name:'Ghế nha',unit:'ghế',lines:[['4b-32',6],['4b-33',6],['4b-53',16],['4b-5',15],['4b-13',2],['4b-16',1],['4b-31',1],['4c-5',1.5],['4c-33',1,true]]},
 XQ:{name:'Phòng X-quang nha',unit:'phòng',lines:[['4a-40',45],['4a-41',1],['4a-42',1],['4a-44',1],['4b-13',2]],low:true},
 TIET:{name:'Phòng tiệt trùng',unit:'phòng',lines:[['4b-40',1],['4b-13',4],['4b-64',1],['4c-8',1,true],['4c-5',2]]},
 BUONG_KHAM:{name:'Buồng khám ≥ 10 m²',unit:'buồng',lines:[['4b-40',1],['4b-13',4],['4b-16',2],['4b-64',1],['4a-48',1.8],['4a-49',1],['4a-50',1],['4c-10',1,true],['4c-8',1,true]]},
 THU_THUAT:{name:'Buồng thủ thuật',unit:'buồng',lines:[['4b-40',1],['4b-13',4],['4b-16',2],['4b-64',1],['4a-48',1.8],['4a-49',1],['4a-50',1],['4b-19',1,true],['4b-54',1,true],['4c-8',1,true]]},
 XET_NGHIEM:{name:'Phòng xét nghiệm',unit:'phòng',lines:[['4b-40',1],['4b-13',6],['4b-64',1],['4c-5',3],['4a-16',10]]},
 GIUONG_SPA:{name:'Giường spa / thẩm mỹ',unit:'giường',lines:[['4b-13',2],['4b-5',10],['4b-17',2],['4b-14',2],['4b-81',.5],['4b-82',.25],['4b-76',.5],['4c-50',3],['4c-19',1,true]]},
 BON_GOI:{name:'Bồn gội',unit:'bồn',lines:[['4b-41',1],['4b-37',6],['4b-13',1],['4c-25',1,true]]},
 XONG_HOI:{name:'Phòng xông hơi khô',unit:'phòng',lines:[['4b-70',1]]},
 GHE_SALON:{name:'Ghế salon (cắt/uốn)',unit:'ghế',lines:[['4b-13',2],['4b-18',1],['4b-17',1],['4b-14',1],['4c-26',1,true]]},
 BAN_NAIL:{name:'Bàn nail',unit:'bàn',lines:[['4b-13',2],['4b-67',1],['4c-29',1,true],['4c-27',1,true]]}};
/* Thiết bị dùng chung chọn theo số điểm */
const SHARED=[
 {basis:'GHE_NHA',label:'Máy nén khí dùng chung',tiers:[[1,'4b-44'],[2,'4b-45'],[3,'4b-46'],[99,'4b-47']],tb:true},
 {basis:'GHE_NHA',label:'Máy hút trung tâm',tiers:[[2,'4b-49'],[4,'4b-50'],[99,'4b-51']],tb:true},
 {basis:'GHE_NHA',label:'Công lắp đường hút',per:3,ref:'4b-36'},
 {basis:'BON_GOI',label:'Heat pump nước nóng',tiers:[[3,'4b-27'],[99,'4b-28']],tb:true},
 {basis:'BON_GOI',label:'Lắp đặt heat pump',per:99,ref:'4b-25'}];
/* Mẫu dự án: dòng [ref, a (×m²), c (hằng số), làm tròn] */
const COMMON=(o)=>[
 ['S63',.9,0],['S65',o.giat,0],['S72',.9+o.giat,0],['S71',o.vach,0],
 ...o.san,['4a-37',2.2,0],
 ['4a-47',0,o.cua],['4a-49',0,o.cua],['4a-50',0,o.cua],
 ['4a-62',0,o.kinh],['4c-38',0,o.alu],['4c-40',0,1.5],
 ['S30',1,0],['4b-16',.1,0,'ceil'],['4b-17',.08,0,'ceil'],['4b-14',.18,0,'ceil'],
 ['4b-55',.04,0,'ceil'],['4b-62',.04,0,'ceil'],['4b-63',.32,0,'ceil'],
 ['4b-76',0,o.lan],['4b-78',0,o.cam],['4b-80',0,1],
 ['PCCC',0,1],['4b-95',.02,0,'ceil'],['4b-97',0,2],
 ...o.extra,
 ['4d-39',1,0],['4d-37',.04,0,'ceil']];
const TEMPLATES={
 nha:{label:'Nha khoa',S:100,pts:{GHE_NHA:3,XQ:1,TIET:1},weeks:'4–6 tuần',clinic:'ck',
   lines:COMMON({giat:.15,vach:.8,san:[['4a-8',.7,0],['4a-3',.7,0],['4a-70',.3,0]],cua:5,kinh:12,alu:6,lan:6,cam:4,
   extra:[['4b-102',0,1],['4c-4',0,1],['4c-5',0,12],['4c-12',0,2],['4d-1',1,0],['4d-7',1,0],['4d-16',0,1],['4d-18',0,1],['4d-25',0,1]]})},
 dakhoa:{label:'Phòng khám đa khoa',S:150,pts:{BUONG_KHAM:5,THU_THUAT:1,XET_NGHIEM:1},weeks:'6–8 tuần',clinic:'dk',
   lines:COMMON({giat:.13,vach:1.0,san:[['4a-8',.73,0],['4a-3',.73,0],['4a-70',.27,0]],cua:9,kinh:15,alu:8,lan:10,cam:6,
   extra:[['4b-103',0,1],['4b-30',0,2],['4b-25',0,2],['4c-4',0,1],['4c-5',0,20],['4c-12',0,4],['4d-1',1,0],['4d-7',1,0],['4d-17',0,1],['4d-18',0,1],['4d-25',0,1]]})},
 spa:{label:'Spa / thẩm mỹ',S:150,pts:{GIUONG_SPA:6,BON_GOI:2,XONG_HOI:1},weeks:'5–8 tuần',
   lines:COMMON({giat:.2,vach:1.0,san:[['4a-8',.67,0],['4a-3',.67,0],['4a-70',.33,0]],cua:8,kinh:12,alu:6,lan:6,cam:6,
   extra:[['4c-1',0,1],['4c-5',0,15],['4c-14',0,1],['4d-4',1,0]]})},
 salon:{label:'Salon tóc & nail',S:100,pts:{GHE_SALON:8,BON_GOI:3,BAN_NAIL:2},weeks:'3–5 tuần',
   lines:COMMON({giat:.2,vach:.4,san:[['4a-70',1,0]],cua:2,kinh:15,alu:6,lan:4,cam:4,
   extra:[['4c-2',0,1],['4c-5',0,10],['4c-14',0,1],['4d-6',1,0]]})}};

/* ===================== TIỆN ÍCH ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(n==null||isNaN(n))?'—':Math.round(n).toLocaleString('vi-VN');
const fmtq=n=>(+n).toLocaleString('vi-VN',{maximumFractionDigits:2});
const tr=n=>{n=+n;if(Math.abs(n)>=1e9)return (n/1e9).toLocaleString('vi-VN',{maximumFractionDigits:2})+' tỷ';if(Math.abs(n)>=1e6)return (n/1e6).toLocaleString('vi-VN',{maximumFractionDigits:1})+' tr';return fmt(n);};
const pct=x=>(x*100).toLocaleString('vi-VN',{maximumFractionDigits:1})+'%';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const today=()=>new Date().toISOString().slice(0,10);
const dvn=s=>{if(!s)return '';const [y,m,d]=s.slice(0,10).split('-');return `${d}/${m}/${y}`;};
function toast(m){document.querySelectorAll('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600);}
function words(n){n=Math.round(n);if(n===0)return 'Không đồng';
 const d=['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
 const read3=(x,full)=>{const h=Math.floor(x/100),t=Math.floor(x%100/10),u=x%10;let s=[];
  if(h||full){s.push(d[h]+' trăm');}
  if(t===0){if(u&&(h||full))s.push('lẻ');}else if(t===1)s.push('mười');else s.push(d[t]+' mươi');
  if(u){if(u===1&&t>1)s.push('mốt');else if(u===5&&t>0)s.push('lăm');else if(u===4&&t>1)s.push('tư');else s.push(d[u]);}
  return s.join(' ');};
 const units=['',' nghìn',' triệu',' tỷ',' nghìn tỷ',' triệu tỷ'];let parts=[],i=0;const grp=[];
 while(n>0){grp.push(n%1000);n=Math.floor(n/1000);}
 for(i=grp.length-1;i>=0;i--){if(grp[i]===0)continue;parts.push(read3(grp[i],i<grp.length-1)+units[i]);}
 const s=parts.join(' ').replace(/\s+/g,' ').trim();return s.charAt(0).toUpperCase()+s.slice(1)+' đồng';}

/* ===================== KHO DỮ LIỆU (db, có dự phòng trong bộ nhớ) ===================== */
const S={role:'dutoan',tab:'nhanh',db:null,dbState:'connecting',projects:{},expenses:{},versions:[],proposals:{},cur:null,quick:null,sel:null,qmode:'nhom',filter:'',fl:'all'};
try{const r=localStorage.getItem('cnv_role');if(r)S.role=r;}catch(e){}
const mem={};
const store={
 async set(path,data){if(S.db){try{await S.db.doc(path).set(data);return true;}catch(e){toast('Không lưu được: '+(e.message||e.code));return false;}}mem[path]=data;applyMem();return true;},
 async del(path){if(S.db){try{await S.db.doc(path).delete();}catch(e){toast('Không xóa được');}}else{delete mem[path];applyMem();}}};
function applyMem(){S.roles={};S.audit={};S.projects={};S.expenses={};S.proposals={};S.versions=[];
 for(const [p,d] of Object.entries(mem)){const [c,id]=p.split('/');if(c==='projects')S.projects[id]=d;if(c==='expenses')S.expenses[id]=d;if(c==='proposals')S.proposals[id]=d;if(c==='versions')S.versions.push(d);if(c==='settings'&&id==='company')S.company=d;if(c==='roles')S.roles[id]=d;if(c==='audit')S.audit[id]=d;}
 const cx={};for(const [p,d] of Object.entries(mem)){const [c,id]=p.split('/');if(c==='catalog')cx[id]=d;}applyCatalog(cx);
 S.versions.sort((a,b)=>a.no-b.no);render();}
async function initDb(){
 let db=null;try{db=window.claude?await window.claude.use('db'):null;}catch(e){db=null;}
 if(!db){S.dbState='offline';render();return;}
 S.db=db;S.dbState='online';
 const sub=(col,fn)=>db.collection(col).onSnapshot(s=>{fn(s);render();},e=>{S.dbState='offline';render();});
 sub('projects',s=>{S.projects={};s.docs.forEach(d=>S.projects[d.id]=d.data());});
 sub('expenses',s=>{S.expenses={};s.docs.forEach(d=>S.expenses[d.id]=d.data());});
 sub('proposals',s=>{S.proposals={};s.docs.forEach(d=>S.proposals[d.id]=d.data());});
 sub('catalog',s=>{const d={};s.docs.forEach(x=>d[x.id]=x.data());applyCatalog(d);});
 sub('settings',s=>{const d=s.docs.find(x=>x.id==='company');S.company=d?d.data():{};});
 sub('versions',s=>{S.versions=s.docs.map(d=>d.data()).sort((a,b)=>a.no-b.no);});
 sub('roles',s=>{S.roles={};s.docs.forEach(d=>S.roles[d.id]=d.data());applyRole();});
 sub('audit',s=>{S.audit={};s.docs.forEach(d=>S.audit[d.id]=d.data());});
 render();}

/* ===================== PHIÊN BẢN GIÁ ===================== */
function curVersion(){const v=S.versions.filter(x=>x.status==='issued');return v.length?v[v.length-1]:{no:1,label:'v1',date:'2026-10-10',changes:{},params:{}};}
function costOf(code,ver){ver=ver||curVersion();let c=CAT[code].cost;for(const v of S.versions){if(v.status!=='issued'||v.no>ver.no)continue;if(v.changes&&v.changes[code]!=null)c=v.changes[code];}return c;}
function paramsOf(ver){ver=ver||curVersion();let p={...PARAMS0};for(const v of S.versions){if(v.status!=='issued'||v.no>ver.no)continue;Object.assign(p,v.params||{});}return p;}

/* ===================== SINH DỰ TOÁN ===================== */
function rq(x,r){if(r==='ceil')return Math.ceil(x-1e-9);return Math.round(x*100)/100;}
function buildLines(type,S2,pts){const T=TEMPLATES[type];const m=new Map();const ver=curVersion();
 const add=(ref,q,src,tb)=>{if(q<=0)return;let code=REF[ref];if(ref==='PCCC')code=REF[S2<200?'4b-91':'4b-92'];
  if(!code){console.warn('thiếu',ref);return;}
  const L=m.get(code);if(L){L.qty=Math.round((L.qty+q)*100)/100;if(!L.src.includes(src))L.src+=', '+src;return;}
  const it=CAT[code];m.set(code,{code,name:it.name,unit:it.unit,qty:Math.round(q*100)/100,cost:costOf(code,ver),bien:it.bien,kkt:'',on:true,cdt:!!(tb&&it.bien==='TB'&&/ghế nha/i.test(it.name)),tb:!!tb||it.bien==='TB',src,mmin:it.mmin,mmax:it.mmax});};
 T.lines.forEach(([ref,a,c,r])=>add(ref,rq(a*S2+c,r),'mẫu '+T.label));
 for(const [k,n] of Object.entries(pts)){if(!n)continue;const P=POINTS[k];P.lines.forEach(([ref,q,tb])=>add(ref,rq(q*n),'gói '+P.name.toLowerCase(),tb));}
 SHARED.forEach(sh=>{const n=pts[sh.basis]||0;if(!n)return;
  if(sh.tiers){const t=sh.tiers.find(([mx])=>n<=mx);add(t[1],1,sh.label.toLowerCase()+' ('+n+' '+POINTS[sh.basis].unit+')',sh.tb);}
  else add(sh.ref,Math.ceil(n/sh.per),sh.label.toLowerCase());});
 return [...m.values()].sort((a,b)=>a.code.localeCompare(b.code));}
function newEstimate(q){const ver=curVersion();
 return {id:uid(),ma:'DT-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,5).toUpperCase(),
  ten:q.ten||('Dự án '+TEMPLATES[q.type].label.toLowerCase()),khach:q.khach||'',diachi:q.diachi||'',type:q.type,S:q.S,pts:{...q.pts},tang:q.tang||1,
  dd:q.dd,dk:{...q.dk},laser:!!q.laser,ver:ver.no,params:{...paramsOf(ver),CK:0},status:'nhap',created:new Date().toISOString(),updated:new Date().toISOString(),
  notes:[],lines:buildLines(q.type,q.S,q.pts)};}

/* ===================== TÍNH GIÁ ===================== */
function kdk(e){let all=0,tc=0;const on=[];
 KDK.forEach(k=>{const act=k.auto?(e.S<80):!!e.dk[k.id];if(!act)return;on.push(k);if(k.scope==='TC')tc+=k.pct;else all+=k.pct;});
 const dd=(KDD.find(x=>x.id===e.dd)||KDD[0]);all+=dd.pct;const cap=e.params.KCAP;
 return {all:Math.min(all,cap),tc:Math.min(all+tc,cap),on,dd};}
function priceLine(L,e,K){const p=e.params;const m=p[BIEN_KEY[L.bien]]||0;const kk=(KKT.find(x=>x.id===L.kkt)||KKT[0]).k;
 let k=1;if(L.bien==='TC')k=1+K.tc;else if(L.bien==='VT')k=1+K.all;
 if(L.cdt){const unit=Math.round(L.cost*p.LAP*(1+p.B1)/100)*100;return {unit,amt:Math.round(unit*L.qty),costAmt:Math.round(L.cost*p.LAP*L.qty),k:1,m:p.B1};}
 const unit=Math.round(L.cost*(1+m)*k*kk/100)*100;return {unit,amt:Math.round(unit*L.qty),costAmt:Math.round(L.cost*L.qty*kk),k,m};}
function totals(e){const K=kdk(e);const p=e.params;let direct=0,cost=0,lo=0,hi=0;const byL={},byLc={};
 e.lines.forEach(L=>{if(!L.on)return;const r=priceLine(L,e,K);direct+=r.amt;cost+=r.costAmt;const ly=+L.code[0];byL[ly]=(byL[ly]||0)+r.amt;byLc[ly]=(byLc[ly]||0)+r.costAmt;
  const kk=(KKT.find(x=>x.id===L.kkt)||KKT[0]).k;const kx=L.bien==='TC'?1+K.tc:L.bien==='VT'?1+K.all:1;
  if(L.cdt){lo+=r.amt;hi+=r.amt;}else{lo+=L.qty*Math.min(r.unit,(L.mmin||r.unit)*kx*kk);hi+=L.qty*Math.max(r.unit,(L.mmax||r.unit)*kx*kk);}});
 const ql=Math.round(direct*p.QL),dp=Math.round((direct+ql)*p.DP),ck=Math.round(+p.CK||0);const pre=direct+ql+dp-ck;const vat=Math.round(pre*p.VAT);
 const f=x=>Math.round((x*(1+p.QL))*(1+p.DP)*(1+p.VAT));
 return {K,direct,ql,dp,ck,pre,vat,total:pre+vat,cost,margin:pre-cost,mpct:pre?(pre-cost)/pre:0,byL,byLc,lo:f(lo),hi:f(hi)};}
function legal(e){const w=[];const p=e.pts||{};let req=0,parts=[];
 if(p.GHE_NHA){const a=10+5*Math.max(0,p.GHE_NHA-1);req+=a;parts.push(`khu ghế nha ${a} m²`);}
 if(p.BUONG_KHAM){req+=10*p.BUONG_KHAM;parts.push(`${p.BUONG_KHAM} buồng khám × 10 m²`);}
 if(p.THU_THUAT){req+=10*p.THU_THUAT;parts.push(`${p.THU_THUAT} buồng thủ thuật × 10 m²`);}
 if(p.XQ){req+=12*p.XQ;parts.push(`phòng X-quang 10–14 m²`);}
 if(req&&e.S*.7<req)w.push({lv:'bad',t:`Diện tích có thể không đủ: cần khoảng ${req} m² cho ${parts.join(', ')} (NĐ 96/2023), trong khi 70% của ${e.S} m² là ${Math.round(e.S*.7)} m² (giả định 30% cho lễ tân, hành lang, WC).`});
 else if(req)w.push({lv:'good',t:`Diện tích đạt mức tối thiểu NĐ 96/2023: cần ${req} m² (${parts.join(', ')}), còn ${Math.round(e.S*.7-req)} m² dư cho phòng phụ.`});
 if(e.type==='spa'&&e.laser)w.push({lv:'bad',t:'Cơ sở có tiêm hoặc laser xâm lấn phải là phòng khám chuyên khoa thẩm mỹ: cần giấy phép hoạt động, buồng lưu 12 m², hồ sơ môi trường. Thêm dòng 4-02 vào dự toán.'});
 if(e.S>=2000||(e.tang||1)>=5)w.push({lv:'warn',t:'Cơ sở y tế từ 5 tầng hoặc 2.000 m² sàn phải thẩm duyệt thiết kế PCCC (NĐ 105/2025). Thêm hồ sơ 4-03.'});
 else if(e.type==='nha'||e.type==='dakhoa')w.push({lv:'info',t:'Dưới 5 tầng và 2.000 m²: chỉ cần hệ báo cháy cơ sở và hồ sơ theo yêu cầu tòa nhà, không bắt buộc thẩm duyệt PCCC.'});
 if(p.XQ)w.push({lv:'warn',t:'Phòng X-quang: giá ốp chì, cửa chì lấy từ 1 nguồn, độ tin cậy thấp. Lấy báo giá riêng trước khi gửi khách.'});
 return w;}

/* ===================== QUYỀN THEO VAI TRÒ ===================== */
const ROLES={sale:'Sale',dutoan:'Dự toán',chihuy:'Chỉ huy công trình',gd:'Kế toán / Giám đốc'};
const can={
 createEst:r=>r==='sale'||r==='dutoan'||r==='gd', editEst:r=>r==='dutoan'||r==='gd', approve:r=>r==='gd', comment:r=>r!=='sale',
 seeCost:r=>r!=='sale', exportInternal:r=>r==='dutoan'||r==='gd'||r==='chihuy', exportQuote:r=>r==='sale'||r==='dutoan'||r==='gd',
 propose:r=>r==='dutoan'||r==='chihuy', issue:r=>r==='gd', enterCost:r=>r==='chihuy'||r==='gd',
 tab:(r,t)=>({nhanh:1,ai:1,hoso:1,chitiet:1,baogia:1,banggia:1,thucchi:r!=='sale',baocao:r!=='sale',nguoidung:r==='gd'})[t]};

/* ===================== KHUNG ỨNG DỤNG ===================== */
const TABS=[['nhanh','Dự toán nhanh'],['ai','AI bóc khối lượng'],['chitiet','Dự toán chi tiết'],['baogia','Xuất báo giá'],['hoso','Hồ sơ hợp đồng'],['banggia','Bảng giá chuẩn'],['thucchi','Thực chi'],['baocao','Báo cáo'],['nguoidung','Người dùng']];
function shell(){const r=S.role;
 return `<header class="top"><div class="top-in">
  <div class="brand"><img class="logo" src="assets/logo.png" alt="CENOVA Design &amp; Build" width="132" height="36"><span class="appname">APP DỰ TOÁN</span></div>
  <div class="role" id="rolebox">${roleBox()}</div>
  <nav class="tabs" role="tablist">${TABS.map(([k,v])=>`<button role="tab" data-tab="${k}" aria-selected="${S.tab===k}" ${can.tab(r,k)?'':'disabled'}>${v}</button>`).join('')}</nav>
 </div></header>
 <main class="wrap"><div id="dbnote"></div><div id="view"></div></main>`;}
function dbNote(){if(S.dbState==='offline')return `<div class="banner warn" style="margin-top:12px">Chưa nối kho dữ liệu chung, dữ liệu bạn nhập chỉ còn trong lần mở trang này.</div>`;return '';}
let PTR=false,PEND=false;document.addEventListener('pointerdown',ev=>{if(ev.target.closest&&ev.target.closest('[data-act],button,a,summary'))PTR=true;},true);document.addEventListener('pointerup',()=>{PTR=false;if(PEND){PEND=false;setTimeout(render,0);}},true);document.addEventListener('pointercancel',()=>{PTR=false;if(PEND){PEND=false;setTimeout(render,0);}},true);
function render(){if(PTR&&$('#view')){PEND=true;return;}if(!$('#view')){document.getElementById('app').innerHTML=shell();bindShell();}
 document.querySelectorAll('nav.tabs button').forEach(b=>{b.setAttribute('aria-selected',S.tab===b.dataset.tab);b.disabled=!can.tab(S.role,b.dataset.tab);});
 $('#dbnote').innerHTML=dbNote();{const rb=$('#rolebox');const h=roleBox();if(rb&&rb.dataset.h!==h){rb.innerHTML=h;rb.dataset.h=h;}}
 if(!can.tab(S.role,S.tab))S.tab='nhanh';
 const v=$('#view');const ae=document.activeElement;const keep=ae&&ae.id&&v.contains(ae)?{id:ae.id,s:ae.selectionStart}:null;const sy=window.scrollY;
 v.innerHTML=({nhanh:vQuick,ai:vAI,hoso:vHoso,chitiet:vDetail,baogia:vQuote,banggia:vBook,thucchi:vCost,baocao:vReport,nguoidung:vUsers})[S.tab]();
 if(keep){const el=document.getElementById(keep.id);if(el){el.focus();try{if(keep.s!=null)el.setSelectionRange(keep.s,keep.s);}catch(e){}}}
 window.scrollTo(0,sy);}
function bindShell(){
 document.querySelector('nav.tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(!b||b.disabled)return;S.tab=b.dataset.tab;render();window.scrollTo(0,0);});
 document.addEventListener('click',onClick);document.addEventListener('change',onChange);document.addEventListener('input',onInput);}
function go(t){S.tab=t;render();window.scrollTo(0,0);}

/* ===================== MÀN 1: DỰ TOÁN NHANH ===================== */
function quickDefault(type){const T=TEMPLATES[type];return {type,S:T.S,pts:{...T.pts},dd:'pho',dk:{},tang:1,laser:false,ten:'',khach:'',diachi:''};}
if(!S.quick)S.quick=quickDefault('nha');
function quickEst(){const q=S.quick;const e=newEstimate(q);return e;}
function vQuick(){const q=S.quick;const e=quickEst();const t=totals(e);const r=S.role;
 const allPts=Object.keys(POINTS);const shown=allPts.filter(k=>k in TEMPLATES[q.type].pts||q.pts[k]);
 return `<div class="row sb" style="margin:20px 0 12px"><div><h2>Dự toán nhanh</h2><div class="muted sm">Chọn loại hình, nhập m² và số điểm. Giá theo bảng giá ${esc(curVersion().label||'v'+curVersion().no)} hiệu lực ${dvn(curVersion().date)}.</div></div><button class="b" data-act="go" data-v="ai">Có bản vẽ? Dùng AI bóc khối lượng</button></div>
 <div class="split">
 <div class="stack">
  <div class="panel stack">
   <div><div class="lbl" style="margin-bottom:6px">Loại hình</div><div class="seg" role="group">${Object.entries(TEMPLATES).map(([k,T])=>`<button data-act="qtype" data-v="${k}" aria-pressed="${q.type===k}">${T.label}</button>`).join('')}</div></div>
   <div class="grid g2">
    <label class="f"><span class="lbl">Diện tích sàn (m²)</span><input id="q_S" type="number" min="10" step="5" value="${q.S}"></label>
    <label class="f"><span class="lbl">Số tầng của tòa nhà</span><input id="q_tang" type="number" min="1" step="1" value="${q.tang}"></label>
   </div>
   <div><div class="lbl" style="margin-bottom:6px">Số điểm chuyên dụng</div><div class="pts">${shown.map(k=>`<label class="pt" for="q_pt_${k}"><span class="sm">${POINTS[k].name}</span><input id="q_pt_${k}" data-pt="${k}" type="number" min="0" step="1" value="${q.pts[k]||0}"></label>`).join('')}</div>
    <details style="margin-top:8px"><summary class="sm">Thêm loại điểm khác</summary><div class="row" style="margin-top:8px">${allPts.filter(k=>!shown.includes(k)).map(k=>`<button class="b sm" data-act="qaddpt" data-v="${k}">+ ${POINTS[k].name}</button>`).join('')||'<span class="muted sm">Đã hiện hết.</span>'}</div></details></div>
   ${q.type==='spa'?`<label class="ck"><input type="checkbox" id="q_laser" ${q.laser?'checked':''}><span>Có tiêm filler hoặc laser xâm lấn</span></label>`:''}
  </div>
  <div class="panel stack">
   <h3>Địa điểm và điều kiện công trường</h3>
   <div class="seg" role="group">${KDD.map(d=>`<button data-act="qdd" data-v="${d.id}" aria-pressed="${q.dd===d.id}">${d.label}${d.pct?` +${pct(d.pct)}`:''}</button>`).join('')}</div>
   <div class="grid g2">${KDK.map(k=>k.auto?`<div class="sm ${q.S<80?'':'muted'}">${k.label} +${pct(k.pct)} · ${q.S<80?'đang áp':'tự áp khi < 80 m²'}</div>`:`<label class="ck"><input type="checkbox" data-dk="${k.id}" ${q.dk[k.id]?'checked':''}><span>${k.label} <span class="muted">+${pct(k.pct)}${k.note?' · '+k.note:''}</span></span></label>`).join('')}</div>
   <div class="sm muted">Hệ số cộng dồn, trần ${pct(PARAMS0.KCAP)}. Đang áp: dòng thi công +${pct(t.K.tc)}, dòng vật tư +${pct(t.K.all)}; thiết bị và dịch vụ không nhân hệ số.</div>
  </div>
  <div class="stack">${legal(e).map(w=>`<div class="banner ${w.lv}">${esc(w.t)}</div>`).join('')}</div>
 </div>
 <aside class="stack" style="position:sticky;top:120px">
  <div class="panel stack">
   <div class="kpi"><span class="lbl">Giá chào dự kiến, đã VAT</span><span class="v big">${tr(t.total)}</span><span class="sm muted">${fmt(t.total)} đ · ${fmt(t.total/q.S)} đ/m²</span></div>
   <div><div class="lbl">Dải giá thị trường</div>${rangeBar(t)}<div class="row sb sm num"><span>${tr(t.lo)}</span><span>${tr(t.hi)}</span></div></div>
   <div class="bars">${[1,2,3,4,9].map(L=>layerBar(L,t.byL[L]||0,t.direct)).join('')}</div>
   ${can.seeCost(r)?`<div class="row sb sm"><span class="muted">Giá vốn ước</span><span class="num">${fmt(t.cost)}</span></div><div class="row sb sm"><span class="muted">Lãi gộp trước VAT</span><span class="num">${fmt(t.margin)} · ${pct(t.mpct)}</span></div>`:''}
   <div class="sm muted">${e.lines.length} hạng mục · thi công ${TEMPLATES[q.type].weeks} · chưa gồm ghế nha và thiết bị CĐT tự mua.</div><div class="row sb"><span class="lbl">Xuất dự toán nhanh</span>${expBtns('quick')}</div>
   ${can.createEst(r)?`<div class="stack" style="gap:8px;border-top:1px solid var(--rule);padding-top:12px">
    <input id="q_ten" placeholder="Tên dự án, ví dụ Nha khoa Minh An" value="${esc(q.ten)}"><input id="q_khach" placeholder="Khách hàng" value="${esc(q.khach)}"><input id="q_diachi" placeholder="Địa chỉ công trình" value="${esc(q.diachi)}">
    <button class="b pri" data-act="qsave">Lưu và mở dự toán chi tiết</button></div>`:`<div class="banner info">Vai trò ${ROLES[r]} chỉ xem dự toán nhanh.</div>`}
  </div>
 </aside></div>
 ${recentList()}`;}
function rangeBar(t){const lo=Math.min(t.lo,t.total),hi=Math.max(t.hi,t.total);const span=hi-lo||1;const pad=span*.15;const a=lo-pad,b=hi+pad;const X=v=>((v-a)/(b-a)*100).toFixed(1)+'%';
 return `<div class="range" aria-label="Dải thị trường và giá chào"><div class="line"></div><div class="band" style="left:${X(t.lo)};width:calc(${X(t.hi)} - ${X(t.lo)})"></div><div class="dot" style="left:${X(t.total)}" title="Giá chào"></div></div>`;}
function layerBar(L,v,tot){return `<div class="bar"><span><span class="swatch" style="background:${LCOL[L]}"></span>${LAYERS[L]}</span><div class="track"><div class="fill" style="width:${tot?(v/tot*100).toFixed(1):0}%;background:${LCOL[L]}"></div></div><span class="num" style="text-align:right">${tr(v)}</span></div>`;}
function recentList(){const ps=Object.values(S.projects).sort((a,b)=>b.updated.localeCompare(a.updated));
 return `<div class="panel" style="margin-top:16px"><div class="row sb" style="margin-bottom:8px"><h3>Dự toán đã lưu</h3><span class="sm muted">${ps.length} dự án</span></div>
 ${ps.length?`<div class="tw"><table><thead><tr><th>Mã</th><th>Dự án</th><th>Loại hình</th><th class="n">m²</th><th class="n">Giá chào đã VAT</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead><tbody>
 ${ps.map(p=>{const t=totals(p);return `<tr><td class="code">${esc(p.ma)}</td><td><a href="#" data-act="open" data-id="${p.id}">${esc(p.ten)}</a><div class="sm muted">${esc(p.khach)}</div></td><td>${TEMPLATES[p.type].label}</td><td class="n">${p.S}</td><td class="n">${fmt(t.total)}</td><td>${stPill(p.status)}</td><td class="sm">${dvn(p.updated)}</td></tr>`;}).join('')}</tbody></table></div>`
 :`<div class="empty">Chưa có dự toán nào. Điền thông số ở trên rồi bấm “Lưu và mở dự toán chi tiết” để tạo dự toán đầu tiên.</div>`}</div>`;}
const stPill=s=>`<span class="st ${s}">${(STATUS.find(x=>x[0]===s)||STATUS[0])[1]}</span>`;

/* ===================== MÀN 2: DỰ TOÁN CHI TIẾT ===================== */
function curProj(){return S.cur?S.projects[S.cur]:null;}
function pickProject(label){const ps=Object.values(S.projects).sort((a,b)=>b.updated.localeCompare(a.updated));
 return `<div class="row" style="margin:20px 0 12px;gap:12px"><h2>${label}</h2><select id="pick" aria-label="Chọn dự án"><option value="">Chọn dự án…</option>${ps.map(p=>`<option value="${p.id}" ${p.id===S.cur?'selected':''}>${esc(p.ma)} · ${esc(p.ten)}</option>`).join('')}</select></div>`;}
function noProject(){return `<div class="panel empty">Chưa chọn dự án. Tạo một dự toán ở màn <a href="#" data-act="go" data-v="nhanh">Dự toán nhanh</a> hoặc chọn dự án đã lưu ở ô phía trên.</div>`;}
function vDetail(){const e=curProj();const r=S.role;if(!e)return pickProject('Dự toán chi tiết')+noProject();
 const t=totals(e);const ed=canEditProj(e)&&e.status!=='quyettoan';const sc=can.seeCost(r);
 let lines=e.lines.map((L,i)=>({L,i}));
 if(S.filter){const f=S.filter.toLowerCase();lines=lines.filter(({L})=>L.name.toLowerCase().includes(f)||L.code.includes(f));}
 if(S.fl!=='all')lines=lines.filter(({L})=>L.code[0]===S.fl);
 let rows='',lastL=null,lastG=null;
 lines.forEach(({L,i})=>{const ly=L.code[0],g=L.code.slice(0,4);
  if(ly!==lastL){const sub=t.byL[ly]||0;rows+=`<tr class="lay"><td colspan="${sc?12:10}"><span class="swatch" style="background:${LCOL[ly]}"></span>${ly}. ${LAYERS[ly]} <span class="num muted" style="float:right">${fmt(sub)}</span></td></tr>`;lastL=ly;}
  if(g!==lastG){rows+=`<tr class="grp"><td colspan="${sc?12:10}">${g} ${GROUPS[g]||''}</td></tr>`;lastG=g;}
  const pr=priceLine(L,e,t.K);const mk=marketFlag(pr.unit/(pr.k||1)/((KKT.find(x=>x.id===L.kkt)||KKT[0]).k),L);
  rows+=`<tr class="${L.on?'':'off'}">
   <td class="keep"><input type="checkbox" data-li="${i}" data-f="on" ${L.on?'checked':''} ${ed?'':'disabled'} aria-label="Bật hạng mục"></td>
   <td class="code">${L.code}</td><td style="min-width:190px">${esc(L.name)}${L.ai?' '+tcPill(L.ai):''}<div class="sm muted">${esc(L.src)}${L.kts?` · giá KTS ${fmt(L.kts)}`:''}</div>${L.custom&&canCat(S.role)&&ed?(S.toCat===i?`<div class="row" style="margin-top:4px"><select id="tocat_grp" style="max-width:220px">${grpOptions(S.toCatGrp||L.code.slice(0,4))}</select><button class="b sm pri" data-act="tocat_ok">Lưu vào bảng giá</button><button class="b sm ghost" data-act="tocat_no">Thôi</button></div>`:`<button class="b sm ghost" data-act="tocat" data-v="${i}" style="padding:0;margin-top:2px">Đưa vào bảng giá chuẩn</button>`):''}</td><td>${esc(L.unit)}</td>
   <td class="n">${ed?`<input type="number" step="any" min="0" data-li="${i}" data-f="qty" value="${L.qty}" aria-label="Khối lượng">`:fmtq(L.qty)}</td>
   ${sc?`<td class="n cost-col">${L.custom&&ed?`<input type="number" min="0" step="1000" data-li="${i}" data-f="cost" value="${L.cost}" aria-label="Giá vốn">`:fmt(L.cost)}${L.custom&&!L.cost?' <span class="pill hi">cần giá</span>':''}</td>`:''}<td><span class="pill ${L.bien}" title="${BIEN_LABEL[L.bien]}">${L.bien}</span></td>
   <td>${ed?`<select data-li="${i}" data-f="kkt" aria-label="Hệ số kỹ thuật">${KKT.map(k=>`<option value="${k.id}" ${L.kkt===k.id?'selected':''}>${k.label}</option>`).join('')}</select>`:((KKT.find(k=>k.id===L.kkt)||KKT[0]).label)}</td>
   <td>${L.tb?`<label class="ck sm"><input type="checkbox" data-li="${i}" data-f="cdt" ${L.cdt?'checked':''} ${ed?'':'disabled'}>CĐT cấp</label>`:''}</td>
   <td class="n">${fmt(pr.unit)}${mk}</td><td class="n">${fmt(L.on?pr.amt:0)}</td>${sc?`<td class="n cost-col">${L.on?pct((pr.amt-pr.costAmt)/(pr.amt||1)):''}</td>`:''}</tr>`;});
 return pickProject('Dự toán chi tiết')+`
 <div class="split"><div class="stack" style="min-width:0">
  <div class="panel"><div class="row sb"><div><div class="row"><h3>${esc(e.ten)}</h3>${stPill(e.status)}</div><div class="sm muted">${esc(e.ma)} · ${TEMPLATES[e.type].label} · ${e.S} m²${e.khach?' · '+esc(e.khach):''}${e.diachi?' · '+esc(e.diachi):''} · bảng giá v${e.ver} · lập ${dvn(e.created)}</div></div>
   <div class="row">${statusControls(e)}</div></div>${assignBox(e)}
   <div class="sm muted" style="margin-top:8px">Điểm: ${Object.entries(e.pts).filter(([,n])=>n).map(([k,n])=>`${POINTS[k].name} ${n}`).join(' · ')||'không'} · ${(KDD.find(x=>x.id===e.dd)||KDD[0]).label} · hệ số thi công +${pct(t.K.tc)}, vật tư +${pct(t.K.all)}</div></div>
  <div class="row sb"><div class="row"><input id="flt" placeholder="Lọc theo tên hoặc mã" value="${esc(S.filter)}" style="width:220px"><select id="fl" aria-label="Lọc theo lớp"><option value="all">Tất cả 5 lớp</option>${[1,2,3,4,9].map(L=>`<option value="${L}" ${S.fl==String(L)?'selected':''}>${L}. ${LAYERS[L]}</option>`).join('')}</select></div>
   ${ed?`<div class="row"><button class="b pri" data-act="mf_toggle">+ Thêm dòng tự nhập</button><select id="addsel" aria-label="Thêm hạng mục" style="max-width:320px"><option value="">+ Thêm hạng mục từ bảng giá…</option>${Object.values(CAT).filter(c=>!e.lines.some(l=>l.code===c.code)).map(c=>`<option value="${c.code}">${c.code} ${esc(c.name).slice(0,70)}</option>`).join('')}</select></div>`:''}</div>
  ${!ed?`<div class="banner info">Vai trò ${ROLES[r]} chỉ xem dự toán${e.status==='quyettoan'?' (dự án đã quyết toán)':''}. Chọn vai trò Dự toán hoặc Kế toán / Giám đốc ở góc trên để thêm, sửa hạng mục.</div>`:''}${ed&&S.showManual?manualForm(e):''}<div class="tw" style="max-height:70vh"><table><thead><tr><th></th><th>Mã</th><th>Hạng mục</th><th>ĐVT</th><th class="n">KL</th>${sc?'<th class="n cost-col">Giá vốn</th>':''}<th>Biên</th><th>K kỹ thuật</th><th>Cấp</th><th class="n">Đơn giá chào</th><th class="n">Thành tiền</th>${sc?'<th class="n cost-col">Lãi</th>':''}</tr></thead><tbody>${rows||`<tr><td colspan="12" class="empty">Không có dòng khớp bộ lọc.</td></tr>`}</tbody></table></div>
  <div class="sm muted">Dòng tắt sẽ hiện ở trang “Phạm vi không bao gồm” của báo giá. Thiết bị “CĐT cấp” chỉ tính công lắp đặt ${pct(e.params.LAP)} giá trị thiết bị (giả định, cần chốt). Cờ ▲/▼ là đơn giá trước hệ số vượt trần hoặc dưới sàn thị trường.</div>
  ${e.ai?aiDossier(e):''}${notesPanel(e)}
 </div>
 <aside class="stack" style="position:sticky;top:120px">${totalsPanel(e,t)}</aside></div>`;}
function marketFlag(u,L){if(L.cdt||!L.mmin||L.mmin===L.mmax)return '';if(L.mmax&&u>L.mmax*1.001)return ` <span class="pill hi" title="Vượt trần thị trường ${fmt(L.mmax)}">▲</span>`;if(L.mmin&&u<L.mmin*.999)return ` <span class="pill lo" title="Dưới sàn thị trường ${fmt(L.mmin)}">▼</span>`;return '';}
function statusControls(e){const r=S.role;const i=STATUS.findIndex(s=>s[0]===e.status);const nx=STATUS[i+1];if(!nx)return '';
 const ok=(nx[0]==='gui'&&(r==='gd'||((r==='dutoan'||r==='sale')&&(S.me.offline||!e.createdBy||isMine(e)))))||(nx[0]!=='gui'&&r==='gd');
 return `<button class="b sm" data-act="status" data-v="${nx[0]}" ${ok?'':'disabled'} title="${ok?'':'Cần vai trò Kế toán / Giám đốc'}">Chuyển sang: ${nx[1]}</button>`;}
function totalsPanel(e,t){const r=S.role;const p=e.params;const ed=canEditProj(e)&&e.status!=='quyettoan';const sc=can.seeCost(r);
 const row=(l,v,cls='')=>`<div class="row sb ${cls}"><span>${l}</span><span class="num">${v}</span></div>`;
 return `<div class="panel stack" style="gap:8px"><h3>Tổng hợp</h3>
  ${[1,2,3,4,9].map(L=>row(`<span class="swatch" style="background:${LCOL[L]}"></span>${LAYERS[L]}`,fmt(t.byL[L]||0),'sm')).join('')}
  <div style="border-top:1px solid var(--rule)"></div>
  ${row('Chi phí trực tiếp',fmt(t.direct))}
  ${row(`Quản lý & giám sát ${ed?`<input id="p_QL" type="number" step=".5" min="0" value="${+(p.QL*100).toFixed(2)}" style="width:60px">%`:pct(p.QL)}`,fmt(t.ql),'sm')}
  ${row(`Dự phòng ${ed?`<input id="p_DP" type="number" step=".5" min="0" value="${+(p.DP*100).toFixed(2)}" style="width:60px">%`:pct(p.DP)}`,fmt(t.dp),'sm')}
  ${row(`Chiết khấu ${ed?`<input id="p_CK" type="number" step="100000" min="0" value="${p.CK||0}" style="width:110px">`:''}`,t.ck?'−'+fmt(t.ck):'0','sm')}
  ${row('<b>Trước VAT</b>','<b>'+fmt(t.pre)+'</b>')}
  ${row(`VAT ${ed?`<select id="p_VAT"><option value=".1" ${p.VAT==.1?'selected':''}>10%</option><option value=".08" ${p.VAT==.08?'selected':''}>8%</option></select>`:pct(p.VAT)}`,fmt(t.vat),'sm')}
  <div class="kpi" style="border-top:1px solid var(--rule);padding-top:8px"><span class="lbl">Tổng giá chào đã VAT</span><span class="v big">${fmt(t.total)}</span><span class="sm muted">${fmt(t.total/e.S)} đ/m² · dải thị trường ${tr(t.lo)}–${tr(t.hi)}</span></div>
  ${sc?`<div style="border-top:1px solid var(--rule)"></div>${row('Giá vốn',fmt(t.cost),'sm')}${row('Lãi gộp',fmt(t.margin)+' · '+pct(t.mpct),'sm')}`:''}
  <div class="row" style="margin-top:8px"><button class="b" data-act="go" data-v="baogia">Xuất báo giá</button>${ed?`<button class="b" data-act="dup">Nhân bản</button>`:''}${canDelProj(e)?`<button class="b ghost" data-act="askdel">Xóa</button>`:''}</div>
  ${S.confirmDel===e.id?`<div class="banner bad">Xóa hẳn ${esc(e.ma)} và thực chi kèm theo? <button class="b sm" data-act="del">Xóa</button><button class="b sm" data-act="nodel">Thôi</button></div>`:''}
 </div>`;}
function aiDossier(e){const A=e.ai;return `<div class="panel stack"><h3>Hồ sơ AI bóc khối lượng</h3><div class="sm muted">Chạy ${dvn(A.at)} · ${A.mode==='merge'?'AI + mẫu bù chỗ thiếu':'chỉ dòng AI + gói điểm'}${A.nguon?' · diện tích '+esc(A.nguon):''}${A.ty_le?' · tỷ lệ '+esc(A.ty_le):''}</div>${A.tom?`<div class="sm">${esc(A.tom)}</div>`:''}<div class="row">${A.files.map(f=>f.asset?`<a class="pill" href="/_blob/${esc(f.asset)}" target="_blank" rel="noopener">${esc(f.name)}</a>`:`<span class="pill">${esc(f.name)}</span>`).join('')}</div>${(A.q||[]).length?`<div class="banner warn"><div><b>Câu hỏi AI nêu</b><ul style="margin:4px 0 0;padding-left:18px">${A.q.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`:''}${(A.ht||[]).length?`<div class="sm"><b>Hiện trạng:</b> ${A.ht.map(esc).join('; ')}</div>`:''}</div>`;}
function notesPanel(e){const r=S.role;return `<div class="panel stack"><h3>Góp ý và lịch sử</h3>
 ${(e.notes||[]).length?(e.notes||[]).slice().reverse().map(n=>`<div class="sm"><b>${esc(ROLES[n.role]||n.role)}</b> <span class="muted">${dvn(n.at)}</span><div>${esc(n.t)}</div></div>`).join(''):'<div class="sm muted">Chưa có góp ý.</div>'}
 ${can.comment(r)?`<div class="row"><input id="note" placeholder="Ví dụ: hiện trạng điện yếu, cần thêm tủ 3 pha" style="flex:1"><button class="b" data-act="note">Ghi</button></div>`:''}</div>`;}

/* ===================== MÀN 3: XUẤT BÁO GIÁ ===================== */
function quoteGroups(e,t){const out={};e.lines.forEach(L=>{if(!L.on)return;const pr=priceLine(L,e,t.K);const ly=L.code[0];const g=L.code.slice(0,4);
  (out[ly]=out[ly]||{});(out[ly][g]=out[ly][g]||[]).push({...L,unit:pr.unit,amt:pr.amt,unitName:L.unit});});return out;}
function vQuote(){const e=curProj();const r=S.role;if(!e)return pickProject('Xuất báo giá')+noProject();const t=totals(e);
 return pickProject('Xuất báo giá')+`<div class="row sb" style="margin-bottom:12px"><div class="seg" role="group"><button data-act="qmode" data-v="nhom" aria-pressed="${S.qmode==='nhom'}">Gộp theo nhóm</button><button data-act="qmode" data-v="dong" aria-pressed="${S.qmode==='dong'}">Chi tiết từng dòng</button></div>
 <div class="row">${can.exportQuote(r)?expBtns('quote','Báo giá khách'):''}${can.exportInternal(r)?expBtns('khoan','Bảng khoán'):''}</div></div>
 <div class="sm muted" style="margin-bottom:12px">PDF dàn trang A4 có logo, gửi khách ngay; Excel để chỉnh sửa. Báo giá khách ẩn giá vốn. Mẫu báo giá chính thức của công ty (BG01–BG03) ở tab Hồ sơ hợp đồng. Bảng khoán nội bộ hiện giá vốn, biên và hệ số từng dòng.</div>
 <div style="overflow-x:auto">${quoteSheet(e,t,S.qmode)}</div>`;}
function quoteSheet(e,t,mode){const G=quoteGroups(e,t);let n=0;let body='';
 const roman=['I','II','III','IV','V'];let li=0;
 for(const L of [1,2,3,4,9]){if(!G[L])continue;const sub=t.byL[L]||0;body+=`<tr style="background:#eef2f1"><td><b>${roman[li++]}</b></td><td colspan="${mode==='dong'?4:2}"><b>${LAYERS[L]}</b></td><td class="n"><b>${fmt(sub)}</b></td></tr>`;
  for(const [g,arr] of Object.entries(G[L])){if(mode==='nhom'){const s=arr.reduce((a,x)=>a+x.amt,0);body+=`<tr><td>${++n}</td><td>${GROUPS[g]||g}</td><td class="sm muted">${arr.length} hạng mục</td><td class="n">${fmt(s)}</td></tr>`;}
   else arr.forEach(x=>{body+=`<tr><td>${++n}</td><td>${esc(x.name)}${x.cdt?' <i>(CĐT cấp, chỉ tính lắp đặt)</i>':''}</td><td>${esc(x.unitName)}</td><td class="n">${fmtq(x.qty)}</td><td class="n">${fmt(x.unit)}</td><td class="n">${fmt(x.amt)}</td></tr>`;});}}
 const off=e.lines.filter(L=>!L.on);const cdt=e.lines.filter(L=>L.on&&L.cdt);const p=e.params;
 const head=mode==='dong'?'<th>STT</th><th>Hạng mục</th><th>ĐVT</th><th class="n">KL</th><th class="n">Đơn giá</th><th class="n">Thành tiền</th>':'<th>STT</th><th>Nhóm hạng mục</th><th></th><th class="n">Thành tiền</th>';
 const cs=mode==='dong'?5:3;const hl=new Date(Date.now()+p.HL*864e5).toISOString();
 return `<div class="sheet" id="sheet">
  <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:2px solid #1b1b1b;padding-bottom:12px">
   <div><div style="font-weight:700;letter-spacing:.22em;font-size:18px">CENOVA</div><div class="muted" style="font-size:11px;letter-spacing:.18em">DESIGN &amp; BUILD</div></div>
   <div style="text-align:right" class="muted">Số: ${esc(e.ma)}<br>Ngày: ${dvn(today())}<br>Hiệu lực đến: ${dvn(hl)}</div></div>
  <h1 style="text-align:center;margin:20px 0 4px">BÁO GIÁ THI CÔNG HOÀN THIỆN</h1>
  <div style="text-align:center" class="muted">${esc(e.ten)} · ${TEMPLATES[e.type].label} · ${e.S} m² sàn</div>
  <table style="margin:16px 0"><tbody><tr><td style="width:140px" class="muted">Kính gửi</td><td>${esc(e.khach)||'……………………'}</td></tr><tr><td class="muted">Địa chỉ công trình</td><td>${esc(e.diachi)||'……………………'}</td></tr><tr><td class="muted">Thời gian thi công</td><td>${TEMPLATES[e.type].weeks} kể từ ngày bàn giao mặt bằng</td></tr></tbody></table>
  <table><thead><tr>${head}</tr></thead><tbody>${body}
   <tr class="tot"><td colspan="${cs}">Chi phí trực tiếp</td><td class="n">${fmt(t.direct)}</td></tr>
   <tr><td colspan="${cs}">Quản lý, giám sát thi công (${pct(p.QL)})</td><td class="n">${fmt(t.ql)}</td></tr>
   <tr><td colspan="${cs}">Dự phòng phát sinh (${pct(p.DP)})</td><td class="n">${fmt(t.dp)}</td></tr>
   ${t.ck?`<tr><td colspan="${cs}">Chiết khấu</td><td class="n">−${fmt(t.ck)}</td></tr>`:''}
   <tr class="tot"><td colspan="${cs}">Cộng trước thuế</td><td class="n">${fmt(t.pre)}</td></tr>
   <tr><td colspan="${cs}">Thuế GTGT (${pct(p.VAT)})</td><td class="n">${fmt(t.vat)}</td></tr>
   <tr class="tot" style="background:#eef2f1"><td colspan="${cs}">TỔNG GIÁ TRỊ ĐÃ GỒM VAT</td><td class="n">${fmt(t.total)}</td></tr></tbody></table>
  <p><i>Bằng chữ: ${words(t.total)}.</i></p>
  <h3 style="margin-top:20px">Phạm vi không bao gồm</h3>
  <ul style="margin:6px 0 0;padding-left:20px">
   ${cdt.map(L=>`<li>${esc(L.name)}: chủ đầu tư tự cấp, Cenova chỉ lắp đặt.</li>`).join('')}
   ${off.map(L=>`<li>${esc(L.name)}</li>`).join('')}
   <li>Phí fit-out, đặt cọc và phí ngoài giờ của ban quản lý tòa nhà (nếu có).</li>
   <li>Thiết bị y tế, máy móc chuyên môn và vật tư tiêu hao không ghi trong bảng trên.</li></ul>
  <h3 style="margin-top:16px">Điều khoản</h3>
  <ul style="margin:6px 0 0;padding-left:20px"><li>Báo giá có hiệu lực ${p.HL} ngày kể từ ngày lập.</li><li>Khối lượng theo hồ sơ thiết kế; phát sinh tính theo đơn giá trong báo giá này.</li><li>Bảo hành 12 tháng; giữ lại 5% giá trị hợp đồng trong thời gian bảo hành.</li></ul>
  <div style="display:flex;justify-content:space-between;margin-top:28px;gap:16px;text-align:center"><div style="flex:1"><b>Đại diện khách hàng</b><div style="height:70px"></div></div><div style="flex:1"><b>Đại diện Cenova D&amp;B</b><div style="height:70px"></div></div></div>
 </div>`;}
async function downloadFile(filename,data){let d=null;try{d=window.claude?await window.claude.use('downloads'):null;}catch(e){}
 if(!d){toast('Trang này chưa được phép tải file.');return;}
 try{await d.save({filename,data});toast('Đã lưu '+filename);}catch(e){if(e.code!=='declined')toast('Không tải được: '+(e.message||e.code));}}
function slug(s){return (s||'du-toan').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);}
function dlHtml(){const e=curProj();const t=totals(e);
 const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo giá ${esc(e.ma)}</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#fff}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #d7dedc;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eef2f1;font-size:11px;text-transform:uppercase}.n{text-align:right;white-space:nowrap}.muted{color:#5f6b68}.sheet{max-width:820px;margin:0 auto;padding:32px;font-size:13px}.tot td{font-weight:700}h1{font-size:22px}@page{size:A4;margin:14mm}@media print{.sheet{padding:0}}</style></head><body>${quoteSheet(e,t,S.qmode)}</body></html>`;
 downloadFile(`Bao-gia-${e.ma}-${slug(e.ten)}.html`,html);}
function dlXlsx(internal){const e=curProj();const t=totals(e);if(!window.XLSX){toast('Thư viện Excel chưa tải xong, thử lại sau vài giây.');return;}
 const rows=[[internal?'BẢNG KHOÁN NỘI BỘ – KHÔNG GỬI KHÁCH':'BÁO GIÁ THI CÔNG HOÀN THIỆN'],[`${e.ma} · ${e.ten} · ${e.khach} · ${e.S} m² · bảng giá v${e.ver}`],[]];
 const hd=internal?['Mã','Hạng mục','ĐVT','KL','Giá vốn','Loại biên','Biên','K điều kiện','K kỹ thuật','CĐT cấp','Đơn giá chào','Thành tiền chào','Thành tiền vốn','Lãi','Nguồn giá']:['STT','Mã','Hạng mục','ĐVT','Khối lượng','Đơn giá','Thành tiền'];rows.push(hd);
 let n=0;[1,2,3,4,9].forEach(L=>{const ls=e.lines.filter(x=>x.code[0]==String(L)&&x.on);if(!ls.length)return;rows.push([LAYERS[L]]);
  ls.forEach(x=>{const pr=priceLine(x,e,t.K);const kk=(KKT.find(k=>k.id===x.kkt)||KKT[0]).k;
   rows.push(internal?[x.code,x.name,x.unit,x.qty,x.cost,x.bien,pr.m,pr.k,kk,x.cdt?'có':'',pr.unit,pr.amt,pr.costAmt,pr.amt-pr.costAmt,CAT[x.code]?.src||'ngoài danh mục'+(x.ai?', AI':'')]:[++n,x.code,x.name,x.unit,x.qty,pr.unit,pr.amt]);});});
 const c=internal?11:6;const pad=a=>{const r=new Array(c+1).fill('');a.forEach((v,i)=>r[c-1+i]=v);return r;};
 rows.push([]);rows.push(pad(['Chi phí trực tiếp',t.direct]));rows.push(pad(['Quản lý & giám sát',t.ql]));rows.push(pad(['Dự phòng',t.dp]));if(t.ck)rows.push(pad(['Chiết khấu',-t.ck]));rows.push(pad(['Trước VAT',t.pre]));rows.push(pad(['VAT',t.vat]));rows.push(pad(['Tổng đã VAT',t.total]));
 if(internal){rows.push(pad(['Giá vốn',t.cost]));rows.push(pad(['Lãi gộp',t.margin]));}
 const ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=internal?[{wch:11},{wch:52},{wch:8},{wch:8},{wch:12},{wch:6},{wch:6},{wch:8},{wch:8},{wch:6},{wch:13},{wch:15},{wch:15},{wch:13},{wch:40}]:[{wch:5},{wch:11},{wch:60},{wch:8},{wch:10},{wch:13},{wch:16}];
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,internal?'Khoan noi bo':'Bao gia');
 const off=e.lines.filter(x=>!x.on||x.cdt).map(x=>[x.code,x.name,x.cdt?'CĐT cấp, chỉ lắp đặt':'Không bao gồm']);if(off.length&&!internal){XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['Mã','Hạng mục','Ghi chú'],...off]),'Khong bao gom');}
 const buf=XLSX.write(wb,{type:'array',bookType:'xlsx'});downloadFile(`${internal?'Khoan':'Bao-gia'}-${e.ma}.xlsx`,new Uint8Array(buf));}

/* ===================== MÀN 4: BẢNG GIÁ CHUẨN ===================== */
function vBook(){const r=S.role;const ver=curVersion();const p=paramsOf(ver);const sc=can.seeCost(r);
 const props=Object.entries(S.proposals).map(([id,x])=>({id,...x})).filter(x=>x.status==='cho');
 let items=Object.values(CAT);const f=(S.bf||'').toLowerCase();if(f)items=items.filter(c=>c.name.toLowerCase().includes(f)||c.code.includes(f));
 if(S.bl&&S.bl!=='all')items=items.filter(c=>c.code[0]===S.bl);
 const shown=items.slice(0,S.bmore?9999:120);
 return `<div class="row sb" style="margin:20px 0 12px"><div><h2>Bảng giá chuẩn</h2><div class="sm muted">Phiên bản đang hiệu lực: <b>${esc(ver.label||'v'+ver.no)}</b> từ ${dvn(ver.date)} · ${Object.keys(CAT).length} hạng mục · dự toán cũ giữ nguyên phiên bản đã dùng.</div></div><div class="row">${canCat(r)?'<button class="b pri" data-act="cat_new">+ Thêm hạng mục</button>':''}${expBtns('book')}</div></div>${catForm()}
 <div class="grid g2" style="margin-bottom:16px">
  <div class="panel"><h3>Biên và tham số</h3><table><tbody>
   ${[['B1','Biên thi công, nhân công, trọn gói'],['B2','Biên vật tư chính bán lại'],['B3','Biên thiết bị mua hộ'],['B4','Biên dịch vụ thiết kế, pháp lý'],['QL','Quản lý & giám sát'],['DP','Dự phòng'],['VAT','VAT'],['KCAP','Trần cộng dồn hệ số điều kiện'],['LAP','Công lắp thiết bị CĐT cấp']].map(([k,l])=>`<tr><td>${l}</td><td class="n">${sc?pct(p[k]):(k.startsWith('B')?'—':pct(p[k]))}</td></tr>`).join('')}
   <tr><td>Hiệu lực báo giá</td><td class="n">${p.HL} ngày</td></tr></tbody></table></div>
  <div class="panel"><h3>Hệ số điều kiện và địa điểm</h3><table><tbody>${KDK.map(k=>`<tr><td>${k.label}${k.note?` <span class="muted sm">(${k.note})</span>`:''}</td><td class="n">+${pct(k.pct)}</td></tr>`).join('')}${KDD.map(k=>`<tr><td>Địa điểm: ${k.label}</td><td class="n">+${pct(k.pct)}</td></tr>`).join('')}${KKT.slice(1).map(k=>`<tr><td>K kỹ thuật: ${k.label}</td><td class="n">×${k.k.toLocaleString('vi-VN')}</td></tr>`).join('')}</tbody></table></div>
 </div>
 ${versionsPanel(props)}
 <div class="row sb" style="margin:16px 0 8px"><div class="row"><input id="bf" placeholder="Tìm hạng mục hoặc mã" value="${esc(S.bf||'')}" style="width:240px"><select id="bl" aria-label="Lọc lớp"><option value="all">Tất cả lớp</option>${[1,2,3,4,9].map(L=>`<option value="${L}" ${S.bl==String(L)?'selected':''}>${L}. ${LAYERS[L]}</option>`).join('')}</select></div><span class="sm muted">${items.length} hạng mục</span></div>
 <div class="tw" style="max-height:70vh"><table><thead><tr><th>Mã</th><th>Hạng mục</th><th>ĐVT</th>${sc?'<th class="n">Giá vốn</th>':''}<th>Biên</th><th class="n">Giá chào</th><th class="n">Thị trường</th><th>Nguồn</th>${can.propose(r)||canCat(r)?'<th></th>':''}</tr></thead><tbody>
 ${shown.map(c=>{const cost=costOf(c.code);const m=p[BIEN_KEY[c.bien]]||0;const offer=Math.round(cost*(1+m)/100)*100;const fl=marketFlag(offer,c);
  return `<tr><td class="code">${c.code}</td><td style="min-width:240px">${esc(c.name)}${c.custom?' <span class="pill ok">bổ sung</span>':''}${c.spec?`<div class="sm muted">${esc(c.spec).slice(0,120)}</div>`:''}</td><td>${esc(c.unit)}</td>${sc?`<td class="n">${fmt(cost)}${cost!==c.cost?` <span class="pill ok" title="Đã đổi so với v1: ${fmt(c.cost)}">mới</span>`:''}</td>`:''}<td><span class="pill ${c.bien}">${c.bien}</span></td><td class="n">${fmt(offer)}${fl}</td><td class="n sm">${c.mmin?fmt(c.mmin)+'–'+fmt(c.mmax):'—'}</td><td class="sm muted" style="min-width:160px">${c.url?`<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.src)}</a>`:esc(c.src)}${c.conf?` · tin cậy ${esc(c.conf)}`:''}</td>
  ${c.custom&&canCat(r)?`<td><div class="row" style="flex-wrap:nowrap"><button class="b sm" data-act="cat_edit" data-v="${c.code}">Sửa</button><button class="b sm ghost" data-act="cat_off" data-v="${c.code}">Ngừng dùng</button></div></td>`:!can.propose(r)&&canCat(r)?'<td></td>':''}${!(c.custom&&canCat(r))&&can.propose(r)?`<td>${S.propCode===c.code?`<div class="row" style="flex-wrap:nowrap"><input id="pc_cost" type="number" value="${cost}" style="width:110px"><input id="pc_why" placeholder="Lý do, nguồn" style="width:150px"><button class="b sm pri" data-act="propsave">Gửi</button></div>`:`<button class="b sm" data-act="prop" data-v="${c.code}">Đề xuất sửa</button>`}</td>`:''}</tr>`;}).join('')}
 </tbody></table></div>
 ${items.length>shown.length?`<div style="margin-top:8px"><button class="b" data-act="bmore">Hiện thêm ${items.length-shown.length} hạng mục</button></div>`:''}
 <details class="panel" style="margin-top:16px"><summary>Gói điểm và mẫu dự án đang dùng</summary>${packsView()}</details>`;}
function versionsPanel(props){const r=S.role;
 return `<div class="panel stack"><div class="row sb"><h3>Đề xuất đổi giá vốn chờ duyệt</h3><span class="sm muted">${props.length} đề xuất</span></div>
 ${props.length?`<div class="tw"><table><thead><tr><th>Mã</th><th>Hạng mục</th><th class="n">Giá hiện tại</th><th class="n">Đề xuất</th><th class="n">Chênh</th><th>Lý do</th><th>Người đề xuất</th>${can.issue(r)?'<th></th>':''}</tr></thead><tbody>
 ${props.map(x=>{const cur=costOf(x.code);return `<tr><td class="code">${x.code}</td><td>${esc(CAT[x.code]?.name)}</td><td class="n">${fmt(cur)}</td><td class="n">${fmt(x.cost)}</td><td class="n">${pct((x.cost-cur)/cur)}</td><td class="sm">${esc(x.why)}</td><td class="sm">${esc(ROLES[x.role]||x.role)} · ${dvn(x.at)}</td>${can.issue(r)?`<td><button class="b sm" data-act="reject" data-v="${x.id}">Từ chối</button></td>`:''}</tr>`;}).join('')}</tbody></table></div>
 ${can.issue(r)?`<div class="row"><input id="vlabel" placeholder="Tên phiên bản, ví dụ v2 – 11/2026" style="width:240px"><button class="b pri" data-act="issue">Duyệt tất cả và ban hành phiên bản mới</button></div>`:`<div class="sm muted">Chỉ Kế toán / Giám đốc duyệt và ban hành phiên bản giá.</div>`}`
 :`<div class="sm muted">Không có đề xuất nào. Dự toán và chỉ huy bấm “Đề xuất sửa” ở dòng hạng mục; báo cáo thực chi cũng gợi ý khi một hạng mục lệch quá 10% ở 2 dự án liên tiếp.</div>`}
 ${S.versions.length?`<div class="sm muted">Lịch sử: v1 (10/2026, từ file bảng giá chuẩn và research 4a–4d)${S.versions.filter(v=>v.status==='issued').map(v=>` → ${esc(v.label)} (${dvn(v.date)}, ${Object.keys(v.changes||{}).length} dòng)`).join('')}</div>`:''}</div>`;}
function packsView(){return `<div class="grid g2" style="margin-top:12px">${Object.entries(POINTS).map(([k,P])=>`<div><h3>${P.name} <span class="muted sm">/ ${P.unit}</span></h3><table><tbody>${P.lines.map(([ref,q,tb])=>{const c=CAT[REF[ref]];return c?`<tr><td class="code">${c.code}</td><td class="sm">${esc(c.name)}${tb?' <span class="pill TB">TB</span>':''}</td><td class="n sm">${fmtq(q)} ${esc(c.unit)}</td></tr>`:'';}).join('')}</tbody></table></div>`).join('')}</div>
 <h3 style="margin-top:16px">Thiết bị dùng chung theo số điểm</h3><ul class="sm">${SHARED.map(s=>`<li>${s.label}: ${s.tiers?s.tiers.map(([m,ref])=>`${m<99?'≤ '+m:'lớn hơn'} → ${CAT[REF[ref]].name}`).join('; '):`1 bộ mỗi ${s.per} ${POINTS[s.basis].unit}`}</li>`).join('')}</ul>
 <h3 style="margin-top:16px">Mẫu dự án (khối lượng = a × m² + c)</h3><div class="tw"><table><thead><tr><th>Mã</th><th>Hạng mục</th>${Object.values(TEMPLATES).map(T=>`<th>${T.label}</th>`).join('')}</tr></thead><tbody>${(()=>{const refs=[...new Set(Object.values(TEMPLATES).flatMap(T=>T.lines.map(l=>l[0])))];return refs.map(ref=>{const c=ref==='PCCC'?{code:'2-07',name:'Báo cháy trọn gói (< 200 m² / 200–500 m²)'}:CAT[REF[ref]];return `<tr><td class="code">${c.code}</td><td class="sm">${esc(c.name)}</td>${Object.values(TEMPLATES).map(T=>{const l=T.lines.find(x=>x[0]===ref);return `<td class="sm num">${l?[l[1]?l[1]+'×m²':'',l[2]?(l[1]?'+ ':'')+l[2]:''].join(' ')+(l[3]?' ⌈⌉':''):'—'}</td>`;}).join('')}</tr>`;}).join('');})()}</tbody></table></div></div>`;}

/* ===================== MÀN 5: THỰC CHI ===================== */
function vCost(){const e=curProj();const r=S.role;if(!e)return pickProject('Thực chi dự án')+noProject();const t=totals(e);
 const ex=(S.expenses[e.id]?.rows)||[];const byCode={};ex.forEach(x=>byCode[x.code]=(byCode[x.code]||0)+x.amount);
 const est={};e.lines.forEach(L=>{if(!L.on)return;est[L.code]=priceLine(L,e,t.K).costAmt;});
 const grp={};const add=(g,k,v)=>{grp[g]=grp[g]||{e:0,a:0};grp[g][k]+=v;};Object.entries(est).forEach(([c,v])=>add(c.slice(0,4),'e',v));Object.entries(byCode).forEach(([c,v])=>add(c.slice(0,4),'a',v));
 const actual=ex.reduce((a,x)=>a+x.amount,0);const ed=can.enterCost(r);
 return pickProject('Thực chi dự án')+`<div class="row sb" style="margin:-4px 0 10px"><span class="sm muted">Xuất báo cáo thực chi</span>${expBtns('cost')}</div><div class="kpis panel" style="margin-bottom:16px">
  <div class="kpi"><span class="lbl">Giá vốn dự toán</span><span class="v">${fmt(t.cost)}</span></div>
  <div class="kpi"><span class="lbl">Thực chi đã nhập</span><span class="v">${fmt(actual)}</span><span class="sm muted">${t.cost?pct(actual/t.cost):''} giá vốn dự toán</span></div>
  <div class="kpi"><span class="lbl">Doanh thu trước VAT</span><span class="v">${fmt(t.pre)}</span></div>
  <div class="kpi"><span class="lbl">Lãi thực tế tạm tính</span><span class="v" style="color:${t.pre-actual<0?'var(--bad)':'inherit'}">${fmt(t.pre-actual)}</span><span class="sm muted">${t.pre?pct((t.pre-actual)/t.pre):''} · dự toán ${pct(t.mpct)}</span></div></div>
 <div class="split"><div class="stack" style="min-width:0">
  <div class="panel"><h3>Chênh lệch theo nhóm</h3><div class="tw"><table><thead><tr><th>Nhóm</th><th class="n">Vốn dự toán</th><th class="n">Thực chi</th><th class="n">Chênh</th><th style="width:30%"></th></tr></thead><tbody>
  ${Object.entries(grp).sort().map(([g,v])=>{const d=v.a-v.e;const pc=v.e?d/v.e:null;const cls=pc==null?'':pc>.1?'hi':pc<-.1?'lo':'ok';const mx=Math.max(v.e,v.a)||1;
   return `<tr><td><span class="code">${g}</span> ${GROUPS[g]||''}</td><td class="n">${fmt(v.e)}</td><td class="n">${v.a?fmt(v.a):'—'}</td><td class="n">${v.a?`<span class="pill ${cls}">${pc==null?'ngoài DT':(d>0?'+':'')+pct(pc)}</span>`:''}</td><td><div class="track" style="height:6px"><div class="fill" style="width:${v.e/mx*100}%;background:var(--muted)"></div></div><div class="track" style="height:6px;margin-top:2px"><div class="fill" style="width:${v.a/mx*100}%;background:${cls==='hi'?'var(--bad)':'var(--accent)'}"></div></div></td></tr>`;}).join('')}
  </tbody></table></div><div class="sm muted" style="margin-top:6px">Vạch xám: vốn dự toán; vạch màu: thực chi. Đỏ khi vượt quá 10%.</div></div>
  <div class="panel"><h3>Chứng từ đã nhập</h3>${ex.length?`<div class="tw"><table><thead><tr><th>Ngày</th><th>Hạng mục</th><th class="n">Số tiền</th><th>Chứng từ</th><th>Nhà cung cấp / đội thợ</th>${ed?'<th></th>':''}</tr></thead><tbody>${ex.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(x=>`<tr><td class="sm">${dvn(x.date)}</td><td><span class="code">${x.code}</span> ${esc(CAT[x.code]?.name||'')}</td><td class="n">${fmt(x.amount)}</td><td class="sm">${esc(x.doc)}</td><td class="sm">${esc(x.vendor)}</td>${ed?`<td><button class="b sm ghost" data-act="exdel" data-v="${x.id}" aria-label="Xóa chứng từ">Xóa</button></td>`:''}</tr>`).join('')}</tbody></table></div>`:`<div class="empty">Chưa có thực chi. ${ed?'Nhập hóa đơn hoặc phiếu khoán thợ ở khung bên phải.':'Chỉ huy hoặc kế toán sẽ nhập khi thi công.'}</div>`}</div>
 </div><aside class="stack">${ed?`<div class="panel stack"><h3>Nhập chi phí</h3>
  <label class="f"><span class="lbl">Hạng mục</span><select id="ex_code">${e.lines.filter(L=>L.on).map(L=>`<option value="${L.code}">${L.code} ${esc(L.name).slice(0,60)}</option>`).join('')}</select></label>
  <label class="f"><span class="lbl">Số tiền (đ, chưa VAT)</span><input id="ex_amt" type="number" min="0" step="1000"></label>
  <label class="f"><span class="lbl">Ngày</span><input id="ex_date" type="date" value="${today()}"></label>
  <label class="f"><span class="lbl">Số chứng từ</span><input id="ex_doc" placeholder="HĐ 0001234 / phiếu khoán"></label>
  <label class="f"><span class="lbl">Nhà cung cấp / đội thợ</span><input id="ex_vendor"></label>
  <button class="b pri" data-act="exadd">Thêm chứng từ</button></div>`:`<div class="banner info">Vai trò ${ROLES[r]} chỉ xem thực chi.</div>`}</aside></div>`;}

/* ===================== MÀN 6: BÁO CÁO ===================== */
function vReport(){const r=S.role;const ps=Object.values(S.projects).sort((a,b)=>a.created.localeCompare(b.created));
 const rows=ps.map(p=>{const t=totals(p);const ex=(S.expenses[p.id]?.rows)||[];const a=ex.reduce((s,x)=>s+x.amount,0);return {p,t,a,has:ex.length>0,done:p.status==='quyettoan'&&ex.length>0};});
 const byType={};rows.forEach(x=>{const k=x.p.type;byType[k]=byType[k]||{n:0,rev:0,cost:0,act:0,actRev:0,m2:0};const b=byType[k];b.n++;b.rev+=x.t.pre;b.cost+=x.t.cost;b.m2+=x.p.S;if(x.done){b.act+=x.a;b.actRev+=x.t.pre;}});
 // hạng mục lệch > 10% ở 2 dự án liên tiếp có thực chi
 const seq={};rows.filter(x=>x.has).forEach(x=>{const ex=S.expenses[x.p.id].rows;const by={};ex.forEach(e=>by[e.code]=(by[e.code]||0)+e.amount);
  x.p.lines.forEach(L=>{if(!L.on||!by[L.code]||!L.qty)return;const est=priceLine(L,x.p,x.t.K).costAmt;(seq[L.code]=seq[L.code]||[]).push({pj:x.p.ma,dev:(by[L.code]-est)/est,unitAct:by[L.code]/L.qty/((KKT.find(k=>k.id===L.kkt)||KKT[0]).k)});});});
 const sugg=Object.entries(seq).map(([code,arr])=>{const l2=arr.slice(-2);const hit=l2.length===2&&l2.every(x=>Math.abs(x.dev)>.1)&&Math.sign(l2[0].dev)===Math.sign(l2[1].dev);return {code,arr,hit,avg:l2.reduce((a,x)=>a+x.unitAct,0)/l2.length};}).filter(x=>x.hit);
 const over=Object.entries(seq).map(([code,arr])=>({code,arr,mx:Math.max(...arr.map(x=>x.dev))})).filter(x=>x.mx>.1).sort((a,b)=>b.mx-a.mx).slice(0,12);
 return `<div class="row sb" style="margin:20px 0 12px"><div><h2>Báo cáo biên và chênh lệch</h2><div class="sm muted">${rows.length} dự toán, ${rows.filter(x=>x.has).length} dự án đã có thực chi.</div></div>${expBtns('report')}</div>
 ${rows.length?`<div class="panel" style="margin-bottom:16px"><h3>Theo loại hình</h3><div class="tw"><table><thead><tr><th>Loại hình</th><th class="n">Số dự toán</th><th class="n">Doanh thu trước VAT</th><th class="n">Đ/m² bình quân</th><th class="n">Biên dự toán</th><th class="n">Biên thực tế (đã quyết toán)</th></tr></thead><tbody>
 ${Object.entries(byType).map(([k,b])=>`<tr><td>${TEMPLATES[k].label}</td><td class="n">${b.n}</td><td class="n">${fmt(b.rev)}</td><td class="n">${fmt(b.rev/b.m2)}</td><td class="n">${pct((b.rev-b.cost)/b.rev)}</td><td class="n">${b.actRev?pct((b.actRev-b.act)/b.actRev):'—'}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="panel" style="margin-bottom:16px"><h3>Theo dự án</h3><div class="tw"><table><thead><tr><th>Mã</th><th>Dự án</th><th>Trạng thái</th><th class="n">Trước VAT</th><th class="n">Vốn dự toán</th><th class="n">Thực chi</th><th class="n">Biên DT</th><th class="n">Biên TT</th></tr></thead><tbody>
 ${rows.slice().reverse().map(x=>`<tr><td class="code">${esc(x.p.ma)}</td><td><a href="#" data-act="open" data-id="${x.p.id}">${esc(x.p.ten)}</a></td><td>${stPill(x.p.status)}</td><td class="n">${fmt(x.t.pre)}</td><td class="n">${fmt(x.t.cost)}</td><td class="n">${x.has?fmt(x.a):'—'}</td><td class="n">${pct(x.t.mpct)}</td><td class="n">${x.done?`<span class="pill ${(x.t.pre-x.a)/x.t.pre<x.t.mpct-.05?'hi':'ok'}">${pct((x.t.pre-x.a)/x.t.pre)}</span>`:x.has?`<span class="sm muted">đang nhập · ${pct(x.a/(x.t.cost||1))} vốn</span>`:'—'}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="grid g2"><div class="panel"><h3>Hạng mục hay vượt dự toán</h3>${over.length?`<table><tbody>${over.map(o=>`<tr><td class="code">${o.code}</td><td class="sm">${esc(CAT[o.code]?.name||o.code)}</td><td class="n"><span class="pill hi">+${pct(o.mx)}</span></td><td class="sm muted">${o.arr.length} dự án</td></tr>`).join('')}</tbody></table>`:'<div class="sm muted">Chưa có hạng mục nào vượt quá 10%.</div>'}</div>
 <div class="panel"><h3>Gợi ý cập nhật giá vốn</h3>${sugg.length?`<table><tbody>${sugg.map(s=>`<tr><td class="code">${s.code}</td><td class="sm">${esc(CAT[s.code]?.name||s.code)}<div class="muted">lệch ${s.arr.slice(-2).map(x=>pct(x.dev)).join(', ')} ở ${s.arr.slice(-2).map(x=>x.pj).join(', ')}</div></td><td class="n">${fmt(costOf(s.code))} → ${fmt(Math.round(s.avg/1000)*1000)}</td><td>${can.propose(r)||can.issue(r)?`<button class="b sm" data-act="suggest" data-v="${s.code}" data-c="${Math.round(s.avg/1000)*1000}">Tạo đề xuất</button>`:''}</td></tr>`).join('')}</tbody></table>`:'<div class="sm muted">Gợi ý xuất hiện khi một hạng mục lệch quá 10% cùng chiều ở 2 dự án liên tiếp có thực chi.</div>'}</div></div>`
 :`<div class="panel empty">Chưa có dự toán nào để báo cáo. Báo cáo biên theo loại hình và gợi ý chỉnh giá vốn sẽ hiện khi đã có dự toán và thực chi.</div>`}${S.role==='gd'?auditPanel():''}`;}

/* ===================== SỰ KIỆN ===================== */
async function saveProj(e){e.updated=new Date().toISOString();S.projects[e.id]=e;return store.set('projects/'+e.id,JSON.parse(JSON.stringify(e)));}
let saveT=null;function saveSoon(e){S.projects[e.id]=e;clearTimeout(saveT);saveT=setTimeout(()=>saveProj(e),500);}
async function onClick(ev){const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,v=b.dataset.v;if(b.tagName==='A')ev.preventDefault();const e=curProj();
 if(a==='go')return go(v);
 if(a==='qtype'){S.quick={...quickDefault(v),ten:S.quick.ten,khach:S.quick.khach,diachi:S.quick.diachi,dd:S.quick.dd,dk:S.quick.dk};return render();}
 if(a==='qdd'){S.quick.dd=v;return render();}
 if(a==='qaddpt'){S.quick.pts[v]=1;return render();}
 if(a==='qsave'){const q=S.quick;const ne=newEstimate(q);if(await saveProj(ne)){S.cur=ne.id;toast('Đã lưu '+ne.ma);go('chitiet');}return;}
 if(a==='open'){S.cur=b.dataset.id;return go('chitiet');}
 if(a==='status'&&e){e.status=v;(e.notes=e.notes||[]).push({role:S.role,at:new Date().toISOString(),t:'Chuyển trạng thái: '+STATUS.find(s=>s[0]===v)[1]});await saveProj(e);logAudit('chuyển trạng thái',e.ma,STATUS.find(s=>s[0]===v)[1]);return render();}
 if(a==='note'&&e){const t=$('#note').value.trim();if(!t)return;(e.notes=e.notes||[]).push({role:S.role,at:new Date().toISOString(),t});await saveProj(e);return render();}
 if(a==='dup'&&e){const n=JSON.parse(JSON.stringify(e));n.id=uid();n.ma=e.ma+'-B';n.ten=e.ten+' (bản sao)';n.status='nhap';n.notes=[];n.created=new Date().toISOString();await saveProj(n);S.cur=n.id;toast('Đã nhân bản');return render();}
 if(a==='askdel'){S.confirmDel=e.id;return render();} if(a==='nodel'){S.confirmDel=null;return render();}
 if(a==='del'&&e){await store.del('projects/'+e.id);await store.del('expenses/'+e.id);logAudit('xoá dự toán',e.ma,e.ten);delete S.projects[e.id];S.cur=null;S.confirmDel=null;toast('Đã xóa');return go('nhanh');}
 if(a==='qmode'){S.qmode=v;return render();}
 if(a==='dl_html')return dlHtml(); if(a==='dl_xlsx')return dlXlsx(false); if(a==='dl_khoan')return dlXlsx(true);
 if(a==='bmore'){S.bmore=1;return render();}
 if(a==='prop'){S.propCode=v;return render();}
 if(a==='propsave'){const c=+$('#pc_cost').value,why=$('#pc_why').value.trim();if(!(c>0)){toast('Nhập giá vốn mới lớn hơn 0');return;}const id=uid();await store.set('proposals/'+id,{code:S.propCode,cost:c,why,role:S.role,at:new Date().toISOString(),status:'cho'});S.propCode=null;toast('Đã gửi đề xuất cho Giám đốc duyệt');return render();}
 if(a==='suggest'){const id=uid();await store.set('proposals/'+id,{code:v,cost:+b.dataset.c,why:'Gợi ý từ thực chi 2 dự án liên tiếp',role:S.role,at:new Date().toISOString(),status:'cho'});toast('Đã tạo đề xuất');return render();}
 if(a==='reject'){const x=S.proposals[v];await store.set('proposals/'+v,{...x,status:'tuchoi'});return render();}
 if(a==='issue'){const props=Object.entries(S.proposals).filter(([,x])=>x.status==='cho');if(!props.length)return;const no=curVersion().no+1;const changes={};props.forEach(([,x])=>changes[x.code]=x.cost);
  const label=($('#vlabel').value.trim())||('v'+no);await store.set('versions/v'+no,{no,label,date:today(),changes,params:{},status:'issued'});logAudit('ban hành bảng giá',label,Object.keys(changes).length+' mã đổi giá');
  for(const [id,x] of props)await store.set('proposals/'+id,{...x,status:'duyet',ver:no});toast('Đã ban hành '+label);return render();}
 if(a==='exadd'&&e){const amt=+$('#ex_amt').value;if(!(amt>0)){toast('Nhập số tiền');return;}const rows=[...((S.expenses[e.id]?.rows)||[]),{id:uid(),code:$('#ex_code').value,amount:amt,date:$('#ex_date').value||today(),doc:$('#ex_doc').value.trim(),vendor:$('#ex_vendor').value.trim(),role:S.role}];
  S.expenses[e.id]={rows};await store.set('expenses/'+e.id,{rows});toast('Đã thêm chứng từ');return render();}
 if(a==='exdel'&&e){const rows=((S.expenses[e.id]?.rows)||[]).filter(x=>x.id!==v);S.expenses[e.id]={rows};await store.set('expenses/'+e.id,{rows});return render();}}
function onChange(ev){const t=ev.target;const e=curProj();
 if(t.id==='pick'){S.cur=t.value||null;S.filter='';return render();}
 if(t.id==='fl'){S.fl=t.value;return render();}
 if(t.id==='bl'){S.bl=t.value;return render();}
 if(t.id==='addsel'&&e&&t.value){const c=CAT[t.value];e.lines.push({code:c.code,name:c.name,unit:c.unit,qty:1,cost:costOf(c.code),bien:c.bien,kkt:'',on:true,cdt:false,tb:c.bien==='TB',src:'thêm tay',mmin:c.mmin,mmax:c.mmax});e.lines.sort((a,b)=>a.code.localeCompare(b.code));saveSoon(e);return render();}
 if(t.dataset.li!=null&&e){const L=e.lines[+t.dataset.li];const f=t.dataset.f;if(f==='on'||f==='cdt')L[f]=t.checked;else if(f==='qty')L.qty=Math.max(0,+t.value||0);else if(f==='kkt')L.kkt=t.value;else if(f==='cost')L.cost=Math.max(0,+t.value||0);saveSoon(e);return render();}
 if(e&&['p_QL','p_DP','p_CK','p_VAT'].includes(t.id)){const k=t.id.slice(2);let val=+t.value||0;if(k==='QL'||k==='DP')val=val/100;e.params[k]=val;saveSoon(e);return render();}
 if(t.dataset.dk){S.quick.dk[t.dataset.dk]=t.checked;return render();}
 if(t.id==='q_laser'){S.quick.laser=t.checked;return render();}}
function onInput(ev){const t=ev.target;
 if(t.id==='q_S'){const v=+t.value;if(v>0){S.quick.S=v;render();}return;}
 if(t.id==='q_tang'){S.quick.tang=Math.max(1,+t.value||1);render();return;}
 if(t.dataset.pt){S.quick.pts[t.dataset.pt]=Math.max(0,Math.round(+t.value||0));render();return;}
 if(['q_ten','q_khach','q_diachi'].includes(t.id)){S.quick[t.id.slice(2)]=t.value;return;}
 if(t.id==='flt'){S.filter=t.value;render();return;}
 if(t.id==='bf'){S.bf=t.value;S.bmore=0;render();return;}}

/* ===================== AI BÓC KHỐI LƯỢNG ===================== */
const KINDS={ve:'Bản vẽ mặt bằng / kỹ thuật',d3:'Phối cảnh 3D',ht:'Ảnh hiện trạng'};
const PT_DESC={GHE_NHA:'ghế nha (unit nha khoa)',XQ:'phòng X-quang nha',TIET:'phòng tiệt trùng',BUONG_KHAM:'buồng khám',THU_THUAT:'buồng thủ thuật',XET_NGHIEM:'phòng xét nghiệm',GIUONG_SPA:'giường spa/thẩm mỹ',BON_GOI:'bồn/giường gội',XONG_HOI:'phòng xông hơi',GHE_SALON:'ghế cắt/uốn salon',BAN_NAIL:'bàn nail'};
S.ai={files:[],tiles:true,note:'',type:'auto',S:'',status:'idle',progress:'',chars:0,res:null,err:null,mode:'merge',ten:'',khach:'',diachi:''};
let aiCtl=null,aiLim=null,aiSample=null,aiAssets=null;
(async()=>{try{aiSample=window.claude?await window.claude.use('sample'):null;if(aiSample)aiLim=await aiSample.limits().catch(()=>null);}catch(e){aiSample=null;}
 try{aiAssets=window.claude?await window.claude.use('assets'):null;}catch(e){aiAssets=null;}if(S.tab==='ai')render();})();

/* ---- đọc PDF bằng pdf.js (nạp khi cần) ---- */
let pdfReady=null;
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('Không tải được '+src));document.head.appendChild(s);});}
function ensurePdf(){if(window.pdfjsLib)return Promise.resolve();if(!pdfReady)pdfReady=(async()=>{
 await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js');
 await loadScript('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');})();return pdfReady;}
const toBlob=(c,q=.9)=>new Promise(r=>c.toBlob(r,'image/jpeg',q));
function thumbOf(c){const t=document.createElement('canvas');const k=160/Math.max(c.width,c.height);t.width=Math.round(c.width*k);t.height=Math.round(c.height*k);t.getContext('2d').drawImage(c,0,0,t.width,t.height);return t.toDataURL('image/jpeg',.7);}
async function imgCanvas(file){const url=URL.createObjectURL(file);try{const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error('Không đọc được ảnh '+file.name));i.src=url;});
 const k=Math.min(1,4000/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);return c;}finally{URL.revokeObjectURL(url);}}
async function pdfCanvases(file,maxPages){await ensurePdf();const buf=await file.arrayBuffer();const doc=await pdfjsLib.getDocument({data:buf}).promise;const out=[];const n=Math.min(doc.numPages,maxPages);
 for(let i=1;i<=n;i++){S.ai.progress=`Đang đọc ${file.name}, trang ${i}/${n}`;paintAiProgress();const pg=await doc.getPage(i);const v0=pg.getViewport({scale:1});const sc=Math.min(4,3200/Math.max(v0.width,v0.height));const vp=pg.getViewport({scale:sc});
  const c=document.createElement('canvas');c.width=Math.floor(vp.width);c.height=Math.floor(vp.height);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);await pg.render({canvasContext:g,viewport:vp}).promise;out.push(c);}
 return {canvases:out,total:doc.numPages};}
function tilesOf(c){const res=[];const ov=.08;const w=c.width/2,h=c.height/2;const names=['trên trái','trên phải','dưới trái','dưới phải'];
 for(let r=0;r<2;r++)for(let k=0;k<2;k++){const x=Math.max(0,k*w-w*ov),y=Math.max(0,r*h-h*ov);const tw=Math.min(c.width-x,w*(1+ov)),th=Math.min(c.height-y,h*(1+ov));
  const t=document.createElement('canvas');t.width=Math.round(tw);t.height=Math.round(th);t.getContext('2d').drawImage(c,x,y,tw,th,0,0,t.width,t.height);res.push({c:t,label:'ô '+names[r*2+k]+' (phóng to)'});}return res;}
async function addFiles(list){for(const f of list){const isPdf=f.type==='application/pdf'||/\.pdf$/i.test(f.name);const isImg=/^image\/(jpeg|png|webp|gif)$/.test(f.type);
 if(!isPdf&&!isImg){toast('Bỏ qua '+f.name+': chỉ nhận PDF, JPG, PNG, WebP');continue;}
 const kind=isPdf?'ve':(/3d|render|phoi|pc[_\- ]/i.test(f.name)?'d3':(/mb|mat.?bang|ban.?ve|plan|layout|dwg|cad|tran|dien/i.test(f.name)?'ve':'ht'));
 const it={id:uid(),file:f,name:f.name,size:f.size,isPdf,kind,thumb:'',pages:null};S.ai.files.push(it);
 try{if(isPdf){const {canvases,total}=await pdfCanvases(f,1);it.thumb=thumbOf(canvases[0]);it.pages=total;}else{const c=await imgCanvas(f);it.thumb=thumbOf(c);}}catch(e){it.err=e.message;}
 S.ai.progress='';}render();}
function paintAiProgress(){const el=document.getElementById('ai_prog');if(el)el.textContent=S.ai.progress+(S.ai.chars?` · đã nhận ${S.ai.chars.toLocaleString('vi-VN')} ký tự`:'');}

/* ---- dựng danh sách ảnh gửi Claude ---- */
function sheetOf(items,grid){const cw=900,ch=675;const c=document.createElement('canvas');c.width=cw*grid;c.height=ch*grid;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);
 items.forEach((it,i)=>{const x=(i%grid)*cw,y=Math.floor(i/grid)*ch;const k=Math.min((cw-8)/it.c.width,(ch-8)/it.c.height);const w=it.c.width*k,h=it.c.height*k;g.drawImage(it.c,x+(cw-w)/2,y+(ch-h)/2,w,h);
  g.fillStyle='#b3261e';g.fillRect(x+6,y+6,64,48);g.fillStyle='#fff';g.font='bold 34px sans-serif';g.fillText(String(i+1),x+22,y+42);g.strokeStyle='#999';g.strokeRect(x,y,cw,ch);});return c;}
async function buildImages(){const max=aiLim?.images?.maxCount||8;const A=S.ai;const full=[],tiles=[],photos=[];
 for(const f of A.files){if(f.err)continue;
  if(f.isPdf){const {canvases}=await pdfCanvases(f.file,6);canvases.forEach((c,i)=>{full.push({c,label:`${KINDS[f.kind]} "${f.name}" trang ${i+1}, toàn trang`});if(A.tiles&&f.kind==='ve')tilesOf(c).forEach(t=>tiles.push({c:t.c,label:`${KINDS[f.kind]} "${f.name}" trang ${i+1}, ${t.label}`}));});}
  else{S.ai.progress='Đang chuẩn bị ảnh '+f.name;paintAiProgress();const c=await imgCanvas(f.file);
   if(f.kind==='ve'){full.push({c,label:`${KINDS[f.kind]} "${f.name}"`});if(A.tiles)tilesOf(c).forEach(t=>tiles.push({c:t.c,label:`${KINDS[f.kind]} "${f.name}", ${t.label}`}));}
   else photos.push({c,name:f.name,kind:f.kind});}}
 const picked=full.slice(0,max);let left=max-picked.length;const notes=[];let dropped=Math.max(0,full.length-max);
 if(photos.length){if(left<=0)dropped+=photos.length;else{let grid=1;if(photos.length>left){grid=2;while(grid<3&&Math.ceil(photos.length/(grid*grid))>left)grid++;}
  const per=grid*grid;let sent=0,sheets=0;
  for(const kind of ['d3','ht']){const ps=photos.filter(p=>p.kind===kind);for(let i=0;i<ps.length&&left>0;i+=per){const chunk=ps.slice(i,i+per);
   if(per===1)picked.push({c:chunk[0].c,label:`${KINDS[kind]} "${chunk[0].name}"`});else{picked.push({c:sheetOf(chunk,grid),label:`${KINDS[kind]} ghép ${chunk.length} ảnh (số đỏ ở góc): ${chunk.map((p,j)=>`${j+1}="${p.name}"`).join(', ')}`});sheets++;}sent+=chunk.length;left--;}}
  if(sheets)notes.push(`${sent} ảnh hiện trạng/3D được ghép thành ${sheets} ảnh lưới ${grid}×${grid} để vừa giới hạn ${max} ảnh`);dropped+=photos.length-sent;}}
 const tk=tiles.slice(0,Math.max(0,left));picked.push(...tk);if(tiles.length>tk.length)notes.push(`bỏ ${tiles.length-tk.length} ô phóng to vì hết lượt ảnh`);
 const blobs=[];for(const p of picked)blobs.push(await toBlob(p.c));
 return {blobs,labels:picked.map(p=>p.label),dropped,notes};}
async function pdfText(file,maxPages,budget){await ensurePdf();const doc=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;const n=Math.min(doc.numPages,maxPages);let out='';
 for(let i=1;i<=n;i++){const pg=await doc.getPage(i);const vp=pg.getViewport({scale:1});const tc=await pg.getTextContent();
  const items=tc.items.filter(t=>t.str&&t.str.trim()).map(t=>`${Math.round(t.transform[4]/vp.width*1000)},${Math.round((vp.height-t.transform[5])/vp.height*1000)} ${t.str.trim()}`);
  out+=`\n--- "${file.name}" trang ${i} (${items.length} chữ) ---\n`+items.join('\n');if(out.length>budget)break;}
 return out.slice(0,budget);}
function aiCatalog(){const skip=['1-11','1-12','3-07','9-05'];return Object.values(CAT).filter(c=>!skip.includes(c.grp)).map(c=>`${c.code}|${c.name.slice(0,80)}|${c.unit}`).join('\n');}
function aiPrompt(labels,textBlock,chat){const A=S.ai;const t=A.type!=='auto'?TEMPLATES[A.type]:null;
 const tpl=t?t.lines.filter(l=>l[0]!=='PCCC').slice(0,30).map(([ref,a,c])=>{const x=CAT[REF[ref]];return `${x.code} ${x.name.slice(0,50)}: ${a?a+'×m² sàn':''}${c?(a?' + ':'')+c:''}`;}).join('\n'):'';
 return `Bạn là kỹ sư dự toán fit-out (phòng khám, nha khoa, spa, salon) của một nhà thầu tại TP.HCM. Nhiệm vụ: BÓC KHỐI LƯỢNG từ hồ sơ hình ảnh đính kèm. KHÔNG đưa giá. Đây là bản nháp để kỹ sư kiểm tra lại.

${chat?`HỒ SƠ ĐÍNH KÈM trong tin nhắn này (theo thứ tự):\n${labels.map((l,i)=>`File ${i+1}: ${l}`).join('\n')}\nNếu PDF nhiều trang, đọc lần lượt từng trang.`:textBlock?`KHÔNG có ảnh. Dưới đây là CHỮ trích từ PDF bản vẽ (mỗi dòng: x,y theo phần nghìn chiều rộng/cao trang, gốc trên-trái, rồi nội dung). Dựng lại mặt bằng từ tên phòng, kích thước, ghi chú diện tích; chữ gần nhau về tọa độ thì thuộc cùng chỗ. Ảnh hiện trạng/3D không đọc được, ghi vào cau_hoi những gì cần khảo sát.\n${textBlock}`:`ẢNH ĐÍNH KÈM (theo thứ tự):\n${labels.map((l,i)=>`Ảnh ${i+1}: ${l}`).join('\n')}`}

Cách đọc từng loại:
- Bản vẽ mặt bằng/kỹ thuật: đọc kích thước ghi trên bản vẽ (mm), tỷ lệ, tên phòng, ký hiệu cửa, vách, thiết bị, ổ cắm, đèn, máy lạnh. Ảnh "ô ... (phóng to)" là phần cắt của cùng trang để đọc số nhỏ; KHÔNG cộng trùng phần chồng lấn giữa các ô.
- Phối cảnh 3D: xác định vật liệu hoàn thiện (sàn vinyl/gạch/gỗ, ốp tường, trần giật cấp, lam, đèn hắt, quầy, tủ) để chọn đúng mã; không đo kích thước từ 3D nếu đã có bản vẽ.
- Ảnh hiện trạng: nhận diện việc phải tháo dỡ, sửa chữa, chống thấm, nâng cấp điện (tủ 3 pha), điều kiện thi công (hẻm nhỏ, trong tòa văn phòng/TTTM, đang hoạt động).

Quy tắc tính:
- Trần: diện tích sàn các phòng có đóng trần; giật cấp tính phần m² giật cấp.
- Vách thạch cao/kính: chiều dài vách × chiều cao (mặc định 2,8–3,0 m nếu không ghi), trừ cửa > 2 m².
- Sơn tường: chu vi phòng × chiều cao trần, trừ ô cửa và phần đã ốp; sơn trần thạch cao = diện tích trần.
- Sàn: theo diện tích từng phòng và vật liệu tương ứng; khu ướt/WC dùng gạch chống trơn.
- Cửa, thiết bị, đèn, ổ cắm, máy lạnh: đếm theo ký hiệu. Nếu không có bản vẽ điện, để trống các mã điện mà app sẽ tự sinh theo gói điểm.
- Ghi rõ cách tính ngắn gọn cho từng dòng (ví dụ "P.khám 1–5: 5×(3,2+3,5)×2×2,9 − cửa").
- tin_cay: "cao" khi đọc được kích thước rõ, "trung bình" khi suy từ tỷ lệ/ước lượng, "thấp" khi đoán.
- Chỉ dùng mã có trong DANH MỤC. Việc cần làm mà danh mục không có (tháo dỡ, đục phá, sửa hiện trạng…) đưa vào "ngoai_danh_muc", lớp 1 xây dựng, 2 M&E, 3 nội thất, 4 thiết kế-pháp lý, 9 chi phí chung.
- Đếm "diem" (gói điểm chuyên dụng) theo các khóa: ${Object.entries(PT_DESC).map(([k,v])=>k+'='+v).join('; ')}.
- Chỗ không chắc hoặc thiếu thông tin: ghi vào "cau_hoi", không bịa số.

Thông tin người dùng nhập: loại hình ${A.type==='auto'?'chưa chọn (hãy xác định)':TEMPLATES[A.type].label}; diện tích ${A.S?A.S+' m²':'chưa biết (hãy đo từ bản vẽ)'}; ghi chú: ${A.note||'không có'}.
${tpl?`Hệ số mẫu của loại hình này (chỉ dùng tham khảo khi bản vẽ không đủ, nếu dùng thì tin_cay "thấp"):\n${tpl}\n`:''}
DANH MỤC (mã|tên|ĐVT):
${aiCatalog()}

Trả lời DUY NHẤT một JSON object theo mẫu:
{"loai_hinh":"nha|dakhoa|spa|salon","dien_tich":120,"dien_tich_nguon":"đọc từ bản vẽ|ước lượng","ty_le":"1:100 hoặc không rõ","so_tang_toa_nha":1,
"khong_gian":[{"ten":"P.khám 1","dien_tich":11.2}],
"diem":{"GHE_NHA":3},
"dieu_kien":{"dia_diem":"pho|shop|vp|tttm","hem":false,"caitao":false,"gap":false,"tang5":false},
"hang_muc":[{"code":"1-05-001","kl":96.5,"cach_tinh":"...","tin_cay":"cao","nguon":"bản vẽ|3D|hiện trạng"}],
"ngoai_danh_muc":[{"lop":1,"ten":"Tháo dỡ trần thạch cao cũ","dvt":"m²","kl":80,"cach_tinh":"...","tin_cay":"trung bình","nguon":"hiện trạng"}],
"hien_trang":["Mô tả ngắn từng vấn đề thấy trong ảnh hiện trạng"],
"cau_hoi":["Câu hỏi cần kỹ sư/khách xác nhận"],
"tom_tat":"2–3 câu tóm tắt hồ sơ"}`;}

function noImg(){return S.ai.noImg||(aiLim&&!aiLim.images);}
async function aiRun(){const A=S.ai;if(!aiSample){toast('Trang này chưa được phép hỏi Claude.');return;}
 if(!A.files.length){toast('Thêm ít nhất một bản vẽ hoặc ảnh');return;}
 A.status='prep';A.err=null;A.res=null;A.chars=0;A.dropped=0;A.notes=[];A.progress='Đang chuẩn bị hồ sơ';render();
 let prompt,opts={modelTier:'complex',cache:false,onText:({text})=>{A.chars=text.length;paintAiProgress();}};
 try{if(noImg()){const pdfs=A.files.filter(f=>f.isPdf&&!f.err);if(!pdfs.length){A.status='error';A.err='Chế độ xem này không gửi được ảnh cho Claude và không có PDF để đọc chữ. Dùng cách "Làm trong chat Claude" bên dưới.';render();return;}
   let txt='';for(const f of pdfs){A.progress='Đang đọc chữ trong '+f.name;paintAiProgress();txt+=await pdfText(f.file,8,26000-txt.length);if(txt.length>=26000)break;}
   if(txt.replace(/[\s\d,.-]/g,'').length<40){A.status='error';A.err='PDF là bản scan/ảnh, không có lớp chữ để đọc, mà chế độ xem này không gửi được ảnh. Dùng cách "Làm trong chat Claude" bên dưới.';render();return;}
   prompt=aiPrompt([],txt);A.sent=['chữ trích từ '+pdfs.length+' PDF (không gửi ảnh)'];A.notes=['Chế độ xem này không gửi được ảnh: AI chỉ đọc chữ trong PDF, ảnh hiện trạng/3D chưa được đọc'];}
  else{const imgs=await buildImages();if(!imgs.blobs.length){A.status='error';A.err='Không có trang hoặc ảnh nào đọc được.';render();return;}
   prompt=aiPrompt(imgs.labels);opts.images=imgs.blobs;A.sent=imgs.labels;A.dropped=imgs.dropped;A.notes=imgs.notes;}}
 catch(e){A.status='error';A.err='Không đọc được file: '+(e.message||e);render();return;}
 A.status='run';A.progress=opts.images?`Claude đang đọc ${opts.images.length} ảnh, thường mất 1–3 phút`:'Claude đang đọc chữ bản vẽ, thường mất 1–2 phút';render();
 aiCtl=new AbortController();opts.signal=aiCtl.signal;
 try{const res=await aiSample.json(prompt,opts);A.res=normalizeAi(res);A.status='done';A.at=new Date().toISOString();}
 catch(e){A.status='error';if(e.code==='images_unavailable')A.noImg=true;
  A.err=({cancelled:'Đã dừng.',not_granted:'Bạn chưa cho phép trang này dùng Claude.',sampling_disabled:'Tài khoản này không dùng được Claude trong trang.',images_unavailable:'Chế độ xem này không gửi được ảnh cho Claude. Bấm chạy lại để AI đọc chữ trong PDF thay cho ảnh, hoặc dùng "Làm trong chat Claude" bên dưới để đọc đủ ảnh.',image_rejected:'Có ảnh quá lớn hoặc sai định dạng, hãy bỏ bớt file.',rate_limited:'Đang gọi Claude quá nhiều, thử lại sau ít phút.',prompt_too_large:'Hồ sơ quá dài, hãy bỏ bớt file.',invalid_json:'Claude trả lời không đúng định dạng. Bấm chạy lại.',refused:'Claude từ chối đọc hồ sơ này.'})[e.code]||('Lỗi khi gọi Claude ('+(e.code||'không rõ')+'). Bấm chạy lại.');}
 aiCtl=null;render();}
function chatPrompt(){const A=S.ai;const labels=A.files.map(f=>`${KINDS[f.kind]} "${f.name}"`);return aiPrompt(labels.length?labels:['(đính kèm bản vẽ, ảnh 3D, ảnh hiện trạng)'],null,true);}
async function copyPrompt(){const p=chatPrompt();try{await navigator.clipboard.writeText(p);toast('Đã sao chép yêu cầu, dán vào chat Claude');}catch(e){S.ai.showPrompt=true;render();setTimeout(()=>{const t=document.getElementById('ai_ptxt');if(t){t.focus();t.select();}},50);toast('Không sao chép tự động được, hãy chọn và sao chép trong ô');}}
function importJson(){const t=(document.getElementById('ai_paste')?.value||'').trim();if(!t){toast('Dán kết quả JSON vào ô trước');return;}
 let s=t;const m=s.match(/```(?:json)?\s*([\s\S]*?)```/);if(m)s=m[1];const i=s.indexOf('{'),j=s.lastIndexOf('}');
 try{const r=JSON.parse(s.slice(i,j+1));S.ai.res=normalizeAi(r);S.ai.status='done';S.ai.at=new Date().toISOString();S.ai.err=null;S.ai.sent=['kết quả dán từ chat Claude'];toast('Đã đọc kết quả: '+S.ai.res.lines.length+' dòng');render();}
 catch(e){toast('Không đọc được JSON, hãy dán nguyên câu trả lời của Claude');}}
function normalizeAi(r){r=r&&typeof r==='object'?r:{};const out={loai_hinh:TEMPLATES[r.loai_hinh]?r.loai_hinh:(S.ai.type!=='auto'?S.ai.type:'nha'),
 dien_tich:+r.dien_tich>0?Math.round(+r.dien_tich*10)/10:(+S.ai.S||0),dien_tich_nguon:String(r.dien_tich_nguon||''),ty_le:String(r.ty_le||''),tang:Math.max(1,+r.so_tang_toa_nha||1),
 khong_gian:Array.isArray(r.khong_gian)?r.khong_gian.slice(0,60).map(x=>({ten:String(x.ten||''),dt:+x.dien_tich||0})):[],
 diem:{},dk:{},dd:'pho',lines:[],extra:[],ht:(Array.isArray(r.hien_trang)?r.hien_trang:[]).map(String).slice(0,20),q:(Array.isArray(r.cau_hoi)?r.cau_hoi:[]).map(String).slice(0,20),tom:String(r.tom_tat||''),bad:0};
 for(const k of Object.keys(POINTS)){const n=Math.round(+(r.diem||{})[k]||0);if(n>0)out.diem[k]=n;}
 const d=r.dieu_kien||{};if(KDD.some(x=>x.id===d.dia_diem))out.dd=d.dia_diem;['hem','caitao','gap','tang5'].forEach(k=>{if(d[k]===true)out.dk[k]=true;});
 const seen=new Map();(Array.isArray(r.hang_muc)?r.hang_muc:[]).forEach(h=>{const code=String(h.code||'').trim();const kl=+h.kl;if(!CAT[code]||!(kl>0)){out.bad++;return;}
  const prev=seen.get(code);if(prev){prev.kl=Math.round((prev.kl+kl)*100)/100;prev.cach+=' + '+String(h.cach_tinh||'');return;}
  const L={code,kl:Math.round(kl*100)/100,cach:String(h.cach_tinh||''),tc:['cao','trung bình','thấp'].includes(h.tin_cay)?h.tin_cay:'trung bình',ng:String(h.nguon||''),on:true};seen.set(code,L);out.lines.push(L);});
 (Array.isArray(r.ngoai_danh_muc)?r.ngoai_danh_muc:[]).forEach(h=>{const kl=+h.kl;if(!h.ten||!(kl>0))return;const lop=[1,2,3,4,9].includes(+h.lop)?+h.lop:1;
  out.extra.push({lop,ten:String(h.ten),dvt:String(h.dvt||'gói'),kl:Math.round(kl*100)/100,cach:String(h.cach_tinh||''),tc:['cao','trung bình','thấp'].includes(h.tin_cay)?h.tin_cay:'trung bình',ng:String(h.nguon||''),on:true,cost:0});});
 out.lines.sort((a,b)=>a.code.localeCompare(b.code));return out;}

async function aiApply(){const A=S.ai,R=A.res;if(!R)return;if(!(R.dien_tich>0)){toast('Nhập diện tích sàn trước khi tạo dự toán');return;}
 const q={type:R.loai_hinh,S:R.dien_tich,pts:R.diem,dd:R.dd,dk:R.dk,tang:R.tang,laser:false,ten:A.ten||('Dự án '+TEMPLATES[R.loai_hinh].label.toLowerCase()+' (AI)'),khach:A.khach,diachi:A.diachi};
 const e=newEstimate(q);const ver=curVersion();
 if(A.mode==='only'){const keepPkg=new Set();e.lines=e.lines.filter(L=>L.src.includes('gói ')||L.src.includes('dùng chung')||L.src.includes('máy ')||L.src.includes('heat')||L.src.includes('công lắp'));}
 const touched=new Set();
 R.lines.filter(x=>x.on).forEach(x=>{let L=e.lines.find(l=>l.code===x.code);const it=CAT[x.code];
  if(!L){L={code:x.code,name:it.name,unit:it.unit,qty:0,cost:costOf(x.code,ver),bien:it.bien,kkt:'',on:true,cdt:false,tb:it.bien==='TB',src:'',mmin:it.mmin,mmax:it.mmax};e.lines.push(L);}
  L.qty=x.kl;L.src='AI: '+(x.cach||'đọc từ hồ sơ');L.ai=x.tc;touched.add(x.code);});
 let n=0;R.extra.filter(x=>x.on).forEach(x=>{n++;const code=`${x.lop}-00-${String(n).padStart(3,'0')}`;e.lines.push({code,name:x.ten,unit:x.dvt,qty:x.kl,cost:+x.cost||0,bien:x.lop===4?'DV':'TC',kkt:'',on:true,cdt:false,tb:false,custom:true,src:'AI ngoài danh mục: '+(x.cach||''),ai:x.tc});});
 if(A.mode==='merge')e.lines.forEach(L=>{if(!touched.has(L.code)&&!L.custom&&L.src.startsWith('mẫu'))L.src+=' · AI chưa xác nhận';});
 e.lines.sort((a,b)=>a.code.localeCompare(b.code));
 let files=A.files.map(f=>({name:f.name,kind:f.kind}));
 if(aiAssets){A.progress='Đang lưu hồ sơ gốc vào dự án';render();for(const [i,f] of A.files.entries()){try{const r=await aiAssets.upload(f.file,f.isPdf?{type:'application/pdf'}:undefined);files[i].asset=r.id;}catch(err){}}}
 e.ai={at:A.at,mode:A.mode,files,tom:R.tom,q:R.q,ht:R.ht,kg:R.khong_gian,ty_le:R.ty_le,nguon:R.dien_tich_nguon};
 e.notes=[{role:S.role,at:new Date().toISOString(),t:`Tạo bằng AI từ ${files.length} file. ${R.lines.length} dòng trong danh mục, ${R.extra.length} dòng ngoài danh mục.${R.q.length?' Câu hỏi cần xác nhận: '+R.q.join(' | '):''}`}];
 if(await saveProj(e)){S.cur=e.id;A.progress='';toast('Đã tạo '+e.ma+' từ kết quả AI');go('chitiet');}}

const tcPill=t=>`<span class="pill ${t==='cao'?'ok':t==='thấp'?'hi':'lo'}">AI ${t}</span>`;
function vAI(){const m=S.ai.mode2||'ai';return `<div class="seg" role="group" style="margin-top:18px"><button data-act="ai_mode2" data-v="ai" aria-pressed="${m==='ai'}">Từ bản vẽ, 3D, ảnh hiện trạng (AI)</button><button data-act="ai_mode2" data-v="boq" aria-pressed="${m==='boq'}">Từ bảng khối lượng Excel</button></div>`+(m==='boq'?`<div style="margin:14px 0 12px"><h2>Nhập bảng khối lượng</h2><div class="sm muted">App tự khớp tên hạng mục với bảng giá chuẩn và áp đơn giá Cenova. Dòng chưa chắc có thể nhờ AI khớp; dòng ngoài bảng giá thành dòng tự nhập.</div></div>`+vBoq():vAIdraw());}
function vAIdraw(){const A=S.ai,r=S.role;const R=A.res;const lim=aiLim?.images?.maxCount;
 const busy=A.status==='prep'||A.status==='run';
 const avail=aiSample?(noImg()?'<div class="banner warn">Chế độ xem này chưa gửi được ảnh cho Claude. Khi bấm chạy, AI sẽ đọc chữ trong PDF bản vẽ (chỉ với PDF xuất từ CAD, không phải bản scan). Muốn AI đọc cả ảnh hiện trạng và 3D, dùng “Làm trong chat Claude” ở cuối trang.</div>':''):'<div class="banner warn">Tính năng AI chỉ chạy khi mở trang trong claude.ai. Bạn vẫn xem được giao diện nhưng chưa chạy được.</div>';
 return `<div class="row sb" style="margin:14px 0 12px"><div><h2>AI bóc khối lượng</h2><div class="sm muted">Thả bản vẽ PDF, phối cảnh 3D và ảnh hiện trạng. Claude đọc kích thước, đếm thiết bị, chọn mã trong bảng giá; app tính giá. Kết quả là bản nháp, kỹ sư dự toán duyệt từng dòng.</div></div></div>
 ${avail}
 <div class="split" style="margin-top:12px"><div class="stack" style="min-width:0">
  <div class="panel stack">
   <label class="drop" id="ai_drop" for="ai_files"><input id="ai_files" type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp" hidden><b>Kéo thả file vào đây</b><span class="sm muted">hoặc bấm để chọn · PDF bản vẽ (đọc tối đa 6 trang mỗi file), JPG/PNG phối cảnh và hiện trạng</span></label>
   ${A.files.length?`<div class="thumbs">${A.files.map(f=>`<div class="thumb">${f.thumb?`<img src="${f.thumb}" alt="">`:`<div class="ph">${f.isPdf?'PDF':'Ảnh'}</div>`}<div class="sm" style="word-break:break-all">${esc(f.name)}</div><div class="sm muted">${(f.size/1048576).toLocaleString('vi-VN',{maximumFractionDigits:1})} MB${f.pages?' · '+f.pages+' trang':''}</div>${f.err?`<div class="sm" style="color:var(--bad)">${esc(f.err)}</div>`:''}
    <select data-ai-kind="${f.id}" aria-label="Loại hồ sơ" ${busy?'disabled':''}>${Object.entries(KINDS).map(([k,v])=>`<option value="${k}" ${f.kind===k?'selected':''}>${v}</option>`).join('')}</select><button class="b sm ghost" data-act="ai_rm" data-v="${f.id}" ${busy?'disabled':''}>Bỏ file</button></div>`).join('')}</div>`:''}
   <div class="grid g2">
    <label class="f"><span class="lbl">Loại hình</span><select id="ai_type"><option value="auto">Để AI nhận diện</option>${Object.entries(TEMPLATES).map(([k,T])=>`<option value="${k}" ${A.type===k?'selected':''}>${T.label}</option>`).join('')}</select></label>
    <label class="f"><span class="lbl">Diện tích sàn nếu đã biết (m²)</span><input id="ai_S" type="number" min="0" value="${esc(A.S)}" placeholder="để trống: AI đo từ bản vẽ"></label></div>
   <label class="f"><span class="lbl">Ghi chú cho AI</span><textarea id="ai_note" rows="2" placeholder="Ví dụ: trần cao 3,2 m; giữ lại sàn gạch cũ khu hành lang; mặt bằng ở tầng 3 tòa văn phòng">${esc(A.note)}</textarea></label>
   <label class="ck"><input type="checkbox" id="ai_tiles" ${A.tiles?'checked':''}><span>Cắt bản vẽ thành 4 ô phóng to để đọc kích thước nhỏ <span class="muted">(tốn thêm ảnh${lim?`, tối đa ${lim} ảnh mỗi lần`:''})</span></span></label>
   <div class="row">${busy?`<button class="b" data-act="ai_stop">Dừng</button><span class="sm" id="ai_prog">${esc(A.progress)}</span>`:`<button class="b pri" data-act="ai_run" ${A.files.length&&aiSample?'':'disabled'}>${R?'Chạy lại AI':'Bóc khối lượng bằng AI'}</button>`}</div>
   ${A.err?`<div class="banner bad">${esc(A.err)}</div>`:''}
   ${(A.notes||[]).length?`<div class="banner info">${A.notes.map(esc).join('. ')}.</div>`:''}
   ${A.dropped?`<div class="banner warn">Đã bỏ ${A.dropped} trang/ảnh vì vượt giới hạn ${lim||8} ảnh mỗi lần gửi. Chạy riêng từng nhóm bản vẽ hoặc dùng “Làm trong chat Claude”.</div>`:''}
  </div>
  ${R?aiResult(R)+aiAddRows():`<div class="panel stack"><h3>AI làm gì với hồ sơ</h3><div class="grid g2 sm">
   <div><b>Bản vẽ mặt bằng</b><div class="muted">Đọc kích thước, tên phòng, ký hiệu cửa, vách, đèn, ổ cắm, máy lạnh. Tính m² trần, sàn, vách, sơn và đếm điểm chuyên dụng.</div></div>
   <div><b>Phối cảnh 3D</b><div class="muted">Nhận diện vật liệu: vinyl hay gạch, ốp HPL hay than tre, trần giật cấp, lam, quầy, tủ, để chọn đúng mã giá.</div></div>
   <div><b>Ảnh hiện trạng</b><div class="muted">Thấy việc tháo dỡ, sửa chữa, chống thấm, nâng điện, điều kiện thi công. Việc ngoài bảng giá được ghi riêng để báo giá.</div></div>
   <div><b>Bạn kiểm tra</b><div class="muted">Mỗi dòng có cách tính và mức tin cậy. Sửa khối lượng, bỏ dòng sai, trả lời câu hỏi rồi mới tạo dự toán.</div></div></div></div>`}
 ${chatPanel()}</div>
 <aside class="stack" style="position:sticky;top:120px">${R?aiSide(R):`<div class="panel sm muted">Kết quả bóc khối lượng sẽ hiện ở đây: loại hình, diện tích, số điểm và giá chào dự kiến.</div>`}</aside></div>`;}
function chatPanel(){const A=S.ai;return `<details class="panel" ${noImg()||A.showPrompt?'open':''}><summary>Làm trong chat Claude (đọc được mọi ảnh, không giới hạn số file)</summary><div class="stack" style="margin-top:10px">
 <ol class="sm" style="margin:0;padding-left:18px"><li>Bấm “Sao chép yêu cầu”. Yêu cầu đã kèm toàn bộ mã bảng giá và cách trả lời.</li><li>Mở chat Claude trong Project “CENOVA D&amp;B _ BỐC KHỐI LƯỢNG”, đính kèm bản vẽ PDF, ảnh 3D, ảnh hiện trạng, dán yêu cầu và gửi.</li><li>Sao chép nguyên câu trả lời JSON của Claude, dán vào ô dưới, bấm “Đọc kết quả”.</li></ol>
 <div class="row"><button class="b" data-act="ai_copy">Sao chép yêu cầu</button><button class="b ghost" data-act="ai_dlp">Tải yêu cầu (.txt)</button></div>
 ${A.showPrompt?`<textarea id="ai_ptxt" rows="6" readonly>${esc(chatPrompt())}</textarea>`:''}
 <textarea id="ai_paste" rows="4" placeholder='Dán câu trả lời của Claude, bắt đầu bằng {"loai_hinh": ...'></textarea>
 <div><button class="b pri" data-act="ai_import">Đọc kết quả</button></div></div></details>`;}
function aiResult(R){const ed=!['run','prep'].includes(S.ai.status);
 return `<div class="panel stack"><div class="row sb"><h3>Kết quả bóc khối lượng</h3>${expBtns('ai')}</div><div class="row sb"><span class="sm muted">${R.lines.length} dòng trong danh mục · ${R.extra.length} ngoài danh mục${R.bad?` · bỏ ${R.bad} dòng mã sai`:''}</span></div>
  ${R.tom?`<div class="sm">${esc(R.tom)}</div>`:''}
  ${R.q.length?`<div class="banner warn"><div><b>Cần xác nhận trước khi chốt</b><ul style="margin:4px 0 0;padding-left:18px">${R.q.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`:''}
  ${R.ht.length?`<div class="banner info"><div><b>Hiện trạng</b><ul style="margin:4px 0 0;padding-left:18px">${R.ht.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`:''}
  ${R.khong_gian.length?`<details><summary class="sm">Không gian AI đọc được (${R.khong_gian.length})</summary><div class="row sm" style="margin-top:6px">${R.khong_gian.map(k=>`<span class="pill">${esc(k.ten)}${k.dt?' · '+fmtq(k.dt)+' m²':''}</span>`).join('')}</div></details>`:''}
  <div class="tw" style="max-height:60vh"><table><thead><tr><th></th><th>Mã</th><th>Hạng mục</th><th class="n">KL</th><th>ĐVT</th><th>Cách tính</th><th>Tin cậy</th></tr></thead><tbody>
  ${R.lines.map((x,i)=>{const c=CAT[x.code];return `<tr class="${x.on?'':'off'}"><td class="keep"><input type="checkbox" data-ai-i="${i}" data-f="on" ${x.on?'checked':''} aria-label="Dùng dòng"></td><td class="code">${x.code}</td><td style="min-width:180px">${esc(c.name)}</td><td class="n"><input type="number" step="any" min="0" data-ai-i="${i}" data-f="kl" value="${x.kl}" aria-label="Khối lượng"></td><td>${esc(c.unit)}</td><td class="sm muted" style="min-width:200px">${esc(x.cach)}${x.ng?` · ${esc(x.ng)}`:''}</td><td>${tcPill(x.tc)}</td></tr>`;}).join('')}
  ${R.extra.length?`<tr class="grp"><td colspan="7">Ngoài danh mục, cần nhập giá vốn</td></tr>`+R.extra.map((x,i)=>`<tr class="${x.on?'':'off'}"><td class="keep"><input type="checkbox" data-ai-x="${i}" data-f="on" ${x.on?'checked':''} aria-label="Dùng dòng"></td><td class="code">${x.lop}-00</td><td>${esc(x.ten)}<div class="sm muted">Giá vốn <input type="number" min="0" step="1000" data-ai-x="${i}" data-f="cost" value="${x.cost||''}" placeholder="0" style="width:110px"> đ/${esc(x.dvt)}</div></td><td class="n"><input type="number" step="any" min="0" data-ai-x="${i}" data-f="kl" value="${x.kl}" aria-label="Khối lượng"></td><td>${esc(x.dvt)}</td><td class="sm muted">${esc(x.cach)}${x.ng?` · ${esc(x.ng)}`:''}</td><td>${tcPill(x.tc)}</td></tr>`).join(''):''}
  </tbody></table></div>
  <div class="sm muted">Đã gửi cho Claude: ${(S.ai.sent||[]).map(esc).join('; ')}.</div></div>`;}
function aiPreview(){const A=S.ai,R=A.res;const q={type:R.loai_hinh,S:R.dien_tich||1,pts:R.diem,dd:R.dd,dk:R.dk,tang:R.tang};const e=newEstimate(q);
 if(A.mode==='only')e.lines=e.lines.filter(L=>!L.src.startsWith('mẫu'));
 R.lines.filter(x=>x.on).forEach(x=>{let L=e.lines.find(l=>l.code===x.code);const it=CAT[x.code];if(!L){L={code:x.code,name:it.name,unit:it.unit,qty:0,cost:costOf(x.code),bien:it.bien,kkt:'',on:true,cdt:false,tb:it.bien==='TB',src:'AI',mmin:it.mmin,mmax:it.mmax};e.lines.push(L);}L.qty=x.kl;});
 R.extra.filter(x=>x.on).forEach((x,i)=>e.lines.push({code:`${x.lop}-00-${i}`,name:x.ten,unit:x.dvt,qty:x.kl,cost:+x.cost||0,bien:'TC',kkt:'',on:true,custom:true}));
 return {e,t:totals(e)};}
function aiSide(R){const A=S.ai;const {e,t}=aiPreview();const r=S.role;const noCost=R.extra.filter(x=>x.on&&!(+x.cost>0)).length;
 return `<div class="panel stack">
  <label class="f"><span class="lbl">Loại hình</span><select id="air_type">${Object.entries(TEMPLATES).map(([k,T])=>`<option value="${k}" ${R.loai_hinh===k?'selected':''}>${T.label}</option>`).join('')}</select></label>
  <label class="f"><span class="lbl">Diện tích sàn (m²) · ${esc(R.dien_tich_nguon||'AI')}${R.ty_le?' · tỷ lệ '+esc(R.ty_le):''}</span><input id="air_S" type="number" min="0" value="${R.dien_tich}"></label>
  <div><div class="lbl" style="margin-bottom:6px">Điểm chuyên dụng AI đếm được</div><div class="pts">${Object.keys(POINTS).filter(k=>R.diem[k]||k in TEMPLATES[R.loai_hinh].pts).map(k=>`<label class="pt"><span class="sm">${POINTS[k].name}</span><input type="number" min="0" data-ai-pt="${k}" value="${R.diem[k]||0}"></label>`).join('')}</div></div>
  <div class="sm muted">Địa điểm: ${(KDD.find(x=>x.id===R.dd)||KDD[0]).label}${Object.keys(R.dk).length?' · '+KDK.filter(k=>R.dk[k.id]).map(k=>k.label.toLowerCase()).join(', '):''}</div>
  <div><div class="lbl" style="margin-bottom:6px">Cách tạo dự toán</div><div class="seg" role="group"><button data-act="ai_mode" data-v="merge" aria-pressed="${A.mode==='merge'}">AI + mẫu bù chỗ thiếu</button><button data-act="ai_mode" data-v="only" aria-pressed="${A.mode==='only'}">Chỉ dòng AI + gói điểm</button></div>
   <div class="sm muted" style="margin-top:4px">${A.mode==='merge'?'Dòng AI thay khối lượng của mẫu; hạng mục AI không đọc được giữ theo hệ số mẫu và được đánh dấu.':'Bỏ các dòng tính theo m² của mẫu, chỉ giữ dòng AI đọc được và gói điểm M&E.'}</div></div>
  <div class="kpi" style="border-top:1px solid var(--rule);padding-top:8px"><span class="lbl">Giá chào dự kiến, đã VAT</span><span class="v big">${tr(t.total)}</span><span class="sm muted">${fmt(t.total)} đ · ${R.dien_tich?fmt(t.total/R.dien_tich)+' đ/m²':''} · ${e.lines.length} dòng</span></div>
  <div class="bars">${[1,2,3,4,9].map(L=>layerBar(L,t.byL[L]||0,t.direct)).join('')}</div>
  ${noCost?`<div class="banner warn">${noCost} dòng ngoài danh mục chưa có giá vốn, đang tính 0 đ.</div>`:''}
  ${can.createEst(r)?`<div class="stack" style="gap:8px;border-top:1px solid var(--rule);padding-top:12px"><input id="ai_ten" placeholder="Tên dự án" value="${esc(A.ten)}"><input id="ai_khach" placeholder="Khách hàng" value="${esc(A.khach)}"><input id="ai_diachi" placeholder="Địa chỉ công trình" value="${esc(A.diachi)}"><button class="b pri" data-act="ai_apply">Tạo dự toán từ kết quả AI</button></div>`:`<div class="banner info">Vai trò ${ROLES[r]} xem được kết quả nhưng không tạo dự toán.</div>`}
 </div>`;}
/* sự kiện riêng của màn AI */
document.addEventListener('change',ev=>{const t=ev.target;const A=S.ai;
 if(t.id==='ai_files'){addFiles([...t.files]);t.value='';return;}
 if(t.dataset.aiKind){const f=A.files.find(x=>x.id===t.dataset.aiKind);if(f)f.kind=t.value;return;}
 if(t.id==='ai_type'){A.type=t.value;return;}
 if(t.id==='ai_tiles'){A.tiles=t.checked;return;}
 if(!A.res)return;const R=A.res;
 if(t.id==='air_type'){R.loai_hinh=t.value;return render();}
 if(t.dataset.aiI!=null){const x=R.lines[+t.dataset.aiI];if(t.dataset.f==='on')x.on=t.checked;else x.kl=Math.max(0,+t.value||0);return render();}
 if(t.dataset.aiX!=null){const x=R.extra[+t.dataset.aiX];if(t.dataset.f==='on')x.on=t.checked;else if(t.dataset.f==='kl')x.kl=Math.max(0,+t.value||0);else x.cost=Math.max(0,+t.value||0);return render();}});
document.addEventListener('input',ev=>{const t=ev.target;const A=S.ai;
 if(t.id==='ai_S'){A.S=t.value;return;} if(t.id==='ai_note'){A.note=t.value;return;}
 if(['ai_ten','ai_khach','ai_diachi'].includes(t.id)){A[t.id.slice(3)]=t.value;return;}
 if(!A.res)return;if(t.id==='air_S'){const v=+t.value;if(v>0){A.res.dien_tich=v;render();}return;}
 if(t.dataset.aiPt){const n=Math.max(0,Math.round(+t.value||0));if(n)A.res.diem[t.dataset.aiPt]=n;else delete A.res.diem[t.dataset.aiPt];render();}});
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='ai_run')aiRun();else if(a==='ai_stop'){aiCtl?.abort();}
 else if(a==='ai_rm'){S.ai.files=S.ai.files.filter(f=>f.id!==b.dataset.v);render();}
 else if(a==='ai_mode'){S.ai.mode=b.dataset.v;render();}
 else if(a==='ai_apply')aiApply();else if(a==='ai_copy')copyPrompt();else if(a==='ai_import')importJson();else if(a==='ai_dlp')downloadFile('Yeu-cau-boc-khoi-luong.txt',chatPrompt());});
document.addEventListener('dragover',ev=>{if(ev.target.closest&&ev.target.closest('#ai_drop')){ev.preventDefault();ev.target.closest('#ai_drop').classList.add('over');}});
document.addEventListener('dragleave',ev=>{const d=ev.target.closest&&ev.target.closest('#ai_drop');if(d)d.classList.remove('over');});
document.addEventListener('drop',ev=>{const d=ev.target.closest&&ev.target.closest('#ai_drop');if(!d)return;ev.preventDefault();d.classList.remove('over');addFiles([...ev.dataTransfer.files]);});

/* ===================== HỒ SƠ HỢP ĐỒNG: ĐIỀN MẪU CÔNG TY ===================== */
const TPLS=[
 {id:'BG01',file:'tpl/BG01_BaoGia_ThietKe.xlsx',kind:'xlsx',grp:'Báo giá',name:'Báo giá thiết kế',scope:'design',pay:'HD01'},
 {id:'BG02',file:'tpl/BG02_BaoGia_ThiCong.xlsx',kind:'xlsx',grp:'Báo giá',name:'Báo giá thi công',scope:'xd',pay:'HD02'},
 {id:'BG03',file:'tpl/BG03_BaoGia_NoiThat.xlsx',kind:'xlsx',grp:'Báo giá',name:'Báo giá nội thất',scope:'nt',pay:'HD03'},
 {id:'HD01',file:'tpl/HD01_HopDong_ThietKe.docx',kind:'docx',grp:'Hợp đồng',name:'Hợp đồng thiết kế',scope:'design',suffix:'HĐTK',dieuTT:'5'},
 {id:'HD02',file:'tpl/HD02_HopDong_ThiCongXayDung.docx',kind:'docx',grp:'Hợp đồng',name:'Hợp đồng thi công xây dựng',scope:'xd',suffix:'HĐTC',dieuTT:'5'},
 {id:'HD03',file:'tpl/HD03_HopDong_ThiCongNoiThat.docx',kind:'docx',grp:'Hợp đồng',name:'Hợp đồng thi công nội thất',scope:'nt',suffix:'HĐNT',dieuTT:'5'},
 {id:'HD04',file:'tpl/HD04_HopDong_ThietKe-ThiCong_TronGoi.docx',kind:'docx',grp:'Hợp đồng',name:'Hợp đồng thiết kế & thi công trọn gói',scope:'all',suffix:'HĐTKTC',dieuTT:'6'},
 {id:'TT01',file:'tpl/TT01_DeNghi_TamUng.docx',kind:'docx',grp:'Thanh toán',name:'Đề nghị tạm ứng',scope:'hd'},
 {id:'TT02',file:'tpl/TT02_DeNghi_ThanhToanDot.docx',kind:'docx',grp:'Thanh toán',name:'Đề nghị thanh toán đợt',scope:'hd'},
 {id:'NT01',file:'tpl/NT01_BangQuyetToan.xlsx',kind:'xlsx',grp:'Nghiệm thu & bàn giao',name:'Bảng quyết toán',scope:'hd'},
 {id:'NT02',file:'tpl/NT02_BienBan_NghiemThuHoanThanh.docx',kind:'docx',grp:'Nghiệm thu & bàn giao',name:'Biên bản nghiệm thu hoàn thành',scope:'hd'},
 {id:'NT03',file:'tpl/NT03_BanGiao_PhieuBaoHanh.docx',kind:'docx',grp:'Nghiệm thu & bàn giao',name:'Biên bản bàn giao & phiếu bảo hành',scope:'hd'}];
const TPL=Object.fromEntries(TPLS.map(t=>[t.id,t]));
const PAY0={
 HD01:[['Ngay sau khi ký hợp đồng',50],['Sau khi Bên A duyệt concept',20],['Sau khi Bên A duyệt phối cảnh 3D',20],['Khi bàn giao hồ sơ kỹ thuật thi công',10]],
 HD02:[['Tạm ứng ngay sau khi ký hợp đồng',30],['Hoàn thành phần thô, điện nước âm',30],['Hoàn thành phần hoàn thiện',30],['Nghiệm thu, bàn giao đưa vào sử dụng',10]],
 HD03:[['Ngay sau khi ký hợp đồng, chốt mẫu vật liệu',50],['Khi giao hàng đến công trình',40],['Nghiệm thu, bàn giao',10]],
 HD04:[['Ngay sau khi ký hợp đồng',20],['Khi Bên A duyệt hồ sơ thiết kế, khởi công',25],['Hoàn thành phần thô, điện nước âm',25],['Hoàn thành hoàn thiện và lắp đặt nội thất',20],['Nghiệm thu, bàn giao đưa vào sử dụng',10]]};
/* các thông số điều khoản mặc định (đề xuất, cần pháp chế duyệt) */
const PARAM0={pay_days:7,nt_notice:2,stop_days:15,stop_notice:7,term_days:15,pen_day:'0,1',pen_max:8,late_rate:10,fm_days:7,disp_days:30,
 bh_xd:12,bh_ct:24,bh_me:12,bh_nt:24,bh_visit:3,ret:5,tol:2,ban_in:2,concept:2,v3d:2,tk_fb:3,pbh_h:24,pbh_d:2,hl:30,tk1:7,tk2:10,tk3:10,tk4:3,nt_days:30};
const PARAM_LABEL={pay_days:'Hạn thanh toán (ngày)',nt_notice:'Báo trước nghiệm thu (ngày)',stop_days:'Chậm thanh toán thì tạm dừng sau (ngày)',stop_notice:'Báo trước tạm dừng (ngày)',term_days:'Hạn khắc phục trước khi chấm dứt (ngày)',pen_day:'Phạt chậm tiến độ (%/ngày)',pen_max:'Trần phạt (%)',late_rate:'Lãi chậm trả (%/năm)',fm_days:'Báo bất khả kháng (ngày)',disp_days:'Thương lượng tranh chấp (ngày)',bh_xd:'Bảo hành xây dựng – hoàn thiện (tháng)',bh_ct:'Bảo hành chống thấm (tháng)',bh_me:'Bảo hành điện – nước (tháng)',bh_nt:'Bảo hành nội thất (tháng)',bh_visit:'Có mặt kiểm tra bảo hành (ngày)',ret:'Giữ lại bảo hành (%)',tol:'Sai số kích thước nội thất (± mm)',ban_in:'Số bộ bản in A3',concept:'Số lần sửa concept',v3d:'Số lần sửa 3D / không gian',tk_fb:'Bên A phản hồi thiết kế (ngày)',pbh_h:'Phản hồi bảo hành (giờ)',pbh_d:'Kỹ thuật có mặt (ngày làm việc)',hl:'Hiệu lực báo giá (ngày)',tk1:'Khảo sát & concept (ngày)',tk2:'Phối cảnh 3D (ngày)',tk3:'Hồ sơ kỹ thuật (ngày)',tk4:'Bàn giao (ngày)',nt_days:'Sản xuất & lắp đặt nội thất (ngày)'};
const COMPANY0={daidien:'',chucvu:'Giám đốc',stk:'',nganhang:'',kythuat:'',nguoibg:'',noiky:'Văn phòng CENOVA, 158/C12 Phan Anh, P. Phú Thạnh, TP. Hồ Chí Minh'};
S.company={};S.hs={sel:'HD04',prev:false,cache:{},busy:'',open:{}};const hsOpen=id=>`id="${id}" ${S.hs.open[id]?'open':''}`;

/* ---- ngày, số ---- */
const addDays=(iso,n)=>{if(!iso)return '';const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+(+n||0));return d.toISOString().slice(0,10);};
const addMonths=(iso,n)=>{if(!iso)return '';const d=new Date(iso+'T00:00:00Z');d.setUTCMonth(d.getUTCMonth()+(+n||0));return d.toISOString().slice(0,10);};
const money=n=>(n==null||n==='')?'':Math.round(n).toLocaleString('vi-VN');
const weeksMax=s=>{const m=String(s||'').match(/(\d+)\s*tuần/);return m?(+m[1])*7:42;};
function inScope(scope,code){const d=code.startsWith('4-01');if(scope==='design')return d;if(scope==='nt')return code[0]==='3';if(scope==='xd')return !d&&code[0]!=='3';return true;}
function docsOf(e){e.docs=e.docs||{};const D=e.docs;D.v=D.v||{};D.pay=D.pay||{};D.hd=D.hd||(e.lines.some(l=>l.on&&l.code.startsWith('4-01'))?'HD04':'HD02');if(D.alloc==null)D.alloc=true;return D;}
/* mô hình giá trị dùng chung cho mọi hồ sơ: đơn giá đã phân bổ QL & dự phòng, làm tròn 100 đ */
function docModel(e,scope){const D=docsOf(e);const t=totals(e);const p=e.params;const f=D.alloc&&t.direct?(t.direct+t.ql+t.dp)/t.direct:1;
 const lines=[];let dsc=0;e.lines.forEach(L=>{if(!L.on||!inScope(scope,L.code))return;const pr=priceLine(L,e,t.K);dsc+=pr.amt;const unit=Math.round(pr.unit*f/100)*100;
  lines.push({code:L.code,name:L.name+(L.cdt?' (CĐT cấp, chỉ tính lắp đặt)':''),unit:L.unit,qty:L.qty,price:unit,amt:Math.round(unit*L.qty),bien:L.bien,spec:(CAT[L.code]?.ref||'').startsWith('S')?(CAT[L.code].spec||''):'',cdt:L.cdt});});
 if(!D.alloc&&t.direct){const sh=dsc/t.direct;const ql=Math.round(t.ql*sh),dp=Math.round(t.dp*sh);
  if(ql)lines.push({code:'9-99-001',name:`Chi phí quản lý, giám sát thi công (${pct(p.QL)})`,unit:'gói',qty:1,price:ql,amt:ql,bien:'TC',spec:''});
  if(dp)lines.push({code:'9-99-002',name:`Dự phòng phát sinh (${pct(p.DP)})`,unit:'gói',qty:1,price:dp,amt:dp,bien:'TC',spec:''});}
 const pre=lines.reduce((a,x)=>a+x.amt,0);const base=t.direct+t.ql+t.dp;const ckPct=base&&p.CK?Math.round(p.CK/base*10000)/10000:0;
 const ck=Math.round(pre*ckPct);const net=pre-ck;const vat=Math.round(net*p.VAT);
 const part=(tests)=>{const s=tests.map(fn=>lines.filter(x=>fn(x.code)).reduce((a,x)=>a+x.amt,0));const tot=s.reduce((a,b)=>a+b,0);if(!tot)return s.map(()=>0);
  const out=s.map(v=>Math.round(v*net/tot));const diff=net-out.reduce((a,b)=>a+b,0);const mi=out.indexOf(Math.max(...out));out[mi]+=diff;return out;};
 return {lines,pre,ckPct,ck,net,vat,total:net+vat,vatPct:p.VAT,part};}
function payOf(e,hd){const D=docsOf(e);const rows=(D.pay[hd]||PAY0[hd]||PAY0.HD04).map(r=>({dk:r.dk??r[0],pct:+(r.pct??r[1])||0}));return rows;}
function payAmts(rows,total){let acc=0;const n=rows.length;return rows.map((r,i)=>{if(i===n-1&&Math.abs(rows.reduce((a,x)=>a+x.pct,0)-100)<1e-6)return total-acc;const v=Math.round(total*r.pct/100);acc+=v;return v;});}
/* ngữ cảnh tính mặc định */
function docCtx(e,tpl){const D=docsOf(e);const V=D.v;const co={...COMPANY0,...(S.company||{})};const T=TEMPLATES[e.type]||{};
 const g=k=>V[k]!=null&&V[k]!==''?V[k]:undefined;const P=k=>g('p.'+k)??PARAM0[k];
 const hd=D.hd;const scope=tpl.scope==='hd'?TPL[hd].scope:tpl.scope;const M=docModel(e,scope);const MH=docModel(e,TPL[hd].scope);
 const ky=g('d.ky')||today();const tcDays=+(g('p.tc_days')??weeksMax(T.weeks));const tkDays=['tk1','tk2','tk3','tk4'].reduce((a,k)=>a+(+P(k)||0),0);
 const kc=g('d.kc')||addDays(ky,hd==='HD04'?tkDays:7);const done=addDays(kc,tcDays);const ntd=g('d.nt')||done;const bg=g('d.bg')||ntd;
 const soFull=(id)=>{const n=g('so.'+id);return n?`${n}/2026/${TPL[id].suffix}-CENOVA`:'';};
 const pay=payOf(e,tpl.pay||(tpl.kind==='docx'&&tpl.grp==='Hợp đồng'?tpl.id:hd));const payA=payAmts(pay,(tpl.grp==='Hợp đồng'||tpl.kind==='xlsx')?M.total:MH.total);
 const hdPay=payOf(e,hd);const hdPayA=payAmts(hdPay,MH.total);const dot=Math.max(1,Math.min(hdPay.length,+(g('tt02.dot')||2)));
 return {e,D,V,g,P,co,hd,M,MH,ky,kc,done,ntd,bg,tcDays,tkDays,soFull,hdNo:soFull(hd),pay,payA,hdPay,hdPayA,dot,T};}

/* ===================== DOCX ===================== */
const WNS='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const TOKRE=/(…{2,})h(…{2,})|ngày\s*(…{2,})\s*tháng\s*(…{2,})\s*năm\s*(\d{4})|(…{2,})\/(…{2,})\/(…{2,}|\d{4})|(…{2,})\/(…{2,})(?!\/)|(…{2,})|☐/g;
let jszipReady=null;function ensureZip(){if(window.JSZip)return Promise.resolve();if(!jszipReady)jszipReady=loadScript('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');return jszipReady;}
async function loadTpl(id){const c=S.hs.cache;if(c[id])return c[id];await ensureZip();const r=await fetch(TPL[id].file.replace(/^tpl\//,'tplb64/')+'.b64.txt');if(!r.ok)throw new Error('Không tải được mẫu '+id);const b64=(await r.text()).trim();const bin=atob(b64);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const buf=u.buffer;c[id]={buf};return c[id];}
const kids=(el,name)=>[...el.childNodes].filter(n=>n.nodeType===1&&n.localName===name);
function paraInfo(p){const ts=[...p.getElementsByTagNameNS(WNS,'t')];let text='';const map=[];ts.forEach(t=>{map.push({t,start:text.length});text+=t.textContent;});return {p,ts:map,text};}
function cellText(tc){return kids(tc,'p').map(p=>paraInfo(p).text).join(' ').replace(/\s+/g,' ').trim();}
function tokensOf(text){const out=[];TOKRE.lastIndex=0;let m;while((m=TOKRE.exec(text))){const s=m.index,full=m[0];const g=[];let type;
 const pos=(sub,from)=>{const i=text.indexOf(sub,from);return [i,i+sub.length];};
 if(m[1]){type='time';let a=pos(m[1],s),b=pos(m[2],a[1]);g.push(a,b);}
 else if(m[3]){type='datew';let a=pos(m[3],s),b=pos(m[4],a[1]);g.push(a,b,pos(m[5],b[1]));}
 else if(m[6]){type='date';let a=pos(m[6],s),b=pos(m[7],a[1]);g.push(a,b,pos(m[8],b[1]));}
 else if(m[9]){type='date2';let a=pos(m[9],s),b=pos(m[10],a[1]);g.push(a,b);}
 else if(m[11]){type='blank';g.push([s,s+full.length]);}
 else {type='check';g.push([s,s+1]);}
 out.push({type,start:s,end:s+full.length,g});}return out;}
function parseDocx(xml){const doc=new DOMParser().parseFromString(xml,'application/xml');const body=doc.getElementsByTagNameNS(WNS,'body')[0];
 const fields=[],blocks=[];let pi=0,ti=0;
 const addPara=(p,base,extra)=>{const info=paraInfo(p);const toks=tokensOf(info.text);let last=0;const blk={type:'p',info,toks:[]};
  toks.forEach((tk,k)=>{const before=info.text.slice(last,tk.start).replace(/\s+/g,' ').trim();let after=info.text.slice(tk.end,tk.end+70);
   if(tk.type==='check'){const nx=info.text.indexOf('☐',tk.end);after=info.text.slice(tk.end,nx<0?undefined:nx).replace(/\s+/g,' ').trim();}
   const f={key:base+'#'+k,type:tk.type,tok:tk,info,before:before.slice(-90),after:after.replace(/\s+/g,' '),paraText:info.text,...extra};fields.push(f);blk.toks.push(f);last=tk.end;});
  return blk;};
 for(const el of [...body.childNodes]){if(el.nodeType!==1)continue;
  if(el.localName==='p'){blocks.push(addPara(el,'p'+pi,{}));pi++;}
  else if(el.localName==='tbl'){const rows=kids(el,'tr');const head=kids(rows[0],'tc').map(cellText);const row0=head.join(' ');let role='';
   if(/^BÊN A/.test(row0))role='A';else if(/^BÊN B/.test(row0))role='B';else if(/^ĐỢT/.test(head[0])&&/TỶ LỆ/.test(row0))role='pay';else if(/^STT/.test(head[0])&&/NỘI DUNG/.test(row0))role='tt';else if(/NỘI DUNG/.test(row0)&&/GIÁ TRỊ/.test(row0))role='val';else if(/^HẠNG MỤC$/.test(head[0])&&/THỜI HẠN/.test(row0))role='bh';else if(/^GIAI ĐOẠN/.test(head[0]))role='stage';else if(head.length===2&&!/ĐẠI DIỆN|XÁC NHẬN|KHÁCH HÀNG \//.test(row0))role='info';else if(/ĐẠI DIỆN|XÁC NHẬN/.test(row0))role='sign';
   const spanOf=tc=>{const g=tc.getElementsByTagNameNS(WNS,'gridSpan')[0];return g?+(g.getAttribute('w:val')||g.getAttributeNS(WNS,'val'))||1:1;};const headGrid=[];kids(rows[0],'tc').forEach((tc,i)=>{for(let s=0;s<spanOf(tc);s++)headGrid.push(head[i]);});const tb={type:'tbl',rows:[],role};
   rows.forEach((tr,ri)=>{const tcs=kids(tr,'tc');const texts=tcs.map(cellText);const rowB=[];
    let gcol=0;tcs.forEach((tc,ci)=>{const gc=gcol;gcol+=spanOf(tc);const rowLabel=texts.slice(0,ci).filter(Boolean).join(' · ');const colHead=role==='info'?'':(headGrid[gc]||'');const cell={paras:[],empty:false,f:null};
     const ex={tbl:ti,row:ri,col:ci,role,rowLabel,colHead,row0};
     kids(tc,'p').forEach((p,pk)=>cell.paras.push(addPara(p,`t${ti}.${ri}.${ci}.${pk}`,ex)));
     if(ri>0||role==='info'){if(!texts[ci]&&ci>0&&role!=='sign'){const f={key:`t${ti}.${ri}.${ci}`,type:'cell',tc,...ex,before:'',after:'',paraText:''};fields.push(f);cell.f=f;cell.empty=true;}}
     rowB.push(cell);});tb.rows.push(rowB);});
   blocks.push(tb);ti++;}}
 return {doc,fields,blocks};}
/* ---- luật tự điền ---- */
function ruleFor(tpl,f,C){const b=f.before,a=f.after,rl=f.rowLabel||'',role=f.role,ty=f.type,id=tpl.id,{e,P,co,M,MH,g}=C;
 const R=(sem,label,def,extra)=>({sem,label,def:def??'',...extra});const SP=(k)=>R('p.'+k,PARAM_LABEL[k]||k,P(k),{param:true});
 const isHD=tpl.grp==='Hợp đồng';const A=k=>R('A.'+k,{ten:'Bên A: tên / đơn vị',cccd:'Bên A: CCCD / MST',ngaycap:'Bên A: ngày cấp',noicap:'Bên A: nơi cấp',diachi:'Bên A: địa chỉ',dt:'Bên A: điện thoại',email:'Bên A: email',daidien:'Bên A: người đại diện',chucvu:'Bên A: chức vụ'}[k],k==='ten'?(e.khach||''):k==='diachi'?(e.diachi||''):'',{party:'A'});
 const B=k=>R('co.'+k,{daidien:'CENOVA: người đại diện',chucvu:'CENOVA: chức vụ',stk:'CENOVA: số tài khoản',nganhang:'CENOVA: ngân hàng',kythuat:'CENOVA: cán bộ kỹ thuật'}[k],co[k],{company:true});
 /* checkbox */
 if(ty==='check'){const l=a;let d=false;
  if(/đã bao gồm thuế GTGT/.test(l))d=true;else if(/Fit-out/.test(l))d=true;else if(/Cải tạo, sửa chữa/.test(l))d=!!e.dk?.caitao;else if(/^Trọn gói vật tư/.test(l))d=true;else if(/^Theo đơn giá cố định/.test(l))d=true;
  else if(/^Nội thất$/.test(l))d=e.lines.some(x=>x.on&&x.code.startsWith('4-01')&&/nội thất/i.test(x.name));else if(/^Kết cấu – MEP$/.test(l))d=e.lines.some(x=>x.on&&x.code.startsWith('4-01')&&/M&E|MEP|PCCC/i.test(x.name));
  else if(/^Mua vật tư|^Huy động nhân lực|^Bản sao hợp đồng|^Biên bản nghiệm thu khối lượng|^Bảng xác định giá trị/.test(l))d=true;else if(/^Sản xuất nội thất/.test(l))d=e.lines.some(x=>x.on&&x.code[0]==='3');else if(/^Hoá đơn GTGT/.test(l))d=e.params.VAT>0;
  const lab=l||[rl,f.colHead].filter(Boolean).join(' — ');return R(`${id}:${f.key}`,lab,d,{check:true});}
 /* ô trống trong bảng */
 if(ty==='cell'){
  if(role==='val'){const L=rl;const pv=C.partVals||{};
   if(/^Giá trị trước thuế|^Giá trị quyết toán trước thuế/.test(L))return R(`calc:${id}:net`,L,money(M.net),{calc:true});
   if(/^Thuế GTGT/.test(L))return R(`calc:${id}:vat`,L,money(M.vat),{calc:true});
   if(/^TỔNG GIÁ TRỊ|^Giá trị quyết toán sau thuế/.test(L))return R(`calc:${id}:tot`,L,money(M.total),{calc:true});
   if(/^Đã tạm ứng/.test(L))return R('qt.paid','Đã tạm ứng / thanh toán (đ)',money(C.hdPayA.slice(0,-1).reduce((s,x)=>s+x,0)),{money:true});
   if(/^Giữ lại bảo hành/.test(L))return R(`calc:${id}:ret`,L,money(Math.round(M.total*(+P('ret')||0)/100)),{calc:true});
   if(/^GIÁ TRỊ CÒN LẠI/.test(L)){const paid=+String(g('qt.paid')??money(C.hdPayA.slice(0,-1).reduce((s,x)=>s+x,0))).replace(/\D/g,'');return R(`calc:${id}:con`,L,money(M.total-paid-Math.round(M.total*(+P('ret')||0)/100)),{calc:true});}
   for(const [k,v] of Object.entries(pv))if(L.startsWith(k))return R(`calc:${id}:part:${k}`,L,money(v),{calc:true});
   return null;}
  if(role==='pay'){const n=+rl.split(' · ')[0];if(/^CỘNG/.test(rl))return /SỐ TIỀN/.test(f.colHead)?R(`calc:${id}:paytot`,'Cộng',money(C.payA.reduce((s,x)=>s+x,0)),{calc:true}):null;
   if(n>=1){const r=C.pay[n-1];if(!r)return R(`calc:${id}:pay${n}`,'Đợt '+n,'',{calc:true});if(/THỜI ĐIỂM/.test(f.colHead))return R(`calc:${id}:pay${n}dk`,'Đợt '+n,r.dk,{calc:true});if(/SỐ TIỀN/.test(f.colHead))return R(`calc:${id}:pay${n}amt`,'Đợt '+n,money(C.payA[n-1]),{calc:true});}return null;}
  if(role==='info'){const L=rl;
   if(/^Công trình( \/ hạng mục)?$|^Tên công trình$/.test(L))return R('e.ten','Tên công trình',e.ten);
   if(/^Địa điểm$/.test(L))return R('e.diachi','Địa điểm',e.diachi);
   if(/^Hợp đồng số \/ ngày ký$/.test(L))return R(`calc:hdky`,L,C.hdNo?`${C.hdNo} ký ngày ${dvn(C.ky)}`:'',{calc:true});
   if(/^Hợp đồng số$/.test(L))return R('calc:hdno',L,C.hdNo,{calc:true});
   if(/^Hạng mục tạm ứng$/.test(L))return R('tt01.hm',L,`Tạm ứng đợt 1: ${C.hdPay[0]?.dk||''}`);
   if(/^Giai đoạn \/ hạng mục$/.test(L))return R('tt02.gd',L,`Đợt ${C.dot}: ${C.hdPay[C.dot-1]?.dk||''}`);
   if(/^Khách hàng \/ Điện thoại$/.test(L))return R('calc:khdt',L,[g('A.ten')||e.khach,g('A.dt')].filter(Boolean).join(' · '),{calc:true});
   if(/^Công trình \/ địa chỉ$/.test(L))return R('calc:ctdc',L,[e.ten,e.diachi].filter(Boolean).join(' · '),{calc:true});
   return null;}
  if(role==='tt'&&/SỐ TIỀN|GIÁ TRỊ/.test(f.colHead)){const L=rl.replace(/^\d+ · /,'');const tot=C.MH.total;const pctA=+(g('tt01.pct')??C.hdPay[0]?.pct??0);
   if(id==='TT01'){const paid=+String(g('tt01.paid')??'0').replace(/\D/g,'');
    if(/^Giá trị hợp đồng/.test(L))return R('calc:tt01tot',L,money(tot),{calc:true});
    if(/^Tỷ lệ tạm ứng/.test(L))return R('calc:tt01full',L,money(Math.round(tot*pctA/100)),{calc:true});
    if(/^Số tiền đã tạm ứng/.test(L))return R('tt01.paid','Đã tạm ứng các lần trước (đ)','0',{money:true});
    if(/^SỐ TIỀN ĐỀ NGHỊ/.test(L))return R('calc:tt01amt',L,money(Math.round(tot*pctA/100)-paid),{calc:true});}
   if(id==='TT02'){const n=C.dot;const A=C.hdPayA;const lk=A.slice(0,n).reduce((s,x)=>s+x,0),cur=A[n-1]||0,prev=A.slice(0,n-1).reduce((s,x)=>s+x,0);
    const num=k=>+String(g(k)??'0').replace(/\D/g,'');
    if(/^Giá trị hợp đồng/.test(L))return R('calc:tt02tot',L,money(tot),{calc:true});
    if(/^Giá trị khối lượng hoàn thành luỹ kế/.test(L))return R('tt02.lk','KL hoàn thành luỹ kế (đ)',money(lk),{money:true});
    if(/^Giá trị khối lượng hoàn thành đợt này/.test(L))return R('tt02.cur','KL hoàn thành đợt này (đ)',money(cur),{money:true});
    if(/^Số tiền đã tạm ứng/.test(L))return R('tt02.prev','Đã tạm ứng / thanh toán luỹ kế (đ)',money(prev),{money:true});
    if(/^Thu hồi tạm ứng/.test(L))return R('tt02.th','Thu hồi tạm ứng đợt này (đ)','0',{money:true});
    if(/^Giữ lại bảo hành/.test(L))return R('tt02.gl','Giữ lại bảo hành đợt này (đ)','0',{money:true});
    if(/^GIÁ TRỊ ĐỀ NGHỊ/.test(L)){const c=+String(g('tt02.cur')??cur).replace(/\D/g,'');return R('calc:tt02amt',L,money(c-num('tt02.th')-num('tt02.gl')),{calc:true});}}
   return null;}
  return null;}
 /* chỗ trống …… */
 const D3=(sem,label,def)=>R(sem,label,def,{date:true});
 if(role==='A'){if(/^Ông\/Bà/.test(rl))return A('ten');if(/^CCCD/.test(rl))return /Ngày cấp:$/.test(b)?A('ngaycap'):/Nơi cấp:$/.test(b)?A('noicap'):A('cccd');if(/^Địa chỉ/.test(rl))return A('diachi');if(/^Điện thoại/.test(rl))return /Email:$/.test(b)?A('email'):A('dt');if(/^Đại diện/.test(rl))return /Chức vụ:$/.test(b)?A('chucvu'):A('daidien');}
 if(role==='B'){if(/^Đại diện/.test(rl))return /Chức vụ:$/.test(b)?B('chucvu'):B('daidien');if(/^Số tài khoản/.test(rl))return /Ngân hàng:$/.test(b)?B('nganhang'):B('stk');if(/^Cán bộ kỹ thuật/.test(rl))return B('kythuat');}
 if(/Số tài khoản:$/.test(b))return B('stk');if(/tại Ngân hàng:$/.test(b))return B('nganhang');
 if(ty==='blank'&&/^Số:$/.test(b))return R('so.'+id,'Số văn bản '+id,'');
 if(ty==='blank'&&/^Đợt:$/.test(b))return R('tt02.dot','Đợt thanh toán số',String(C.dot));
 if(ty==='blank'&&/đợt$/.test(b)&&id==='TT02')return R('tt02.dot','Đợt thanh toán số',String(C.dot));
 if(/Báo giá số$/.test(b))return R('calc:bgno','Số báo giá',e.ma,{calc:true});
 if(ty==='date'&&/Báo giá số/.test(f.paraText)&&/ngày$/.test(b))return D3('d.bg_ngay','Ngày báo giá',(e.created||'').slice(0,10));
 if(ty==='datew'&&/Hôm nay/.test(b))return D3('d.ky','Ngày ký hợp đồng',C.ky);
 if(ty==='datew')return D3('d.lap:'+id,'Ngày lập văn bản',today());
 if(ty==='blank'&&/tại$/.test(b)&&/Hôm nay/.test(f.paraText))return R('co.noiky','Nơi ký',co.noiky,{company:true});
 if(/Tên công trình:$/.test(b))return R('e.ten','Tên công trình',e.ten);if(/Địa điểm:$/.test(b))return R('e.diachi','Địa điểm',e.diachi);
 if(/Quy mô \/ diện tích:$/.test(b))return R('calc:S','Diện tích',fmtq(e.S),{calc:true});if(/Số tầng \/ khu vực:$/.test(b))return R('e.khuvuc','Số tầng / khu vực','');
 if(/Bằng chữ:$/.test(b)){let n=M.total;if(id==='TT01'){const tot=C.MH.total;const pctA=+(g('tt01.pct')??C.hdPay[0]?.pct??0);n=Math.round(tot*pctA/100)-(+String(g('tt01.paid')??'0').replace(/\D/g,''));}
  if(id==='TT02'){const cur=+String(g('tt02.cur')??(C.hdPayA[C.dot-1]||0)).replace(/\D/g,'');n=cur-(+String(g('tt02.th')??'0').replace(/\D/g,''))-(+String(g('tt02.gl')??'0').replace(/\D/g,''));}
  return R(`calc:${id}:chu`,'Bằng chữ',words(n).replace(/ đồng$/,''),{calc:true});}
 if(role==='val'&&/^Thuế GTGT/.test(rl+b))return R('calc:vatpct','VAT (%)',String(Math.round(e.params.VAT*100)),{calc:true});
 if(role==='val'&&/Hạng mục khác:$/.test(b))return R(`${id}:khac`,'Tên dòng "Hạng mục khác"',C.khacLabel||'');
 if(role==='pay'&&ty==='blank'){const n=+rl.split(' · ')[0];const r=C.pay[n-1];return R(`calc:${id}:pay${n}pct`,'Tỷ lệ đợt '+n,r?String(r.pct):'',{calc:true});}
 if(role==='stage'){if(id==='HD01'){const m=rl.match(/^(\d)\./);if(m)return SP('tk'+m[1]);}
  if(id==='HD04'){if(/^1\. Thiết kế/.test(rl))return ty==='blank'?R('calc:tkdays','Thời gian thiết kế',String(C.tkDays),{calc:true}):D3('calc:m1','Mốc thiết kế',addDays(C.ky,C.tkDays));
   if(/^2\. Thi công/.test(rl))return ty==='blank'?R('p.tc_days','Thời gian thi công (ngày)',String(C.tcDays),{param:true}):D3('calc:m2','Mốc thi công',C.done);
   if(/^3\. Sản xuất/.test(rl))return ty==='blank'?SP('nt_days'):D3('calc:m3','Mốc nội thất',C.done);
   if(/^Nghiệm thu/.test(rl))return D3('d.nt','Ngày nghiệm thu, bàn giao',C.ntd);}}
 if(/Tổng thời gian thực hiện:$/.test(b))return R('calc:tkdays','Tổng thời gian thiết kế (ngày)',String(C.tkDays),{calc:true});
 if(/Ngày khởi công:$/.test(b))return D3('d.kc','Ngày khởi công',C.kc);if(/Thời gian thi công:$/.test(b))return R('p.tc_days','Thời gian thi công (ngày)',String(C.tcDays),{param:true});
 if(/Dự kiến hoàn thành:$/.test(b))return D3('calc:done','Dự kiến hoàn thành',C.done);
 if(/Thời gian sản xuất & lắp đặt:$/.test(b))return SP('nt_days');
 if(/Lắp đặt dự kiến từ ngày$/.test(b))return D3('d.ld1','Lắp đặt từ ngày',addDays(C.ky,Math.max(0,(+P('nt_days')||30)-7)));if(/^đến ngày$/.test(b)&&/Lắp đặt dự kiến/.test(f.paraText))return D3('d.ld2','Lắp đặt đến ngày',addDays(C.ky,+P('nt_days')||30));
 if(ty==='time'){if(/Bắt đầu:$/.test(b))return R('nt.h1','Giờ bắt đầu nghiệm thu','08:00',{time:true});if(/Kết thúc:$/.test(b))return R('nt.h2','Giờ kết thúc nghiệm thu','11:00',{time:true});return R('bg.h','Giờ bàn giao','09:00',{time:true});}
 if(ty==='date'&&/Bắt đầu:|Kết thúc:/.test(f.paraText))return D3('d.nt','Ngày nghiệm thu',C.ntd);
 if(/Biên bản nghiệm thu hoàn thành số$/.test(b))return R('calc:bbnt','Số BB nghiệm thu',g('so.NT02')?`${g('so.NT02')}/2026/BBNT-CENOVA`:'',{calc:true});
 if(ty==='date'&&/Biên bản nghiệm thu hoàn thành số/.test(f.paraText))return D3('d.nt','Ngày nghiệm thu',C.ntd);
 if(ty==='date'&&(/^Thời gian bàn giao/.test(rl)||/bảo hành tính từ ngày$/.test(b)||/Ngày bàn giao/.test(rl)))return D3('d.bg','Ngày bàn giao',C.bg);
 if(/Hợp đồng số ·/.test(rl)&&ty==='blank')return R('calc:hdno','Số hợp đồng',C.hdNo,{calc:true});
 if(role==='bh'){const mk=/^Phần xây dựng/.test(rl)?'bh_xd':/^Chống thấm/.test(rl)?'bh_ct':/^Hệ thống điện/.test(rl)?'bh_me':/^Nội thất/.test(rl)?'bh_nt':null;
  if(ty==='blank'&&mk)return SP(mk);if(ty==='date'){if(f.col===2)return D3('d.bg','Ngày bàn giao',C.bg);if(f.col===3&&mk)return D3(`calc:bhto:${mk}`,'Hết bảo hành',addMonths(C.bg,+P(mk)||0));}}
 if(/trước ngày$/.test(b)&&/Chấp nhận nghiệm thu có điều kiện/.test(f.paraText))return D3('nt02.fix','Hạn khắc phục tồn tại',addDays(C.ntd,7));
 if(/Kính gửi:$/.test(b)||(/giữa$/.test(b)))return R('A.ten','Bên A: tên / đơn vị',e.khach||'',{party:'A'});
 if(/Hợp đồng số$/.test(b))return R('calc:hdno','Số hợp đồng',C.hdNo,{calc:true});
 if(ty==='date'&&/ký ngày$/.test(b))return D3('d.ky','Ngày ký hợp đồng',C.ky);
 if(ty==='date'&&id==='TT02'&&/Biên bản nghiệm thu khối lượng/.test(f.paraText))return D3('tt02.ntd','Ngày nghiệm thu khối lượng đợt',today());
 if(/tại Điều$/.test(b))return R('calc:dieu','Điều khoản tạm ứng',TPL[C.hd].dieuTT||'',{calc:true});
 if(/Nội dung chuyển khoản:$/.test(b))return R(`${id}:ndck`,'Nội dung chuyển khoản',`${(g('A.ten')||e.khach||'').toUpperCase()} ${id==='TT01'?'TAM UNG':'THANH TOAN DOT '+C.dot} HD ${C.hdNo||''}`.trim());
 if(id==='TT01'&&role==='tt'&&ty==='blank')return R('tt01.pct','Tỷ lệ tạm ứng (%)',String(C.hdPay[0]?.pct??''));
 if(/Hạng mục khác|Khác:$/.test(b))return R(`${id}:${f.key}`,b.replace(/:$/,''),'');
 /* thông số điều khoản */
 const Q=[[/Hồ sơ bàn giao gồm$/,'ban_in'],[/concept tối đa$/,'concept'],[/3D tối đa$/,'v3d'],[/phản hồi trong vòng$/,'tk_fb',/ngày kể từ ngày nhận sản phẩm/],[/trong vòng$/,'pay_days',/ngày kể từ ngày Bên A nhận được đề nghị/],[/cho Bên A trước$/,'nt_notice'],
  [/chậm thanh toán quá$/,'stop_days'],[/bằng văn bản trước$/,'stop_notice'],[/khắc phục trong vòng$/,'term_days'],[/^phạt$|: phạt$/,'pen_day'],[/không vượt quá$/,'pen_max'],[/lãi suất$/,'late_rate'],[/bằng văn bản trong vòng$/,'fm_days'],
  [/không thương lượng được trong vòng$/,'disp_days'],[/Thời hạn bảo hành:$/,'bh_nt',/sản phẩm nội thất/],[/Thời hạn bảo hành:$/,'bh_xd'],[/^tháng đối với phần xây dựng – hoàn thiện;$/,'bh_ct'],[/kiểm tra trong vòng$/,'pbh_d',/ngày làm việc/],[/có mặt kiểm tra trong vòng$/,'bh_visit'],[/Tiền giữ lại bảo hành:$/,'ret'],
  [/Sản phẩm nội thất bảo hành$/,'bh_nt'],[/cho phép ±$/,'tol'],[/phản hồi trong vòng$/,'pbh_h',/giờ/],[/kiểm tra trong vòng$/,'pbh_d',/ngày làm việc/],[/có hiệu lực trong$/,'hl']];
 for(const [rb,k,ra] of Q)if(rb.test(b)&&(!ra||ra.test(a)))return SP(k);
 return null;}
function resolveFields(tpl,parsed,C){return parsed.fields.map(f=>{let r=null;try{r=ruleFor(tpl,f,C);}catch(err){console.warn(err);}
 if(r&&String(r.sem).startsWith('calc:'))r.calc=true;
 if(!r){if(f.type==='cell')return null;const lab=[f.rowLabel,f.colHead,f.before||f.after].filter(Boolean).join(' · ')||'Chỗ trống';r={sem:`${tpl.id}:${f.key}`,label:lab.slice(-70),def:'',free:true,date:/date/.test(f.type),time:f.type==='time'};}
 const v=r.calc?r.def:(C.V[r.sem]!=null?C.V[r.sem]:(r.company&&S.company&&S.company[r.sem.slice(3)]!=null?S.company[r.sem.slice(3)]:r.def));return {f,...r,val:v};}).filter(Boolean);}
function partsFor(tpl,C){const M=C.M,id=tpl.id==='NT02'?C.hd:tpl.id;const s=c=>c;const de=c=>c.startsWith('4-01'),lg=c=>/^4-0[0234]/.test(c),tho=c=>/^1-(00|01|02|03|11|12)/.test(c),ht=c=>/^1-(04|05|06|07|08|09|10|13)/.test(c),me=c=>c[0]==='2',nt=c=>c[0]==='3',ch=c=>c[0]==='9';
 const arch=c=>de(c)&&/kiến trúc|kết cấu|M&E|MEP|PCCC|cơ điện/i.test(CAT[c]?.name||'');
 let defs,labels,khac='';
 if(id==='HD01'){defs=[c=>de(c)&&arch(c),c=>de(c)&&!arch(c)&&/nội thất/i.test(CAT[c]?.name||''),c=>de(c)&&!arch(c)&&!/nội thất/i.test(CAT[c]?.name||'')];labels=['Thiết kế kiến trúc','Thiết kế nội thất','Hạng mục khác'];khac='Thiết kế khác';}
 else if(id==='HD02'){defs=[tho,ht,me,c=>lg(c)||ch(c)];labels=['Phần thô','Phần hoàn thiện','Điện – nước (MEP)','Hạng mục khác'];khac='Pháp lý, chi phí chung';}
 else if(id==='HD03'){defs=[c=>/^3-(01|02|07|00)/.test(c),c=>/^3-0[345]/.test(c),c=>/^3-06/.test(c),c=>false];labels=['Nội thất liên tường','Đồ rời','Thiết bị & phụ kiện','Vận chuyển & lắp đặt'];}
 else {defs=[de,c=>tho(c)||ht(c)||me(c)||ch(c),nt,lg];labels=['Phần thiết kế','Phần thi công xây dựng – hoàn thiện','Phần nội thất','Hạng mục khác'];khac='Pháp lý, giấy phép';}
 const MM=tpl.grp==='Hợp đồng'?M:docModel(C.e,TPL[id]?.scope||'all');const vals=MM.part(defs);const pv={};labels.forEach((l,i)=>pv[l]=vals[i]);return {pv,khac};}
async function buildDocx(tpl,e,{preview}={}){const T=await loadTpl(tpl.id);const zip=await JSZip.loadAsync(T.buf);const xml=await zip.file('word/document.xml').async('string');const parsed=parseDocx(xml);
 const C=docCtx(e,tpl);const pp=partsFor(tpl,C);C.partVals=pp.pv;C.khacLabel=pp.khac;const res=resolveFields(tpl,parsed,C);
 if(preview)return {parsed,res,C};
 /* ghi: theo từng đoạn, thay từ cuối lên đầu */
 const byInfo=new Map();res.forEach(r=>{if(r.f.type==='cell')return;const k=r.f.info;if(!byInfo.has(k))byInfo.set(k,[]);byInfo.get(k).push(r);});
 for(const [info,list] of byInfo){const edits=[];
  list.forEach(r=>{const v=r.val;const tk=r.f.tok;if(r.check){if(v===true||v==='true')edits.push([tk.g[0][0],tk.g[0][1],'☒']);return;}
   if(v==null||v==='')return;
   if(/date/.test(r.f.type)||r.f.type==='datew'){const [y,m,d]=String(v).split('-');if(!d)return;edits.push([tk.g[0][0],tk.g[0][1],d]);edits.push([tk.g[1][0],tk.g[1][1],m]);if(tk.g[2])edits.push([tk.g[2][0],tk.g[2][1],y]);return;}
   if(r.f.type==='time'){const [h,mi]=String(v).split(':');edits.push([tk.g[0][0],tk.g[0][1],h||'']);edits.push([tk.g[1][0],tk.g[1][1],mi||'00']);return;}
   edits.push([tk.g[0][0],tk.g[0][1],String(v)]);});
  edits.sort((x,y)=>y[0]-x[0]).forEach(([s,en,txt])=>replaceRange(info,s,en,txt));}
 res.filter(r=>r.f.type==='cell'&&r.val!=null&&r.val!=='').forEach(r=>writeCell(r.f.tc,String(r.val)));
 zip.file('word/document.xml',new XMLSerializer().serializeToString(parsed.doc));
 return zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});}
function replaceRange(info,s,en,txt){let first=true;for(const {t,start} of info.ts){const tl=t.textContent.length,ts=start,te=start+tl;if(te<=s||ts>=en)continue;
 const a=Math.max(s,ts)-ts,b2=Math.min(en,te)-ts;const cur=t.textContent;t.textContent=cur.slice(0,a)+(first?txt:'')+cur.slice(b2);t.setAttribute('xml:space','preserve');first=false;}}
function writeCell(tc,text){const doc=tc.ownerDocument;const p=kids(tc,'p')[0]||tc.appendChild(doc.createElementNS(WNS,'w:p'));
 const tr=tc.parentNode;const lab=[...tr.getElementsByTagNameNS(WNS,'rPr')].find(x=>x.parentNode.localName==='r');
 const r=doc.createElementNS(WNS,'w:r');if(lab)r.appendChild(lab.cloneNode(true));const t=doc.createElementNS(WNS,'w:t');t.setAttribute('xml:space','preserve');t.textContent=text;r.appendChild(t);p.appendChild(r);}

/* ===================== XLSX ===================== */
const SNS='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const colN=c=>c.split('').reduce((a,ch)=>a*26+ch.charCodeAt(0)-64,0);const colL=n=>{let s='';while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26);}return s;};
async function openXlsx(id){const T=await loadTpl(id);const zip=await JSZip.loadAsync(T.buf);const P=new DOMParser();const X={zip,docs:{},sheets:{}};
 const wbx=await zip.file('xl/workbook.xml').async('string');X.wb=P.parseFromString(wbx,'application/xml');
 const rels=P.parseFromString(await zip.file('xl/_rels/workbook.xml.rels').async('string'),'application/xml');const rmap={};[...rels.getElementsByTagName('Relationship')].forEach(r=>rmap[r.getAttribute('Id')]=r.getAttribute('Target'));
 for(const s of [...X.wb.getElementsByTagName('sheet')]){const rid=s.getAttribute('r:id')||s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');let path='xl/'+rmap[rid].replace(/^\/?xl\//,'');
  X.sheets[s.getAttribute('name')]={path,doc:P.parseFromString(await zip.file(path).async('string'),'application/xml')};}
 const sst=zip.file('xl/sharedStrings.xml');X.sst=[];if(sst){const d=P.parseFromString(await sst.async('string'),'application/xml');X.sst=[...d.getElementsByTagName('si')].map(si=>[...si.getElementsByTagName('t')].map(t=>t.textContent).join(''));}
 return X;}
function xRow(sd,r,create){const sheetData=sd.getElementsByTagName('sheetData')[0];let row=[...sheetData.getElementsByTagName('row')].find(x=>+x.getAttribute('r')===r);
 if(!row&&create){row=sd.createElementNS(SNS,'row');row.setAttribute('r',r);const after=[...sheetData.getElementsByTagName('row')].find(x=>+x.getAttribute('r')>r);sheetData.insertBefore(row,after||null);}return row;}
function xCell(X,sheet,ref,create=true){const sd=X.sheets[sheet].doc;const m=ref.match(/^([A-Z]+)(\d+)$/);const row=xRow(sd,+m[2],create);if(!row)return null;let c=[...row.getElementsByTagName('c')].find(x=>x.getAttribute('r')===ref);
 if(!c&&create){c=sd.createElementNS(SNS,'c');c.setAttribute('r',ref);const after=[...row.getElementsByTagName('c')].find(x=>colN(x.getAttribute('r').match(/[A-Z]+/)[0])>colN(m[1]));row.insertBefore(c,after||null);}return c;}
function xGet(X,sheet,ref){const c=xCell(X,sheet,ref,false);if(!c)return '';const t=c.getAttribute('t');if(t==='s'){const v=c.getElementsByTagName('v')[0];return v?X.sst[+v.textContent]||'':'';}if(t==='inlineStr')return [...c.getElementsByTagName('t')].map(x=>x.textContent).join('');const v=c.getElementsByTagName('v')[0];return v?v.textContent:'';}
function xSet(X,sheet,ref,val){const c=xCell(X,sheet,ref);const sd=X.sheets[sheet].doc;[...c.childNodes].forEach(n=>{if(n.localName!=='f')c.removeChild(n);});const f=c.getElementsByTagName('f')[0];if(f)c.removeChild(f);
 if(val===''||val==null){c.removeAttribute('t');return;}
 if(typeof val==='number'){c.setAttribute('t','n');const v=sd.createElementNS(SNS,'v');v.textContent=String(val);c.appendChild(v);}
 else{c.setAttribute('t','inlineStr');const is=sd.createElementNS(SNS,'is');const t=sd.createElementNS(SNS,'t');t.setAttribute('xml:space','preserve');t.textContent=String(val);is.appendChild(t);c.appendChild(is);}}
function xFillText(X,sheet,ref,vals){let s=xGet(X,sheet,ref);let i=0;s=s.replace(/…{2,}|_{3,}/g,m=>{const v=vals[i++];return v==null||v===''?m:String(v);});xSet(X,sheet,ref,s);}
function shiftRef(f,fSheet,tSheet,at,n){/* dời tham chiếu hàng >= at trong công thức */
 return f.split(/("(?:[^"]|"")*")/).map((seg,i)=>i%2?seg:seg.replace(/((?:'[^']+'|[A-Za-z_][\w.]*)!)?(\$?)([A-Z]{1,3})(\$?)(\d+)(?![\w(])/g,(m,sp,d1,col,d2,row)=>{
  const sh=sp?sp.replace(/!$/,'').replace(/^'|'$/g,''):fSheet;if(sh!==tSheet||+row<at)return m;return (sp||'')+d1+col+d2+(+row+n);})).join('');}
function xInsertRows(X,sheet,at,n){if(n<=0)return;const S0=X.sheets[sheet];const sd=S0.doc;const rows=[...sd.getElementsByTagName('row')];
 const tplRow=rows.find(r=>+r.getAttribute('r')===at);
 /* 1. dời hàng của sheet */
 rows.filter(r=>+r.getAttribute('r')>=at).sort((a,b)=>b.getAttribute('r')-a.getAttribute('r')).forEach(r=>{const nr=+r.getAttribute('r')+n;r.setAttribute('r',nr);[...r.getElementsByTagName('c')].forEach(c=>c.setAttribute('r',c.getAttribute('r').replace(/\d+$/,nr)));});
 /* 2. công thức mọi sheet */
 for(const [name,s] of Object.entries(X.sheets))[...s.doc.getElementsByTagName('f')].forEach(f=>{f.textContent=shiftRef(f.textContent,name,sheet,at,n);});
 /* 3. hàng mới chép từ hàng mẫu */
 for(let k=0;k<n;k++){const nr=at+k;const cl=tplRow.cloneNode(true);cl.setAttribute('r',nr);[...cl.getElementsByTagName('c')].forEach(c=>{c.setAttribute('r',c.getAttribute('r').replace(/\d+$/,nr));
  const f=c.getElementsByTagName('f')[0];if(f){f.textContent=f.textContent.replace(/([A-Z]{1,3})(\d+)/g,(m,col,row)=>+row===at+n?col+nr:m);}else{[...c.childNodes].forEach(x=>c.removeChild(x));c.removeAttribute('t');}});
  tplRow.parentNode.insertBefore(cl,tplRow);}
 /* 4. vùng gộp, kiểm tra dữ liệu, định dạng có điều kiện, dimension */
 const shiftSq=s=>s.split(' ').map(rg=>rg.split(':').map(x=>x.replace(/([A-Z]+)(\d+)/,(m,c,r)=>+r>=at?c+(+r+n):m)).join(':')).join(' ');
 [...sd.getElementsByTagName('mergeCell')].forEach(m=>m.setAttribute('ref',shiftSq(m.getAttribute('ref'))));
 ['dataValidation','conditionalFormatting','selection'].forEach(tg=>[...sd.getElementsByTagName(tg)].forEach(m=>{if(m.getAttribute('sqref'))m.setAttribute('sqref',shiftSq(m.getAttribute('sqref')));}));
 [...sd.getElementsByTagName('dimension')].forEach(d=>d.setAttribute('ref',shiftSq(d.getAttribute('ref'))));
 /* 5. tên vùng in, công thức tên */
 [...X.wb.getElementsByTagName('definedName')].forEach(d=>{d.textContent=shiftRef(d.textContent,'',sheet,at,n).replace(new RegExp("('?"+sheet.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+"'?!\\$)(\\d+):\\$(\\d+)"),(m,p,a1,a2)=>p+(+a1>=at?+a1+n:a1)+':$'+(+a2>=at?+a2+n:a2));});
 X.shifted=X.shifted||{};(X.shifted[sheet]=X.shifted[sheet]||[]).push([at,n]);}
async function xFinish(X){const ser=new XMLSerializer();
 for(const s of Object.values(X.sheets)){[...s.doc.getElementsByTagName('f')].forEach(f=>{const c=f.parentNode;[...c.getElementsByTagName('v')].forEach(v=>c.removeChild(v));if(c.getAttribute('t')==='str'||c.getAttribute('t')==='n')c.removeAttribute('t');});X.zip.file(s.path,ser.serializeToString(s.doc));}
 let cp=X.wb.getElementsByTagName('calcPr')[0];if(!cp){cp=X.wb.createElementNS(SNS,'calcPr');X.wb.documentElement.appendChild(cp);}cp.setAttribute('fullCalcOnLoad','1');
 X.zip.file('xl/workbook.xml',ser.serializeToString(X.wb));
 /* dời neo hình, ghi chú của sheet đã chèn hàng */
 for(const [sheet,ops] of Object.entries(X.shifted||{})){const sp=X.sheets[sheet].path;const relp=sp.replace(/worksheets\/(sheet\d+\.xml)$/,'worksheets/_rels/$1.rels');const rf=X.zip.file(relp);if(!rf)continue;
  const rels=new DOMParser().parseFromString(await rf.async('string'),'application/xml');
  for(const r of [...rels.getElementsByTagName('Relationship')]){const tgt='xl/'+r.getAttribute('Target').replace(/^\.\.\//,'');const fz=X.zip.file(tgt);if(!fz)continue;let s=await fz.async('string');
   for(const [at,n] of ops){if(/drawing\d+\.xml$/.test(tgt))s=s.replace(/<xdr:row>(\d+)<\/xdr:row>/g,(m,v)=>+v>=at-1?`<xdr:row>${+v+n}</xdr:row>`:m);
    if(/comments\d+\.xml$/.test(tgt))s=s.replace(/ref="([A-Z]+)(\d+)"/g,(m,c,v)=>+v>=at?`ref="${c}${+v+n}"`:m);
    if(/vmlDrawing\d+\.vml$/.test(tgt))s=s.replace(/<x:Row>(\d+)<\/x:Row>/g,(m,v)=>+v>=at-1?`<x:Row>${+v+n}</x:Row>`:m);}
   X.zip.file(tgt,s);}}
 return X.zip.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});}
/* đổ dòng vào các mục; sections: [{title, from, to}] (hàng gốc của mẫu), buckets: [{title, lines}] */
function xFillSections(X,sheet,sections,buckets,cols,opts={}){let off=0;let stt=0;
 sections.forEach((sec,i)=>{const bk=buckets[i];const from=sec.from+off,to0=sec.to+off,title=sec.title+off;let cap=to0-from+1;
  if(!bk||(!bk.lines.length&&bk.keep)){off+=0;stt+=bk?.keep?(bk.keepCount||0):0;return;}
  if(bk.title!=null)xSet(X,sheet,cols.title+title,bk.title);
  const need=bk.lines.length;if(need>cap){xInsertRows(X,sheet,to0,need-cap);off+=need-cap;cap=need;}
  for(let k=0;k<cap;k++){const r=from+k;const L=bk.lines[k];
   Object.entries(cols.data).forEach(([key,col])=>{let v='';if(L){v=key==='stt'?++stt:(L[key]??'');}xSet(X,sheet,col+r,v);});
   if(L)xFitRow(X,sheet,r,[cols.data.name,cols.data.spec,cols.data.mat].filter(Boolean),[L.name,L.spec,L.mat]);}});
 return off;}
function xColW(X,sheet){const S0=X.sheets[sheet];if(S0.cw)return S0.cw;const cw={};[...S0.doc.getElementsByTagName('col')].forEach(c=>{for(let i=+c.getAttribute('min');i<=+c.getAttribute('max');i++)cw[i]=+c.getAttribute('width')||9;});
 /* cột gộp trong hàng mục (ví dụ B:H) không tính, chỉ dùng độ rộng chính cột */return S0.cw=cw;}
function xFitRow(X,sheet,r,cols,texts){const cw=xColW(X,sheet);let lines=1;cols.forEach((c,i)=>{const t=String(texts[i]||'');if(!t)return;const per=Math.max(8,(cw[colN(c)]||12)*1.2);lines=Math.max(lines,t.split('\n').reduce((a,s)=>a+Math.max(1,Math.ceil(s.length/per)),0));});
 const row=xRow(X.sheets[sheet].doc,r,false);if(!row)return;const ht=Math.max(19.5,lines*13+7);row.setAttribute('ht',String(ht));row.setAttribute('customHeight','true');}
function hdrInfo(C){const {e,g,co}=C;return {kh:g('A.ten')||e.khach||'',lh:g('A.daidien')||'',dt:g('A.dt')||'',em:g('A.email')||'',ct:e.ten||'',dc:e.diachi||'',qm:`${fmtq(e.S)} m² · ${TEMPLATES[e.type]?.label||''}`,nbg:co.nguoibg||co.daidien||''};}
const vatLabel=v=>v>=.1?'VAT 10%':v>=.08?'VAT 8%':'Không VAT';
async function buildXlsx(tpl,e){const X=await openXlsx(tpl.id);const C=docCtx(e,tpl);const M=C.M;const H=hdrInfo(C);const so=C.g('so.'+tpl.id)||'____';const dnow=dvn(C.g('d.lap:'+tpl.id)||today());
 const sec=(r,c)=>({title:r,from:r+1,to:c});
 const mapL=L=>({name:L.name,spec:L.spec,unit:L.unit,qty:L.qty,price:L.price,vt:L.price,nc:0,note:L.cdt?'CĐT cấp':''});
 const head=(sheet,c)=>{xSet(X,sheet,c.kh,H.kh);xSet(X,sheet,c.lh,H.lh);xSet(X,sheet,c.dt,H.dt);xSet(X,sheet,c.em,H.em);xSet(X,sheet,c.ct,H.ct);xSet(X,sheet,c.dc,H.dc);xSet(X,sheet,c.qm,H.qm);xSet(X,sheet,c.nbg,H.nbg);};
 const pays=(sheet,rows,colDk,colPct)=>{rows.forEach((r,i)=>{const p=C.pay[i];xSet(X,sheet,colDk+r,p?p.dk:'');xSet(X,sheet,colPct+r,p?p.pct/100:'');});};
 const NC=/^nhân công|công lắp|lắp đặt|^lắp |thi công \(nhân công\)/i;
 if(tpl.id==='BG02'){const s1='TỔNG HỢP',s2='CHI TIẾT';head(s1,{kh:'C10',lh:'C11',dt:'C12',em:'C13',ct:'E10',dc:'E11',qm:'E12',nbg:'E13'});
  xSet(X,s1,'F6',`BG-TC-${so}/2026`);xSet(X,s1,'F7',dnow);xSet(X,s2,'J6',`BG-TC-${so}/2026`);xSet(X,s2,'J7',dnow);
  xSet(X,s1,'D24',M.ckPct);xSet(X,s1,'C26',vatLabel(M.vatPct));xSet(X,s1,'C28',words(M.total));pays(s1,[31,32,33,34],'B','D');
  xFillText(X,s1,'B41',[C.tcDays]);xFillText(X,s1,'B42',[C.P('bh_xd')]);xFillText(X,s1,'B43',[C.P('hl')]);
  const B=[[],[],[],[],[]];M.lines.forEach(L=>{const c=L.code;const i=/^1-(00|01)|^9-03/.test(c)&&!/vệ sinh/i.test(L.name)?0:/^1-(02|03|11|12)/.test(c)?1:/^1-/.test(c)?2:c[0]==='2'?3:4;const m=mapL(L);
   if(NC.test(L.name)){m.vt=0;m.nc=L.price;}else if(L.bien==='TC'&&!/vật tư/i.test(L.name))m.note=m.note||'Trọn gói VT + NC';B[i].push(m);});
  xFillSections(X,s2,[sec(13,17),sec(18,23),sec(24,29),sec(30,34),sec(35,38)],B.map(l=>({lines:l})),{title:'B',data:{stt:'A',name:'B',spec:'C',unit:'D',qty:'E',vt:'F',nc:'G',note:'J'}});}
 else if(tpl.id==='BG03'){const s1='TỔNG HỢP',s2='LIÊN TƯỜNG',s3='ĐỒ RỜI';head(s1,{kh:'C10',lh:'C11',dt:'C12',em:'C13',ct:'E10',dc:'E11',qm:'E12',nbg:'E13'});
  [[s1,'F'],[s2,'K'],[s3,'K']].forEach(([s,c])=>{xSet(X,s,c+'6',`BG-NT-${so}/2026`);xSet(X,s,c+'7',dnow);});
  xSet(X,s1,'D23',M.ckPct);xSet(X,s1,'C25',vatLabel(M.vatPct));xSet(X,s1,'C27',words(M.total));pays(s1,[30,31,32,33],'B','D');
  xFillText(X,s1,'B40',[C.P('nt_days')]);xFillText(X,s1,'B41',[C.P('bh_nt')]);xFillText(X,s1,'B42',[C.P('hl')]);
  const g=re=>M.lines.filter(L=>re.test(L.code)).map(L=>({...mapL(L),sl:1,mat:''}));
  const cols={title:'B',data:{stt:'A',name:'B',spec:'C',mat:'D',unit:'F',qty:'G',sl:'H',price:'I',note:'K'}};
  xFillSections(X,s2,[sec(13,17),sec(18,23),sec(24,27)],[{title:'TỦ, KỆ GỖ CÔNG NGHIỆP',lines:g(/^3-01/)},{title:'QUẦY LỄ TÂN, MẶT ĐÁ',lines:g(/^3-02/)},{title:'HẠNG MỤC KHÁC',lines:g(/^3-0[07]/)}],cols);
  xFillSections(X,s3,[sec(13,17),sec(18,21)],[{title:'ĐỒ RỜI, GIƯỜNG, GHẾ, ĐỒ INOX',lines:g(/^3-0[345]/)},{title:'THIẾT BỊ CHUYÊN DỤNG',lines:g(/^3-06/)}],cols);
  xSet(X,s1,'E19','');xSet(X,s1,'E20','');}
 else if(tpl.id==='BG01'){const s1='BG THEO M2',s2='BG TRON GOI';[s1,s2].forEach(s=>head(s,{kh:'C10',lh:'C11',dt:'C12',em:'C13',ct:'F10',dc:'F11',qm:'F12',nbg:'F13'}));
  xSet(X,s1,'H6',`BG-TK-${so}/2026`);xSet(X,s1,'H7',dnow);xSet(X,s2,'H6',`BG-TKG-${so}/2026`);xSet(X,s2,'H7',dnow);
  xSet(X,s1,'F36',M.ckPct);xSet(X,s1,'E38',vatLabel(M.vatPct));xSet(X,s1,'C40',words(M.total));pays(s1,[50,51,52,53],'B','F');
  ['tk1','tk2','tk3','tk4'].forEach((k,i)=>xSet(X,s1,'E'+(44+i),+C.P(k)||''));xFillText(X,s1,'B61',[C.P('hl')]);
  [18,19,23,24,28].forEach(r=>{xSet(X,s2,'E'+r,'');xSet(X,s2,'F'+r,'');});xSet(X,s2,'E34',vatLabel(M.vatPct));
  const arch=L=>/kiến trúc|kết cấu|M&E|MEP|PCCC|cơ điện/i.test(L.name);const m=L=>({...mapL(L),spec:L.spec||'Theo phạm vi báo giá'});
  const A=M.lines.filter(arch).map(m),Bn=M.lines.filter(L=>!arch(L)&&/nội thất/i.test(L.name)).map(m),Cc=M.lines.filter(L=>!arch(L)&&!/nội thất/i.test(L.name)).map(m);
  xFillSections(X,s1,[sec(17,23),sec(24,29),sec(30,34)],[{lines:A},{lines:Bn},{lines:Cc,keep:true,keepCount:2}],{title:'B',data:{stt:'A',name:'B',spec:'C',unit:'D',qty:'E',price:'F',note:'H'}});}
 else if(tpl.id==='NT01'){const s1='TỔNG HỢP QT',s2='CHI TIẾT QT',s3='PHÁT SINH';xSet(X,s1,'C10',C.hdNo);xSet(X,s1,'C11',H.kh);xSet(X,s1,'C12',H.ct);xSet(X,s1,'C13',H.dc);
  xSet(X,s1,'E6',`QT-${so}/2026`);xSet(X,s1,'E7',dnow);xSet(X,s2,'K6',`QT-${so}/2026`);xSet(X,s2,'K7',dnow);xSet(X,s3,'J6',`PS-${so}/2026`);xSet(X,s3,'J7',dnow);
  xSet(X,s1,'C22',vatLabel(M.vatPct));xSet(X,s1,'D32',(+C.P('ret')||0)/100);
  const m=L=>({name:L.name,unit:L.unit,qty:L.qty,price:L.price,qa:L.qty});
  xFillSections(X,s2,[sec(14,18),sec(19,23)],[{lines:M.lines.filter(L=>L.code[0]!=='3').map(m)},{lines:M.lines.filter(L=>L.code[0]==='3').map(m)}],{title:'B',data:{stt:'A',name:'B',unit:'C',qty:'D',price:'E',qa:'G'}});
  for(let r=11;r<=12;r++)['A','B','C','D','E','F','H','I'].forEach(c=>xSet(X,s3,c+r,''));}
 return xFinish(X);}
/* xem trước dạng bảng cho Excel */
function xlsxSummary(tpl,e){const C=docCtx(e,tpl);const M=C.M;return {C,M};}

/* ===================== GIAO DIỆN ===================== */
function hsEdit(){const e=curProj();if(S.role==='chihuy')return false;if(S.role==='gd'||!e||S.me.offline||!e.createdBy)return true;return isMine(e);}
function coAdmin(){return S.me.offline||S.me.isOwner||S.me.canEdit;}
async function hsLoad(e){const id=S.hs.sel;const tpl=TPL[id];if(tpl.kind!=='docx'){S.hs.view=null;return;}S.hs.busy='Đang đọc mẫu '+id;try{S.hs.view=await buildDocx(tpl,e,{preview:true});S.hs.err=null;}catch(err){S.hs.err=err.message||String(err);S.hs.view=null;}S.hs.busy='';S.hs.viewKey=e.id+':'+id+':'+JSON.stringify(e.docs||{})+JSON.stringify(S.company||{})+e.updated;render();}
function vHoso(){const e=curProj();if(!e)return pickProject('Hồ sơ hợp đồng')+noProject();const D=docsOf(e);const tpl=TPL[S.hs.sel];const ed=hsEdit();
 const key=e.id+':'+tpl.id+':'+JSON.stringify(e.docs||{})+JSON.stringify(S.company||{})+e.updated;if(tpl.kind==='docx'&&S.hs.viewKey!==key&&!S.hs.busy){S.hs.viewKey=key;setTimeout(()=>hsLoad(e),0);}
 const groups=[...new Set(TPLS.map(t=>t.grp))];const C=docCtx(e,tpl);const M=C.M;
 return pickProject('Hồ sơ hợp đồng')+`<div class="sm muted" style="margin:-4px 0 12px">Điền tự động 12 mẫu của công ty (thư mục FROME MẪU HỢP ĐỒNG) từ dự toán. Giữ nguyên định dạng, logo, công thức của file gốc; tải về Word/Excel để in ký.</div>
 <div class="hs-grid"><nav class="panel stack hs-list" aria-label="Mẫu hồ sơ">${groups.map(gp=>`<div><div class="lbl" style="margin-bottom:4px">${gp}</div>${TPLS.filter(t=>t.grp===gp).map(t=>`<button class="hs-item" data-act="hs_sel" data-v="${t.id}" aria-current="${t.id===tpl.id}"><span class="code">${t.id}</span> ${t.name}<span class="sm muted">${t.kind==='docx'?'Word':'Excel'}${t.grp==='Hợp đồng'&&t.id===D.hd?' · HĐ chính':''}</span></button>`).join('')}</div>`).join('')}</nav>
 <div class="stack" style="min-width:0">
  <div class="panel stack"><div class="row sb"><div><h3>${tpl.id} · ${tpl.name}</h3><div class="sm muted">Phạm vi: ${{design:'phần thiết kế',xd:'thi công xây dựng – hoàn thiện, M&E, chi phí chung (không gồm nội thất, thiết kế)',nt:'nội thất & thiết bị',all:'toàn bộ dự toán',hd:'theo hợp đồng chính '+D.hd}[tpl.scope]}</div></div>
   <div class="row"><button class="b pri" data-act="hs_dl" ${S.hs.busy?'disabled':''}>Tải ${tpl.kind==="docx"?"Word":"Excel"}</button><button class="b" data-act="hs_pdf" ${S.hs.busy?'disabled':''}>Tải PDF</button></div></div>
   <div class="kpis"><div class="kpi"><span class="lbl">Trước thuế (sau CK)</span><span class="v">${money(M.net)}</span></div><div class="kpi"><span class="lbl">VAT ${pct(M.vatPct)}</span><span class="v">${money(M.vat)}</span></div><div class="kpi"><span class="lbl">Tổng giá trị</span><span class="v">${money(M.total)}</span><span class="sm muted">${M.lines.length} hạng mục</span></div></div>
   ${M.lines.length?'':`<div class="banner warn">Dự toán chưa có hạng mục thuộc phạm vi mẫu này${tpl.scope==='design'?' (nhóm 4-01 thiết kế)':''}. File vẫn tải được nhưng bảng giá trị sẽ trống.</div>`}
   <div class="row sm"><label class="ck"><input type="checkbox" id="hs_alloc" ${D.alloc?'checked':''} ${ed?'':'disabled'}><span>Phân bổ quản lý ${pct(e.params.QL)} và dự phòng ${pct(e.params.DP)} vào đơn giá (bỏ chọn: ghi thành 2 dòng riêng)</span></label>
    <label class="row" style="gap:6px"><span class="lbl">Hợp đồng chính</span><select id="hs_hd" ${ed?'':'disabled'}>${['HD01','HD02','HD03','HD04'].map(h=>`<option value="${h}" ${D.hd===h?'selected':''}>${h} ${TPL[h].name}</option>`).join('')}</select></label></div>
   ${S.hs.err?`<div class="banner bad">${esc(S.hs.err)}</div>`:''}${S.hs.busy?`<div class="sm muted">${esc(S.hs.busy)}…</div>`:''}
  </div>
  ${(tpl.grp==='Hợp đồng'||tpl.kind==='xlsx'&&tpl.pay)?payEditor(e,tpl.pay||tpl.id,C):''}
  ${tpl.kind==='docx'?docxFields(e,tpl):xlsxPanel(e,tpl,C)}
  ${commonPanel(e,C)}
 </div></div>`;}
function payEditor(e,hd,C){const rows=payOf(e,hd);const ed=hsEdit();const tot=rows.reduce((a,x)=>a+x.pct,0);const amts=payAmts(rows,C.M.total);
 return `<div class="panel stack"><div class="row sb"><h3>Tiến độ thanh toán (${hd})</h3><span class="sm ${Math.abs(tot-100)>1e-6?'':'muted'}" style="${Math.abs(tot-100)>1e-6?'color:var(--bad)':''}">Cộng ${tot.toLocaleString('vi-VN')}%</span></div>
 <div class="tw"><table><thead><tr><th>Đợt</th><th>Điều kiện thanh toán</th><th class="n">Tỷ lệ %</th><th class="n">Số tiền</th></tr></thead><tbody>
 ${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${ed?`<input data-pay="${hd}" data-i="${i}" data-k="dk" value="${esc(r.dk)}" style="width:100%">`:esc(r.dk)}</td><td class="n">${ed?`<input type="number" step="1" min="0" data-pay="${hd}" data-i="${i}" data-k="pct" value="${r.pct}" style="width:70px">`:r.pct}</td><td class="n">${money(amts[i])}</td></tr>`).join('')}
 </tbody></table></div>${ed?`<div class="row"><button class="b sm" data-act="pay_add" data-v="${hd}">+ Thêm đợt</button><button class="b sm ghost" data-act="pay_del" data-v="${hd}" ${rows.length>1?'':'disabled'}>Bớt đợt cuối</button><button class="b sm ghost" data-act="pay_reset" data-v="${hd}">Về mặc định</button></div><div class="sm muted">Bảng trong mẫu Word có số dòng cố định; đợt vượt quá số dòng của mẫu sẽ không hiện.</div>`:''}</div>`;}
function docxFields(e,tpl){const V=S.hs.view;if(!V)return `<div class="panel sm muted">${S.hs.busy?'Đang đọc mẫu…':'Đang chuẩn bị…'}</div>`;const ed=hsEdit();
 const res=V.res;const seen=new Set();const uniq=res.filter(r=>{if(seen.has(r.sem))return false;seen.add(r.sem);return true;});
 const party=uniq.filter(r=>r.party||r.company);const params=uniq.filter(r=>r.param);const checks=uniq.filter(r=>r.check);const calc=uniq.filter(r=>r.calc);const rest=uniq.filter(r=>!r.party&&!r.company&&!r.param&&!r.check&&!r.calc);
 const filled=res.filter(r=>r.val!==''&&r.val!=null&&!(r.check)).length,tot=res.filter(r=>!r.check).length;
 const inp=r=>{const id='hs_'+btoa(unescape(encodeURIComponent(r.sem))).replace(/[^a-zA-Z0-9]/g,'');const v=r.val??'';
  if(r.check)return `<label class="ck"><input type="checkbox" id="${id}" data-sem="${esc(r.sem)}" data-check="1" ${v===true||v==='true'?'checked':''} ${ed?'':'disabled'}><span>${esc(r.label)}</span></label>`;
  return `<label class="f"><span class="lbl">${esc(r.label)}</span><input id="${id}" data-sem="${esc(r.sem)}" ${r.company?'data-co="1"':''} ${r.date?'type="date"':r.time?'type="time"':''} value="${esc(v)}" ${ed?'':'disabled'} placeholder="${r.free?'để trống: giữ dấu chấm trong mẫu':''}"></label>`;};
 return `<div class="panel stack"><div class="row sb"><h3>Nội dung sẽ điền</h3><span class="sm muted">${filled}/${tot} chỗ trống đã có giá trị</span></div>
  ${rest.length?`<div><div class="lbl" style="margin-bottom:6px">Số, ngày và thông tin riêng của văn bản</div><div class="grid g2">${rest.map(inp).join('')}</div></div>`:''}
  ${party.length?`<div><div class="lbl" style="margin-bottom:6px">Các bên (dùng chung cho mọi hồ sơ của dự án; thông tin CENOVA dùng chung cho mọi dự án)</div><div class="grid g2">${party.map(inp).join('')}</div></div>`:''}
  ${params.length?`<details ${hsOpen('hs_params')}><summary class="sm">Thông số điều khoản (${params.length}) · mặc định đề xuất, cần duyệt</summary><div class="grid g2" style="margin-top:8px">${params.map(inp).join('')}</div></details>`:''}
  ${checks.length?`<div><div class="lbl" style="margin-bottom:6px">Ô đánh dấu ☐ / ☒</div><div class="grid g2">${checks.map(inp).join('')}</div></div>`:''}
  ${calc.length?`<details ${hsOpen('hs_calc')}><summary class="sm">Giá trị tự tính từ dự toán (${calc.length})</summary><div class="tw" style="margin-top:8px"><table><tbody>${calc.map(r=>`<tr><td class="sm">${esc(r.label)}</td><td class="n">${esc(r.val)}</td></tr>`).join('')}</tbody></table></div></details>`:''}
  <details ${hsOpen('hs_prevd')}><summary class="sm">Xem trước văn bản đã điền</summary><div class="docprev">${docPreview(V)}</div></details></div>`;}
function docPreview(V){const map=new Map(V.res.map(r=>[r.f,r]));const P=blk=>{const t=blk.info.text;let out='',last=0;
  blk.toks.forEach(f=>{const r=map.get(f);out+=esc(t.slice(last,f.tok.start));const raw=t.slice(f.tok.start,f.tok.end);let v=r?.val;
   if(r&&r.check)out+=(v===true||v==='true')?'☒':'☐';else if(v==null||v==='')out+=`<span class="miss">${esc(raw)}</span>`;
   else if(/date/.test(f.type)){const [y,m,d]=String(v).split('-');out+=`<mark>${f.type==='datew'?`ngày ${d} tháng ${m} năm ${y}`:f.type==='date2'?`${d}/${m}`:`${d}/${m}/${y}`}</mark>`;}
   else if(f.type==='time'){const [h,mi]=String(v).split(':');out+=`<mark>${esc(h)}h${esc(mi||'00')}</mark>`;}else out+=`<mark>${esc(v)}</mark>`;last=f.tok.end;});
  out+=esc(t.slice(last));return out?`<p>${out}</p>`:'';};
 return V.parsed.blocks.map(b=>b.type==='p'?P(b):`<table>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${c.paras.map(P).join('')}${c.f&&map.get(c.f)?.val?`<mark>${esc(map.get(c.f).val)}</mark>`:''}</td>`).join('')}</tr>`).join('')}</table>`).join('');}
function xlsxPanel(e,tpl,C){const M=C.M;const ed=hsEdit();const so=C.g('so.'+tpl.id)||'';
 const byL={};M.lines.forEach(L=>{const k=L.code.slice(0,4);byL[k]=(byL[k]||0)+L.amt;});
 return `<div class="panel stack"><h3>Nội dung sẽ điền vào file Excel</h3>
  <div class="grid g2"><label class="f"><span class="lbl">Số ${tpl.id}</span><input data-sem="so.${tpl.id}" value="${esc(so)}" ${ed?'':'disabled'} placeholder="ví dụ 015"></label><label class="f"><span class="lbl">Ngày lập</span><input type="date" data-sem="d.lap:${tpl.id}" value="${esc(C.g('d.lap:'+tpl.id)||today())}" ${ed?'':'disabled'}></label></div>
  <div class="sm muted">Thông tin khách hàng, công trình, người báo giá lấy từ dự án và mục “Các bên” bên dưới. Đơn giá ${C.D.alloc?'đã gồm':'chưa gồm'} quản lý và dự phòng; chiết khấu ${pct(M.ckPct)}; ${vatLabel(M.vatPct)}. File Excel tự tính lại công thức khi mở bằng Excel hoặc Google Sheets.</div>
  <div class="tw"><table><thead><tr><th>Nhóm</th><th class="n">Số dòng</th><th class="n">Thành tiền</th></tr></thead><tbody>${Object.entries(byL).sort().map(([k,v])=>`<tr><td><span class="code">${k}</span> ${GROUPS[k]||(k==='9-99'?'Quản lý, dự phòng':'')}</td><td class="n">${M.lines.filter(L=>L.code.startsWith(k)).length}</td><td class="n">${money(v)}</td></tr>`).join('')}
   <tr><td><b>Cộng trước thuế</b></td><td></td><td class="n"><b>${money(M.pre)}</b></td></tr></tbody></table></div>
  ${tpl.id==='NT01'?'<div class="sm muted">Khối lượng thực tế nghiệm thu điền sẵn bằng khối lượng hợp đồng; sửa trong file khi quyết toán. Sheet PHÁT SINH để trống.</div>':''}
  ${tpl.id==='BG01'?'<div class="sm muted">Sheet BG TRON GOI chỉ điền thông tin khách hàng, đã xóa đơn giá mẫu.</div>':''}</div>`;}
function commonPanel(e,C){const ed=hsEdit();const V=C.V;const co={...COMPANY0,...S.company};
 const f=(sem,label,v,type,co1)=>`<label class="f"><span class="lbl">${label}</span><input data-sem="${sem}" ${co1?'data-co="1"':''} ${type?`type="${type}"`:''} value="${esc(v??'')}" ${ed&&(!co1||coAdmin())?'':'disabled'}></label>`;
 return `<details class="panel" ${hsOpen('hs_common')}><summary>Thông tin chung của dự án và CENOVA</summary><div class="stack" style="margin-top:10px">
  <div class="lbl">Bên A (chủ đầu tư)</div><div class="grid g2">${[['ten','Tên / đơn vị',e.khach],['cccd','CCCD / MST'],['ngaycap','Ngày cấp'],['noicap','Nơi cấp'],['diachi','Địa chỉ',e.diachi],['dt','Điện thoại'],['email','Email'],['daidien','Người đại diện'],['chucvu','Chức vụ']].map(([k,l,d])=>f('A.'+k,l,V['A.'+k]??d??'')).join('')}</div>
  <div class="lbl">CENOVA (lưu cho mọi dự án)</div><div class="grid g2">${[['daidien','Người đại diện'],['chucvu','Chức vụ'],['stk','Số tài khoản'],['nganhang','Ngân hàng'],['kythuat','Cán bộ kỹ thuật / giám sát'],['nguoibg','Người báo giá'],['noiky','Nơi ký hợp đồng']].map(([k,l])=>f('co.'+k,l,co[k],'',1)).join('')}</div>
  <div class="lbl">Số văn bản</div><div class="grid g2">${TPLS.map(t=>f('so.'+t.id,`Số ${t.id}`,V['so.'+t.id]||'')).join('')}</div>
  <div class="lbl">Mốc ngày</div><div class="grid g2">${f('d.ky','Ngày ký hợp đồng',C.ky,'date')}${f('d.kc','Ngày khởi công',C.kc,'date')}${f('d.nt','Ngày nghiệm thu',C.ntd,'date')}${f('d.bg','Ngày bàn giao',C.bg,'date')}${f('p.tc_days','Thời gian thi công (ngày)',C.tcDays,'number')}</div>
  <details ${hsOpen('hs_cparams')}><summary class="sm">Thông số điều khoản mặc định</summary><div class="grid g2" style="margin-top:8px">${Object.keys(PARAM0).map(k=>f('p.'+k,PARAM_LABEL[k],C.P(k))).join('')}</div></details>
  <div class="sm muted">Các mức phạt, lãi chậm trả, bảo hành là đề xuất mặc định để điền nhanh, không phải tư vấn pháp lý. Hãy để người phụ trách pháp chế duyệt trước khi ký.</div>
 </div></details>`;}
/* sự kiện */
async function hsDownload(){const e=curProj();if(!e)return;const tpl=TPL[S.hs.sel];S.hs.busy='Đang tạo file '+tpl.id;render();
 try{const blob=tpl.kind==='docx'?await buildDocx(tpl,e):await buildXlsx(tpl,e);const so=docCtx(e,tpl).g('so.'+tpl.id);
  await downloadFile(`${tpl.file.split('/').pop().replace(/\.(docx|xlsx)$/,'')}_${e.ma}${so?'_'+so:''}.${tpl.kind}`,blob);}
 catch(err){toast('Không tạo được file: '+(err.message||err));console.error(err);}S.hs.busy='';render();}
let coT=null;
document.addEventListener('change',ev=>{const t=ev.target;if(S.tab!=='hoso')return;const e=curProj();if(!e)return;const D=docsOf(e);
 if(t.id==='hs_alloc'){D.alloc=t.checked;saveSoon(e);return render();}
 if(t.id==='hs_hd'){D.hd=t.value;saveSoon(e);return render();}
 if(t.id==='hs_prevd'){S.hs.prev=t.open;return;}
 if(t.dataset.pay){const hd=t.dataset.pay;const rows=payOf(e,hd).map(r=>({...r}));rows[+t.dataset.i][t.dataset.k]=t.dataset.k==='pct'?(+t.value||0):t.value;D.pay[hd]=rows;saveSoon(e);return render();}
 if(t.dataset.sem){const sem=t.dataset.sem;const val=t.dataset.check?t.checked:t.value;
  if(t.dataset.co){if(!coAdmin())return;const k=sem.slice(3);S.company={...S.company,[k]:val};clearTimeout(coT);coT=setTimeout(()=>store.set('settings/company',S.company),400);return render();}
  if(val===''&&!t.dataset.check)delete D.v[sem];else D.v[sem]=val;saveSoon(e);return render();}});
document.addEventListener('toggle',ev=>{const id=ev.target.id||'';if(id.startsWith('hs_'))S.hs.open[id]=ev.target.open;},true);
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b||S.tab!=='hoso')return;const a=b.dataset.act;const e=curProj();
 if(a==='hs_sel'){S.hs.sel=b.dataset.v;S.hs.view=null;S.hs.viewKey=null;render();}
 else if(a==='hs_dl')hsDownload();else if(a==='hs_pdf')hsPdf();
 else if(e&&a.startsWith('pay_')){const D=docsOf(e);const hd=b.dataset.v;let rows=payOf(e,hd).map(r=>({...r}));
  if(a==='pay_add')rows.push({dk:'',pct:0});else if(a==='pay_del')rows.pop();else rows=PAY0[hd].map(r=>({dk:r[0],pct:r[1]}));
  if(a==='pay_reset')delete D.pay[hd];else D.pay[hd]=rows;saveSoon(e);render();}});

/* ===================== XUẤT PDF / EXCEL DÙNG CHUNG ===================== */
let pdfmkReady=null,PDF_FONTS=null,PDF_VFS=null,LOGO_URI='';
const b64OfBuf=buf=>{const b=new Uint8Array(buf);let s='';for(let i=0;i<b.length;i+=0x8000)s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));return btoa(s);};
function ensurePdfMake(){if(!pdfmkReady)pdfmkReady=(async()=>{
 await loadScript('https://cdn.jsdelivr.net/npm/pdfmake@0.2.7/build/pdfmake.min.js');
 const get=async p=>{const r=await fetch(p);if(!r.ok)throw new Error('Không tải được '+p);return r.arrayBuffer();};
 PDF_VFS={};for(const f of ['Cenova-Regular.ttf','Cenova-Bold.ttf','Cenova-Italic.ttf','Cenova-BoldItalic.ttf','Cenova-Sym.ttf'])PDF_VFS[f]=b64OfBuf(await get('assets/'+f));
 PDF_FONTS={Cenova:{normal:'Cenova-Regular.ttf',bold:'Cenova-Bold.ttf',italics:'Cenova-Italic.ttf',bolditalics:'Cenova-BoldItalic.ttf'},Sym:{normal:'Cenova-Sym.ttf',bold:'Cenova-Sym.ttf',italics:'Cenova-Sym.ttf',bolditalics:'Cenova-Sym.ttf'}};
 LOGO_URI='data:image/png;base64,'+b64OfBuf(await get('assets/logo.png'));})().catch(e=>{pdfmkReady=null;throw e;});return pdfmkReady;}
function pdfBlob(dd){return new Promise((ok,no)=>{try{pdfMake.createPdf(dd,null,PDF_FONTS,PDF_VFS).getBlob(ok);}catch(e){no(e);}});}
/* chữ có ☐ ☒ dùng font ký hiệu */
function ptx(s,st={}){s=String(s??'');if(!/[☐☒─⌈⌉]/.test(s))return {text:s,...st};return {text:s.split(/([☐☒─⌈⌉]+)/).filter(x=>x!=='').map(x=>/[☐☒─⌈⌉]/.test(x)?{text:x,font:'Sym'}:{text:x}),...st};}
const C_INK='#1b1b1b',C_MUTE='#6b6560',C_RULE='#d9d4cc',C_FILL='#eef2f1',C_ACC='#0d6b5f';
const LAY_LIGHT={hLineWidth:(i,n)=>i===0||i===n.table.body.length?0.8:0.4,vLineWidth:()=>0,hLineColor:i=>C_RULE,paddingLeft:()=>4,paddingRight:()=>4,paddingTop:()=>3,paddingBottom:()=>3};
function pdfFrame({orient,docTitle}={}){return {info:{title:docTitle||'CENOVA',author:'CENOVA Design & Build'},pageSize:'A4',pageOrientation:orient||'portrait',pageMargins:[36,80,36,48],
 defaultStyle:{font:'Cenova',fontSize:9,lineHeight:1.2,color:C_INK},
 header:()=>({margin:[36,22,36,0],columns:[{image:LOGO_URI,width:118},{width:'*',stack:[{text:'DESIGN  ·  BUILD  ·  INTERIOR',fontSize:6.5,color:C_MUTE,alignment:'right',characterSpacing:1},{text:'Hotline 0888 766 066',bold:true,fontSize:8.5,alignment:'right',margin:[0,2,0,0]},{text:'cenova.designbuild@gmail.com',fontSize:7,color:C_MUTE,alignment:'right'}]}]}),
 footer:(cur,tot)=>({margin:[36,16,36,0],columns:[{text:'CENOVA — Design & Build   ·   Hotline 0888 766 066   ·   cenova.designbuild@gmail.com',fontSize:6.5,color:C_MUTE},{text:`Trang ${cur} / ${tot}`,alignment:'right',fontSize:6.5,color:C_MUTE,width:70}]}),
 content:[]};}
function pdfTitle(title,sub,right){return {margin:[0,0,0,10],columns:[{width:'*',stack:[{text:title,fontSize:15,bold:true},sub?{text:sub,fontSize:8,italics:true,color:C_MUTE,margin:[0,2,0,0]}:''].filter(Boolean)},right?{width:170,table:{widths:[46,'*'],body:right.map(([k,v])=>[{text:k,fontSize:7.5,color:C_MUTE},{text:v||'',fontSize:8.5,bold:true,alignment:'right'}])},layout:'noBorders'}:{text:'',width:1}]};}
function pdfInfo(pairs,cols=2){const rows=[];for(let i=0;i<pairs.length;i+=cols){const r=[];for(let k=0;k<cols;k++){const p=pairs[i+k]||['',''];r.push({text:p[0],fontSize:7.5,color:C_MUTE},{text:String(p[1]??''),fontSize:8.5});}rows.push(r);}
 return {margin:[0,0,0,10],table:{widths:Array(cols).fill(['auto','*']).flat(),body:rows},layout:{...LAY_LIGHT,hLineWidth:()=>0.3}};}
function pdfSection(t){return {text:t,bold:true,fontSize:9.5,margin:[0,8,0,4],color:C_ACC};}
/* bảng: head = [{t, w, a}] ; rows = mảng các mảng giá trị hoặc {row, style} */
function pdfGrid(head,rows,opts={}){const body=[head.map(h=>({text:h.t,bold:true,fontSize:7.5,color:'#46524f',fillColor:C_FILL,alignment:h.a||'left'}))];
 rows.forEach(r=>{const st=r&&r.style||{};const cells=(r&&r.row)||r;if(st.group){body.push([{text:cells[0],colSpan:head.length,bold:true,fillColor:'#f6f4f0',fontSize:8.5},...Array(head.length-1).fill({})]);return;}
  body.push(cells.map((v,i)=>{const h=head[i]||{};const isN=h.a==='right';return {...ptx(v==null?'':(isN&&typeof v==='number'?fmt(v):String(v))),alignment:h.a||'left',fontSize:h.fs||8,bold:!!st.bold,fillColor:st.fill||undefined,noWrap:!!h.nw};}));});
 return {table:{headerRows:1,widths:head.map(h=>h.w||'auto'),body,dontBreakRows:true},layout:LAY_LIGHT,margin:[0,0,0,opts.mb??8]};}
function pdfTotals(pairs){return {margin:[0,4,0,8],columns:[{width:'*',text:''},{width:250,table:{widths:['*','auto'],body:pairs.map(([k,v,b])=>[{text:k,bold:!!b,fontSize:b?9.5:8.5},{text:typeof v==='number'?fmt(v):v,alignment:'right',bold:!!b,fontSize:b?10:8.5}])},layout:LAY_LIGHT}]};}
function pdfSign(a='ĐẠI DIỆN KHÁCH HÀNG',b='ĐẠI DIỆN CENOVA'){return {margin:[0,24,0,0],unbreakable:true,columns:[{stack:[{text:a,bold:true,alignment:'center'},{text:'(Ký, ghi rõ họ tên)',italics:true,fontSize:7.5,alignment:'center',color:C_MUTE}]},{stack:[{text:b,bold:true,alignment:'center'},{text:'(Ký, đóng dấu, ghi rõ họ tên)',italics:true,fontSize:7.5,alignment:'center',color:C_MUTE}]}]};}
async function savePdf(dd,filename){await ensurePdfMake();const blob=await pdfBlob(dd);await downloadFile(filename,blob);}
async function runExport(label,fn){toast('Đang tạo '+label+'…');try{await fn();}catch(err){console.error(err);toast('Không tạo được '+label+': '+(err.message||err));}}
/* Excel nhanh từ bảng (SheetJS) */
function xlsxBook(sheets){if(!window.XLSX)throw new Error('Thư viện Excel chưa tải xong, thử lại sau vài giây');const wb=XLSX.utils.book_new();
 sheets.forEach(s=>{const aoa=[...(s.top||[]),...(s.top?[[]]:[]),s.head,...s.rows];const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!cols']=(s.widths||s.head.map(h=>({wch:Math.max(10,String(h).length+2)})));XLSX.utils.book_append_sheet(wb,ws,s.name.slice(0,31));});
 return new Blob([XLSX.write(wb,{type:'array',bookType:'xlsx'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});}
const fileStamp=()=>today().replace(/-/g,'');

/* ---------- WORD → PDF (giữ bố cục mẫu: cỡ chữ, đậm, căn lề, bảng, nền ô) ---------- */
async function docxToPdf(blob,title){await ensurePdfMake();const zip=await JSZip.loadAsync(blob);const xml=await zip.file('word/document.xml').async('string');const doc=new DOMParser().parseFromString(xml,'application/xml');
 const body=doc.getElementsByTagNameNS(WNS,'body')[0];const A=(el,n)=>el?(el.getAttribute('w:'+n)??el.getAttributeNS(WNS,n)):null;const ch=(el,n)=>el?[...el.childNodes].find(x=>x.nodeType===1&&x.localName===n):null;
 const sect=body.getElementsByTagNameNS(WNS,'sectPr')[0];const pgSz=ch(sect,'pgSz'),pgMar=ch(sect,'pgMar');const pageW=(+A(pgSz,'w')||11906)/20;const mL=(+A(pgMar,'left')||1134)/20,mR=(+A(pgMar,'right')||1134)/20;const avail=pageW-Math.max(mL,36)-Math.max(mR,36);
 const runs=p=>{const out=[];[...p.childNodes].forEach(n=>{if(n.nodeType!==1)return;const list=n.localName==='r'?[n]:(n.localName==='hyperlink'||n.localName==='ins'?[...n.childNodes].filter(x=>x.localName==='r'):[]);
  list.forEach(r=>{const rp=ch(r,'rPr');const st={};if(rp){if(ch(rp,'b')&&A(ch(rp,'b'),'val')!=='false'&&A(ch(rp,'b'),'val')!=='0')st.bold=true;if(ch(rp,'i')&&A(ch(rp,'i'),'val')!=='false')st.italics=true;const sz=ch(rp,'sz');if(sz)st.fontSize=(+A(sz,'val'))/2;const c=ch(rp,'color');if(c&&A(c,'val')&&A(c,'val')!=='auto')st.color='#'+A(c,'val');if(ch(rp,'caps'))st.caps=true;const u=ch(rp,'u');if(u&&A(u,'val')!=='none')st.decoration='underline';const sp=ch(rp,'spacing');if(sp)st.characterSpacing=(+A(sp,'val')||0)/20;}
   [...r.childNodes].forEach(x=>{if(x.nodeType!==1)return;let t=null;if(x.localName==='t')t=x.textContent;else if(x.localName==='tab')t='    ';else if(x.localName==='br')t='\n';if(t==null)return;if(st.caps)t=t.toUpperCase();
    const o=ptx(t,{...st});delete o.caps;out.push(o);});});});return out;};
 const para=(p,inCell)=>{const pp=ch(p,'pPr');const jc=A(ch(pp,'jc'),'val');const sp=ch(pp,'spacing');const ind=ch(pp,'ind');const num=ch(pp,'numPr');
  let r=runs(p);if(num)r=[{text:'–  '},...r];const empty=!r.some(x=>(typeof x.text==='string'?x.text:'').trim()||Array.isArray(x.text));
  const o={text:r.length?r:' ',alignment:jc==='center'?'center':jc==='right'||jc==='end'?'right':jc==='both'?'justify':'left',
   margin:[ind?(+A(ind,'left')||+A(ind,'start')||0)/20:0,sp?Math.min(14,(+A(sp,'before')||0)/20):0,0,sp?Math.min(12,(+A(sp,'after')||0)/20):(inCell?0:3)]};
  if(empty&&inCell)o.text=' ';return o;};
 const table=t=>{const grid=[...t.getElementsByTagNameNS(WNS,'gridCol')].map(g=>(+A(g,'w')||1000)/20);const tot=grid.reduce((a,b)=>a+b,0)||1;const k=Math.min(1,avail/tot);const widths=grid.map(w=>w*k-8);
  const rows=[...t.childNodes].filter(x=>x.localName==='tr').map(tr=>{const cells=[];[...tr.childNodes].filter(x=>x.localName==='tc').forEach(tc=>{const tp=ch(tc,'tcPr');const span=+(A(ch(tp,'gridSpan'),'val')||1);const shd=ch(tp,'shd');const fill=shd&&A(shd,'fill')&&!/auto|FFFFFF/i.test(A(shd,'fill'))?'#'+A(shd,'fill'):undefined;
   const stack=[...tc.childNodes].filter(x=>x.localName==='p'||x.localName==='tbl').map(x=>x.localName==='p'?para(x,true):table(x));const c={stack,fillColor:fill};if(span>1)c.colSpan=span;cells.push(c);for(let s=1;s<span;s++)cells.push({});});
   while(cells.length<grid.length)cells.push({text:''});return cells.slice(0,grid.length);});
  return {table:{widths,body:rows,dontBreakRows:true},layout:{...LAY_LIGHT,paddingTop:()=>2,paddingBottom:()=>2},margin:[0,2,0,6]};};
 const content=[];[...body.childNodes].forEach(el=>{if(el.nodeType!==1)return;if(el.localName==='p'){if([...el.getElementsByTagNameNS(WNS,'br')].some(b=>A(b,'type')==='page'))content.push({text:'',pageBreak:'after'});content.push(para(el,false));}else if(el.localName==='tbl')content.push(table(el));});
 const dd=pdfFrame({docTitle:title});dd.content=content;return pdfBlob(dd);}

/* ---------- BÁO GIÁ / QUYẾT TOÁN EXCEL → PDF (cùng số liệu, cùng nhóm với file Excel) ---------- */
async function bgTerms(tpl,C){try{const X=await openXlsx(tpl.id);const sh=Object.keys(X.sheets)[0];const out=[];let on=false;
 for(let r=30;r<=80;r++){const a=xGet(X,sh,'A'+r),b=xGet(X,sh,'B'+r);if(/ĐIỀU KHOẢN|^GHI CHÚ$/.test(a)){on=true;continue;}if(!on)continue;if(/ĐẠI DIỆN/.test(a))break;
  if(b){const v=/Thời gian thi công/.test(b)?C.tcDays:/sản xuất & lắp đặt/.test(b)?C.P('nt_days'):/Bảo hành nội thất/.test(b)?C.P('bh_nt'):/Bảo hành công trình/.test(b)?C.P('bh_xd'):/hiệu lực/.test(b)?C.P('hl'):/bản in/.test(b)?C.P('ban_in'):null;out.push(v!=null?b.replace(/…{2,}/,v):b);}}return out;}catch(e){return [];}}
function bgGroups(tpl,M){const L=M.lines;const NC=/^nhân công|công lắp|lắp đặt|^lắp /i;
 if(tpl.id==='BG02'){const B=[['I','CÔNG TÁC CHUẨN BỊ & PHÁ DỠ'],['II','PHẦN THÔ'],['III','PHẦN HOÀN THIỆN'],['IV','ĐIỆN – NƯỚC (MEP)'],['V','CÔNG TÁC KHÁC']].map(([n,t])=>({n,t,lines:[]}));
  L.forEach(x=>{const c=x.code;const i=/^1-(00|01)|^9-03/.test(c)&&!/vệ sinh/i.test(x.name)?0:/^1-(02|03|11|12)/.test(c)?1:/^1-/.test(c)?2:c[0]==='2'?3:4;B[i].lines.push(x);});return B;}
 if(tpl.id==='BG03')return [['A','NỘI THẤT LIÊN TƯỜNG',/^3-0[127]|^3-00/],['B','ĐỒ RỜI, GIƯỜNG, GHẾ, ĐỒ INOX',/^3-0[345]/],['C','THIẾT BỊ CHUYÊN DỤNG',/^3-06/]].map(([n,t,re])=>({n,t,lines:L.filter(x=>re.test(x.code))}));
 if(tpl.id==='BG01'){const arch=x=>/kiến trúc|kết cấu|M&E|MEP|PCCC|cơ điện/i.test(x.name);return [{n:'A',t:'THIẾT KẾ KIẾN TRÚC – KỸ THUẬT',lines:L.filter(arch)},{n:'B',t:'THIẾT KẾ NỘI THẤT',lines:L.filter(x=>!arch(x)&&/nội thất/i.test(x.name))},{n:'C',t:'DỊCH VỤ KÈM THEO',lines:L.filter(x=>!arch(x)&&!/nội thất/i.test(x.name))}];}
 return [{n:'I',t:'PHẦN THI CÔNG',lines:L.filter(x=>x.code[0]!=='3')},{n:'II',t:'PHẦN NỘI THẤT',lines:L.filter(x=>x.code[0]==='3')}];}
async function bgPdf(tpl,e){await ensurePdfMake();const C=docCtx(e,tpl);const M=C.M;const H=hdrInfo(C);const so=C.g('so.'+tpl.id)||'____';const dnow=dvn(C.g('d.lap:'+tpl.id)||today());
 const T={BG01:['BÁO GIÁ THIẾT KẾ','Design fee proposal — tính theo diện tích sàn thiết kế','BG-TK'],BG02:['BÁO GIÁ THI CÔNG','Construction quotation — xây dựng, cải tạo & hoàn thiện','BG-TC'],BG03:['BÁO GIÁ NỘI THẤT','Interior quotation — nội thất liên tường, đồ rời & phụ kiện','BG-NT'],NT01:['BẢNG QUYẾT TOÁN','Final account — giá trị quyết toán theo hợp đồng','QT']}[tpl.id];
 const dd=pdfFrame({docTitle:`${T[0]} ${H.ct}`});const c=dd.content;
 c.push(pdfTitle(T[0],T[1],[['Số:',`${T[2]}-${so}/2026`],['Ngày:',dnow]]));
 if(tpl.id==='NT01')c.push(pdfInfo([['Hợp đồng số',C.hdNo],['Chủ đầu tư',H.kh],['Công trình',H.ct],['Địa chỉ',H.dc]]));
 else c.push(pdfInfo([['Khách hàng',H.kh],['Công trình',H.ct],['Người liên hệ',H.lh],['Địa chỉ',H.dc],['Điện thoại',H.dt],['Diện tích / quy mô',H.qm],['Email',H.em],['Người báo giá',H.nbg]]));
 const G=bgGroups(tpl,M);let stt=0;
 const head=tpl.id==='NT01'?[{t:'STT',w:20,a:'center'},{t:'HẠNG MỤC',w:'*'},{t:'ĐVT',w:30},{t:'KL HĐ',w:38,a:'right'},{t:'ĐƠN GIÁ',w:56,a:'right'},{t:'THÀNH TIỀN HĐ',w:64,a:'right'},{t:'KL THỰC TẾ',w:42,a:'right'},{t:'THÀNH TIỀN TT',w:64,a:'right'}]
  :[{t:'STT',w:20,a:'center'},{t:'HẠNG MỤC',w:'*'},{t:tpl.id==='BG03'?'MÔ TẢ / VẬT LIỆU':'QUY CÁCH',w:110},{t:'ĐVT',w:30},{t:tpl.id==='BG01'?'DIỆN TÍCH':'KL',w:38,a:'right'},{t:'ĐƠN GIÁ',w:58,a:'right'},{t:'THÀNH TIỀN',w:66,a:'right'}];
 const rows=[];G.forEach(g=>{if(!g.lines.length)return;const sub=g.lines.reduce((a,x)=>a+x.amt,0);rows.push({row:[`${g.n}.  ${g.t}    —    ${fmt(sub)}`],style:{group:true}});
  g.lines.forEach(x=>{stt++;rows.push(tpl.id==='NT01'?[stt,x.name,x.unit,fmtq(x.qty),x.price,x.amt,fmtq(x.qty),x.amt]:[stt,x.name,x.spec||(x.cdt?'CĐT cấp, chỉ lắp đặt':''),x.unit,fmtq(x.qty),x.price,x.amt]);});});
 c.push(pdfGrid(head,rows));
 if(tpl.id==='NT01'){const ret=Math.round(M.total*(+C.P('ret')||0)/100);c.push(pdfTotals([['Giá trị hợp đồng (trước thuế)',M.net],['Giá trị quyết toán trước thuế',M.net],[`Thuế GTGT (${pct(M.vatPct)})`,M.vat],['GIÁ TRỊ QUYẾT TOÁN SAU THUẾ',M.total,1],[`Giữ lại bảo hành (${C.P('ret')}%)`,ret]]));
  c.push({text:'Phát sinh tăng/giảm và số đã tạm ứng ghi theo hồ sơ thanh toán thực tế (xem file Excel NT01).',italics:true,fontSize:8,color:C_MUTE});}
 else{c.push(pdfTotals([['Cộng giá trị trước thuế',M.pre],...(M.ck?[[`Chiết khấu (${pct(M.ckPct)})`,'−'+fmt(M.ck)],['Giá trị sau chiết khấu',M.net]]:[]),[`Thuế GTGT (${vatLabel(M.vatPct)})`,M.vat],['TỔNG GIÁ TRỊ THANH TOÁN (VNĐ)',M.total,1]]));
  c.push({text:[{text:'Bằng chữ: ',bold:true},{text:words(M.total)+'.',italics:true}],margin:[0,0,0,8]});
  const pa=payAmts(C.pay,M.total);c.push(pdfSection('TIẾN ĐỘ THANH TOÁN (dự kiến)'));c.push(pdfGrid([{t:'ĐỢT',w:34},{t:'ĐIỀU KIỆN THANH TOÁN',w:'*'},{t:'TỶ LỆ',w:40,a:'right'},{t:'SỐ TIỀN (VNĐ)',w:80,a:'right'}],C.pay.map((p,i)=>['Đợt '+(i+1),p.dk,p.pct+'%',pa[i]])));
  const terms=await bgTerms(tpl,C);if(terms.length){c.push(pdfSection('ĐIỀU KHOẢN & GHI CHÚ'));c.push({ol:terms.map(t=>({text:t,fontSize:8.5,margin:[0,0,0,2]}))});}}
 c.push(tpl.id==='NT01'?pdfSign('ĐẠI DIỆN CHỦ ĐẦU TƯ','ĐẠI DIỆN CENOVA'):pdfSign());return pdfBlob(dd);}
async function hsPdf(){const e=curProj();if(!e)return;const tpl=TPL[S.hs.sel];S.hs.busy='Đang tạo PDF '+tpl.id;render();
 try{await ensurePdfMake();const so=docCtx(e,tpl).g('so.'+tpl.id);const blob=tpl.kind==='docx'?await docxToPdf(await buildDocx(tpl,e),tpl.name):await bgPdf(tpl,e);
  await downloadFile(`${tpl.file.split('/').pop().replace(/\.(docx|xlsx)$/,'')}_${e.ma}${so?'_'+so:''}.pdf`,blob);}
 catch(err){console.error(err);toast('Không tạo được PDF: '+(err.message||err));}S.hs.busy='';render();}

/* ---------- XUẤT THEO TỪNG MÀN ---------- */
function linesTable(e,t,withCost){const head=[{t:'MÃ',w:44,nw:true,fs:7},{t:'HẠNG MỤC',w:'*'},{t:'ĐVT',w:30},{t:'KL',w:36,a:'right'},...(withCost?[{t:'GIÁ VỐN',w:52,a:'right'}]:[]),{t:'ĐƠN GIÁ',w:56,a:'right'},{t:'THÀNH TIỀN',w:66,a:'right'}];const rows=[];let last='';
 e.lines.filter(L=>L.on).forEach(L=>{const ly=L.code[0];if(ly!==last){rows.push({row:[`${ly}. ${LAYERS[ly]}    —    ${fmt(t.byL[ly]||0)}`],style:{group:true}});last=ly;}const pr=priceLine(L,e,t.K);rows.push([L.code,L.name+(L.cdt?' (CĐT cấp)':''),L.unit,fmtq(L.qty),...(withCost?[Math.round(L.cost)]:[]),pr.unit,pr.amt]);});return {head,rows};}
async function exportQuick(fmtType){const q=S.quick;const e=newEstimate(q);const t=totals(e);const sc=can.seeCost(S.role);const T=TEMPLATES[q.type];
 const info=[['Loại hình',T.label],['Diện tích',fmtq(q.S)+' m²'],['Điểm chuyên dụng',Object.entries(q.pts).filter(([,n])=>n).map(([k,n])=>`${POINTS[k].name} ${n}`).join(', ')||'—'],['Địa điểm',(KDD.find(x=>x.id===q.dd)||KDD[0]).label],['Thời gian thi công',T.weeks],['Bảng giá',`v${curVersion().no} · ${dvn(curVersion().date)}`]];
 const name=`DuToanNhanh_${slug(q.ten||T.label)}_${fileStamp()}`;
 if(fmtType==='xlsx')return downloadFile(name+'.xlsx',xlsxBook([{name:'Tóm tắt',top:[['DỰ TOÁN NHANH – '+(q.ten||T.label)],...info,['Giá chào đã VAT',t.total],['Dải thị trường',`${fmt(t.lo)} – ${fmt(t.hi)}`]],head:['Lớp','Giá trị trước QL, DP, VAT'],rows:[1,2,3,4,9].map(L=>[LAYERS[L],t.byL[L]||0])},
  {name:'Hạng mục',head:['Mã','Hạng mục','ĐVT','KL',...(sc?['Giá vốn']:[]),'Đơn giá chào','Thành tiền'],rows:e.lines.map(L=>{const pr=priceLine(L,e,t.K);return [L.code,L.name,L.unit,L.qty,...(sc?[L.cost]:[]),pr.unit,pr.amt];}),widths:[{wch:11},{wch:60},{wch:8},{wch:9},{wch:12},{wch:13},{wch:15}]}]));
 const dd=pdfFrame({docTitle:'Dự toán nhanh'});const c=dd.content;c.push(pdfTitle('DỰ TOÁN SƠ BỘ',(q.ten||T.label)+(q.khach?' · '+q.khach:''),[['Ngày:',dvn(today())]]));c.push(pdfInfo(info));
 c.push({columns:[{width:'*',stack:[{text:'GIÁ CHÀO DỰ KIẾN (ĐÃ VAT)',fontSize:7.5,color:C_MUTE},{text:fmt(t.total)+' đ',fontSize:18,bold:true},{text:`${fmt(t.total/q.S)} đ/m² · dải thị trường ${tr(t.lo)} – ${tr(t.hi)}`,fontSize:8,color:C_MUTE}]}],margin:[0,0,0,10]});
 c.push(pdfGrid([{t:'LỚP HẠNG MỤC',w:'*'},{t:'GIÁ TRỊ',w:90,a:'right'},{t:'TỶ TRỌNG',w:60,a:'right'}],[1,2,3,4,9].map(L=>[LAYERS[L],t.byL[L]||0,pct((t.byL[L]||0)/(t.direct||1))])));
 c.push(pdfTotals([['Chi phí trực tiếp',t.direct],[`Quản lý & giám sát (${pct(e.params.QL)})`,t.ql],[`Dự phòng (${pct(e.params.DP)})`,t.dp],[`VAT (${pct(e.params.VAT)})`,t.vat],['TỔNG ĐÃ VAT',t.total,1]]));
 const lg=legal(e);if(lg.length){c.push(pdfSection('LƯU Ý PHÁP LÝ & KỸ THUẬT'));c.push({ul:lg.map(w=>({text:w.t,fontSize:8.5}))});}
 const LT=linesTable(e,t,sc);c.push({text:'',pageBreak:'before'});c.push(pdfSection('DANH MỤC HẠNG MỤC DỰ KIẾN'));c.push(pdfGrid(LT.head,LT.rows));
 c.push({text:'Dự toán sơ bộ theo m² và số điểm, chưa phải báo giá chính thức. Giá trị sẽ chốt theo hồ sơ thiết kế và khảo sát.',italics:true,fontSize:8,color:C_MUTE});return savePdf(dd,name+'.pdf');}
async function exportQuote(fmtType,internal){const e=curProj();if(!e)return;const t=totals(e);const name=`${internal?'Khoan':'BaoGia'}_${e.ma}_${slug(e.ten)}`;
 if(fmtType==='xlsx')return dlXlsx(!!internal);
 const dd=pdfFrame({docTitle:(internal?'Bảng khoán ':'Báo giá ')+e.ma,orient:internal?'landscape':'portrait'});const c=dd.content;const p=e.params;
 c.push(pdfTitle(internal?'BẢNG KHOÁN NỘI BỘ – KHÔNG GỬI KHÁCH':'BÁO GIÁ THI CÔNG HOÀN THIỆN',`${e.ten} · ${TEMPLATES[e.type].label} · ${fmtq(e.S)} m²`,[['Số:',e.ma],['Ngày:',dvn(today())],['Hiệu lực:',`${p.HL} ngày`]]));
 c.push(pdfInfo([['Kính gửi',e.khach||'……………'],['Địa chỉ công trình',e.diachi||'……………'],['Thời gian thi công',TEMPLATES[e.type].weeks],['Bảng giá',`v${e.ver}`]]));
 if(internal){const head=[{t:'MÃ',w:44,fs:7},{t:'HẠNG MỤC',w:'*'},{t:'ĐVT',w:28},{t:'KL',w:34,a:'right'},{t:'GIÁ VỐN',w:52,a:'right'},{t:'BIÊN',w:30},{t:'K',w:30,a:'right'},{t:'ĐƠN GIÁ CHÀO',w:58,a:'right'},{t:'TIỀN CHÀO',w:66,a:'right'},{t:'TIỀN VỐN',w:66,a:'right'},{t:'LÃI',w:56,a:'right'}];
  const rows=[];let last='';e.lines.filter(L=>L.on).forEach(L=>{const ly=L.code[0];if(ly!==last){rows.push({row:[`${ly}. ${LAYERS[ly]}`],style:{group:true}});last=ly;}const pr=priceLine(L,e,t.K);rows.push([L.code,L.name+(L.cdt?' (CĐT cấp)':''),L.unit,fmtq(L.qty),Math.round(L.cost),L.bien,(pr.k||1).toLocaleString('vi-VN',{maximumFractionDigits:3}),pr.unit,pr.amt,pr.costAmt,pr.amt-pr.costAmt]);});
  c.push(pdfGrid(head,rows));c.push(pdfTotals([['Chi phí trực tiếp',t.direct],['Quản lý & giám sát',t.ql],['Dự phòng',t.dp],['Chiết khấu',t.ck?'−'+fmt(t.ck):'0'],['Trước VAT',t.pre,1],['Giá vốn',t.cost],[`Lãi gộp (${pct(t.mpct)})`,t.margin,1]]));return savePdf(dd,name+'.pdf');}
 const G=quoteGroups(e,t);const rows=[];let n=0;const roman=['I','II','III','IV','V'];let li=0;
 for(const L of [1,2,3,4,9]){if(!G[L])continue;rows.push({row:[`${roman[li++]}. ${LAYERS[L]}    —    ${fmt(t.byL[L]||0)}`],style:{group:true}});
  for(const [g,arr] of Object.entries(G[L])){if(S.qmode==='nhom'){rows.push([++n,GROUPS[g]||g,arr.length+' hạng mục','','',arr.reduce((a,x)=>a+x.amt,0)]);}else arr.forEach(x=>rows.push([++n,x.name+(x.cdt?' (CĐT cấp, chỉ tính lắp đặt)':''),x.unitName,fmtq(x.qty),x.unit,x.amt]));}}
 c.push(pdfGrid([{t:'STT',w:22,a:'center'},{t:S.qmode==='nhom'?'NHÓM HẠNG MỤC':'HẠNG MỤC',w:'*'},{t:S.qmode==='nhom'?'':'ĐVT',w:S.qmode==='nhom'?60:30},{t:S.qmode==='nhom'?'':'KL',w:36,a:'right'},{t:S.qmode==='nhom'?'':'ĐƠN GIÁ',w:58,a:'right'},{t:'THÀNH TIỀN',w:70,a:'right'}],rows));
 c.push(pdfTotals([['Chi phí trực tiếp',t.direct],[`Quản lý, giám sát (${pct(p.QL)})`,t.ql],[`Dự phòng phát sinh (${pct(p.DP)})`,t.dp],...(t.ck?[['Chiết khấu','−'+fmt(t.ck)]]:[]),['Cộng trước thuế',t.pre],[`Thuế GTGT (${pct(p.VAT)})`,t.vat],['TỔNG GIÁ TRỊ ĐÃ GỒM VAT',t.total,1]]));
 c.push({text:[{text:'Bằng chữ: ',bold:true},{text:words(t.total)+'.',italics:true}],margin:[0,0,0,8]});
 const off=e.lines.filter(L=>!L.on),cdt=e.lines.filter(L=>L.on&&L.cdt);c.push(pdfSection('PHẠM VI KHÔNG BAO GỒM'));c.push({ul:[...cdt.map(L=>L.name+': chủ đầu tư tự cấp, Cenova chỉ lắp đặt.'),...off.map(L=>L.name),'Phí fit-out, đặt cọc và phí ngoài giờ của ban quản lý tòa nhà (nếu có).','Thiết bị y tế, máy móc chuyên môn và vật tư tiêu hao không ghi trong bảng trên.'].map(x=>({text:x,fontSize:8.5}))});
 c.push(pdfSection('ĐIỀU KHOẢN'));c.push({ul:[`Báo giá có hiệu lực ${p.HL} ngày kể từ ngày lập.`,'Khối lượng theo hồ sơ thiết kế; phát sinh tính theo đơn giá trong báo giá này.','Bảo hành 12 tháng; giữ lại 5% giá trị hợp đồng trong thời gian bảo hành.'].map(x=>({text:x,fontSize:8.5}))});
 c.push(pdfSign('ĐẠI DIỆN KHÁCH HÀNG','ĐẠI DIỆN CENOVA D&B'));return savePdf(dd,name+'.pdf');}
async function exportAI(fmtType){const A=S.ai,R=A.res;if(!R)return;const name=`AI_BocKhoiLuong_${slug(A.ten||TEMPLATES[R.loai_hinh].label)}_${fileStamp()}`;
 const rows=R.lines.filter(x=>x.on).map(x=>[x.code,CAT[x.code]?.name||'',CAT[x.code]?.unit||'',x.kl,x.cach,x.tc,x.ng]);const ex=R.extra.filter(x=>x.on).map(x=>[`${x.lop}-00`,x.ten,x.dvt,x.kl,x.cach,x.tc,x.ng,x.cost||'']);
 const info=[['Loại hình',TEMPLATES[R.loai_hinh].label],['Diện tích',`${fmtq(R.dien_tich)} m² (${R.dien_tich_nguon||'AI'})`],['Tỷ lệ bản vẽ',R.ty_le||'—'],['Điểm',Object.entries(R.diem).map(([k,n])=>`${POINTS[k].name} ${n}`).join(', ')||'—'],['Ngày chạy',dvn(A.at||today())],['Hồ sơ đã gửi',(A.sent||[]).length+' ảnh/nguồn']];
 if(fmtType==='xlsx')return downloadFile(name+'.xlsx',xlsxBook([{name:'Khối lượng AI',top:[['KẾT QUẢ AI BÓC KHỐI LƯỢNG – BẢN NHÁP CẦN KIỂM TRA'],...info],head:['Mã','Hạng mục','ĐVT','KL','Cách tính','Tin cậy','Nguồn'],rows,widths:[{wch:11},{wch:55},{wch:8},{wch:10},{wch:60},{wch:12},{wch:12}]},
  {name:'Ngoài danh mục',head:['Lớp','Hạng mục','ĐVT','KL','Cách tính','Tin cậy','Nguồn','Giá vốn nhập tay'],rows:ex},{name:'Câu hỏi & hiện trạng',head:['Loại','Nội dung'],rows:[...R.q.map(x=>['Cần xác nhận',x]),...R.ht.map(x=>['Hiện trạng',x]),...R.khong_gian.map(k=>['Không gian',`${k.ten}${k.dt?' – '+fmtq(k.dt)+' m²':''}`])],widths:[{wch:16},{wch:100}]}]));
 const dd=pdfFrame({docTitle:'Kết quả AI bóc khối lượng',orient:'landscape'});const c=dd.content;c.push(pdfTitle('KẾT QUẢ AI BÓC KHỐI LƯỢNG','Bản nháp do AI đọc từ bản vẽ, phối cảnh và ảnh hiện trạng – kỹ sư dự toán kiểm tra trước khi dùng',[['Ngày:',dvn(A.at||today())]]));c.push(pdfInfo(info,3));
 if(R.tom)c.push({text:R.tom,margin:[0,0,0,6]});if(R.q.length){c.push(pdfSection('CẦN XÁC NHẬN TRƯỚC KHI CHỐT'));c.push({ul:R.q.map(x=>({text:x,fontSize:8.5}))});}if(R.ht.length){c.push(pdfSection('HIỆN TRẠNG'));c.push({ul:R.ht.map(x=>({text:x,fontSize:8.5}))});}
 c.push(pdfSection('KHỐI LƯỢNG TRONG BẢNG GIÁ'));c.push(pdfGrid([{t:'MÃ',w:48,fs:7},{t:'HẠNG MỤC',w:180},{t:'ĐVT',w:30},{t:'KL',w:40,a:'right'},{t:'CÁCH TÍNH',w:'*'},{t:'TIN CẬY',w:50},{t:'NGUỒN',w:50}],rows.map(r=>[r[0],r[1],r[2],fmtq(r[3]),r[4],r[5],r[6]])));
 if(ex.length){c.push(pdfSection('NGOÀI DANH MỤC (CẦN NHẬP GIÁ)'));c.push(pdfGrid([{t:'LỚP',w:30},{t:'HẠNG MỤC',w:180},{t:'ĐVT',w:30},{t:'KL',w:40,a:'right'},{t:'CÁCH TÍNH',w:'*'},{t:'TIN CẬY',w:50},{t:'GIÁ VỐN',w:60,a:'right'}],ex.map(r=>[r[0],r[1],r[2],fmtq(r[3]),r[4],r[5],r[7]?fmt(r[7]):''])));}
 return savePdf(dd,name+'.pdf');}
function costData(e){const t=totals(e);const ex=(S.expenses[e.id]?.rows)||[];const est={},act={};e.lines.forEach(L=>{if(!L.on)return;const g=L.code.slice(0,4);est[g]=(est[g]||0)+priceLine(L,e,t.K).costAmt;});ex.forEach(x=>{const g=x.code.slice(0,4);act[g]=(act[g]||0)+x.amount;});
 const groups=[...new Set([...Object.keys(est),...Object.keys(act)])].sort().map(g=>({g,name:GROUPS[g]||'',e:est[g]||0,a:act[g]||0}));return {t,ex,groups,actual:ex.reduce((s,x)=>s+x.amount,0)};}
async function exportCost(fmtType){const e=curProj();if(!e)return;const D=costData(e);const name=`ThucChi_${e.ma}_${fileStamp()}`;const info=[['Dự án',`${e.ma} · ${e.ten}`],['Khách hàng',e.khach],['Doanh thu trước VAT',fmt(D.t.pre)],['Giá vốn dự toán',fmt(D.t.cost)],['Thực chi đã nhập',fmt(D.actual)],['Lãi tạm tính',`${fmt(D.t.pre-D.actual)} (${pct((D.t.pre-D.actual)/(D.t.pre||1))})`]];
 const gr=D.groups.map(x=>[x.g,x.name,x.e,x.a,x.a-x.e,x.e?pct((x.a-x.e)/x.e):'ngoài DT']);const cr=D.ex.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(x=>[dvn(x.date),x.code,CAT[x.code]?.name||e.lines.find(l=>l.code===x.code)?.name||'',x.amount,x.doc,x.vendor]);
 if(fmtType==='xlsx')return downloadFile(name+'.xlsx',xlsxBook([{name:'Chênh lệch nhóm',top:[['THỰC CHI DỰ ÁN'],...info],head:['Nhóm','Tên nhóm','Vốn dự toán','Thực chi','Chênh','Chênh %'],rows:gr,widths:[{wch:8},{wch:40},{wch:15},{wch:15},{wch:15},{wch:10}]},{name:'Chứng từ',head:['Ngày','Mã','Hạng mục','Số tiền','Chứng từ','Nhà cung cấp'],rows:cr,widths:[{wch:11},{wch:11},{wch:50},{wch:15},{wch:20},{wch:25}]}]));
 const dd=pdfFrame({docTitle:'Thực chi '+e.ma});const c=dd.content;c.push(pdfTitle('BÁO CÁO THỰC CHI DỰ ÁN',e.ten,[['Mã:',e.ma],['Ngày:',dvn(today())]]));c.push(pdfInfo(info));
 c.push(pdfSection('CHÊNH LỆCH THEO NHÓM'));c.push(pdfGrid([{t:'NHÓM',w:34},{t:'TÊN NHÓM',w:'*'},{t:'VỐN DỰ TOÁN',w:70,a:'right'},{t:'THỰC CHI',w:70,a:'right'},{t:'CHÊNH',w:66,a:'right'},{t:'%',w:40,a:'right'}],gr.map(r=>({row:r,style:{fill:typeof r[5]==='string'&&parseFloat(String(r[5]).replace(',','.'))>10?'#fbe3e1':undefined}}))));
 c.push(pdfSection('CHỨNG TỪ ĐÃ NHẬP'));c.push(cr.length?pdfGrid([{t:'NGÀY',w:50},{t:'MÃ',w:46,fs:7},{t:'HẠNG MỤC',w:'*'},{t:'SỐ TIỀN',w:70,a:'right'},{t:'CHỨNG TỪ',w:70},{t:'NHÀ CUNG CẤP',w:80}],cr):{text:'Chưa có chứng từ.',italics:true,color:C_MUTE});return savePdf(dd,name+'.pdf');}
function reportData(){const ps=Object.values(S.projects).sort((a,b)=>a.created.localeCompare(b.created));return ps.map(p=>{const t=totals(p);const ex=(S.expenses[p.id]?.rows)||[];const a=ex.reduce((s,x)=>s+x.amount,0);return {p,t,a,has:ex.length>0,done:p.status==='quyettoan'&&ex.length>0};});}
async function exportReport(fmtType){const rows=reportData();const name=`BaoCaoBien_${fileStamp()}`;const by={};rows.forEach(x=>{const k=x.p.type;const b=by[k]=by[k]||{n:0,rev:0,cost:0,act:0,arev:0,m2:0};b.n++;b.rev+=x.t.pre;b.cost+=x.t.cost;b.m2+=x.p.S;if(x.done){b.act+=x.a;b.arev+=x.t.pre;}});
 const tr1=Object.entries(by).map(([k,b])=>[TEMPLATES[k].label,b.n,b.rev,Math.round(b.rev/(b.m2||1)),pct((b.rev-b.cost)/(b.rev||1)),b.arev?pct((b.arev-b.act)/b.arev):'—']);
 const tr2=rows.slice().reverse().map(x=>[x.p.ma,x.p.ten,(STATUS.find(s=>s[0]===x.p.status)||STATUS[0])[1],x.t.pre,x.t.cost,x.has?x.a:'',pct(x.t.mpct),x.done?pct((x.t.pre-x.a)/x.t.pre):'—']);
 if(fmtType==='xlsx')return downloadFile(name+'.xlsx',xlsxBook([{name:'Theo loại hình',top:[['BÁO CÁO BIÊN – '+dvn(today())]],head:['Loại hình','Số dự toán','Doanh thu trước VAT','Đ/m²','Biên dự toán','Biên thực tế'],rows:tr1},{name:'Theo dự án',head:['Mã','Dự án','Trạng thái','Trước VAT','Vốn dự toán','Thực chi','Biên DT','Biên TT'],rows:tr2,widths:[{wch:16},{wch:40},{wch:14},{wch:15},{wch:15},{wch:15},{wch:9},{wch:9}]}]));
 const dd=pdfFrame({docTitle:'Báo cáo biên',orient:'landscape'});const c=dd.content;c.push(pdfTitle('BÁO CÁO BIÊN LỢI NHUẬN',`${rows.length} dự toán · ${rows.filter(x=>x.has).length} dự án có thực chi`,[['Ngày:',dvn(today())]]));
 c.push(pdfSection('THEO LOẠI HÌNH'));c.push(pdfGrid([{t:'LOẠI HÌNH',w:'*'},{t:'SỐ DỰ TOÁN',w:60,a:'right'},{t:'DOANH THU TRƯỚC VAT',w:100,a:'right'},{t:'Đ/M²',w:70,a:'right'},{t:'BIÊN DT',w:60,a:'right'},{t:'BIÊN TT',w:60,a:'right'}],tr1));
 c.push(pdfSection('THEO DỰ ÁN'));c.push(pdfGrid([{t:'MÃ',w:70,fs:7},{t:'DỰ ÁN',w:'*'},{t:'TRẠNG THÁI',w:70},{t:'TRƯỚC VAT',w:80,a:'right'},{t:'VỐN DỰ TOÁN',w:80,a:'right'},{t:'THỰC CHI',w:80,a:'right'},{t:'BIÊN DT',w:50,a:'right'},{t:'BIÊN TT',w:50,a:'right'}],tr2));return savePdf(dd,name+'.pdf');}
async function exportBook(fmtType){const sc=can.seeCost(S.role);const p=paramsOf();const items=Object.values(CAT).sort((a,b)=>a.code.localeCompare(b.code));const name=`BangGiaChuan_v${curVersion().no}_${fileStamp()}`;
 const row=c=>{const cost=costOf(c.code);const offer=Math.round(cost*(1+(p[BIEN_KEY[c.bien]]||0))/100)*100;return [c.code,c.name,c.unit,(c.ref||'').startsWith('S')||c.custom?c.spec||'':'',...(sc?[cost]:[]),c.bien,offer,c.mmin||'',c.mmax||'',c.src+(c.custom?' (bổ sung)':'')];};
 if(fmtType==='xlsx')return downloadFile(name+'.xlsx',xlsxBook([{name:'Bảng giá chuẩn',top:[[`BẢNG GIÁ CHUẨN CENOVA – phiên bản v${curVersion().no} hiệu lực ${dvn(curVersion().date)} (giá chào chưa VAT, chưa hệ số)`]],head:['Mã','Hạng mục','ĐVT','Quy cách',...(sc?['Giá vốn']:[]),'Loại biên','Giá chào','TT min','TT max','Nguồn'],rows:items.map(row),widths:[{wch:11},{wch:55},{wch:8},{wch:35},...(sc?[{wch:12}]:[]),{wch:6},{wch:12},{wch:11},{wch:11},{wch:45}]}]));
 const dd=pdfFrame({docTitle:'Bảng giá chuẩn',orient:'landscape'});const c=dd.content;c.push(pdfTitle('BẢNG GIÁ CHUẨN',`Phiên bản v${curVersion().no} hiệu lực ${dvn(curVersion().date)} · ${items.length} hạng mục · giá chào chưa VAT, chưa nhân hệ số điều kiện`,[['Ngày:',dvn(today())]]));
 const rows=[];let last='';items.forEach(it=>{const g=it.code.slice(0,4);if(g!==last){rows.push({row:[`${g}  ${GROUPS[g]||''}`],style:{group:true}});last=g;}const r=row(it);rows.push([r[0],r[1],r[2],...(sc?[r[4]]:[]),r[sc?5:4],r[sc?6:5],r[sc?7:6]?`${fmt(r[sc?7:6])}–${fmt(r[sc?8:7])}`:'']);});
 c.push(pdfGrid([{t:'MÃ',w:48,fs:7},{t:'HẠNG MỤC',w:'*'},{t:'ĐVT',w:40},...(sc?[{t:'GIÁ VỐN',w:62,a:'right'}]:[]),{t:'BIÊN',w:30},{t:'GIÁ CHÀO',w:66,a:'right'},{t:'THỊ TRƯỜNG',w:110,a:'right'}],rows));return savePdf(dd,name+'.pdf');}
const expBtns=(key,label)=>`<span class="row" style="gap:6px"><button class="b sm" data-act="exp" data-k="${key}" data-f="xlsx">${label?label+' ':''}Excel</button><button class="b sm" data-act="exp" data-k="${key}" data-f="pdf">${label?label+' ':''}PDF</button></span>`;
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act="exp"]');if(!b)return;const k=b.dataset.k,f=b.dataset.f;
 const map={quick:()=>exportQuick(f),ai:()=>exportAI(f),cost:()=>exportCost(f),report:()=>exportReport(f),book:()=>exportBook(f),quote:()=>exportQuote(f,false),khoan:()=>exportQuote(f,true)};if(map[k])runExport(f.toUpperCase(),map[k]);});

/* ===================== BẢNG GIÁ BỔ SUNG, DÒNG TỰ NHẬP, NHẬP BẢNG KHỐI LƯỢNG ===================== */
S.catx={};S.catForm=null;S.manual=null;S.toCat=null;
const canCat=r=>r==='dutoan'||r==='gd';
function applyCatalog(docs){/* docs: {code: data} */for(const code of Object.keys(S.catx))if(!docs[code]&&CAT[code]?.custom)delete CAT[code];
 S.catx=docs;for(const [code,d] of Object.entries(docs)){if(d.active===false){if(CAT[code]?.custom)delete CAT[code];continue;}CAT[code]={code,name:d.name,unit:d.unit,spec:d.spec||'',cost:+d.cost||0,bien:d.bien||'TC',mmin:+d.mmin||null,mmax:+d.mmax||null,src:d.src||'Bổ sung',url:'',conf:'',ref:'X'+code,layer:+code[0],grp:code.slice(0,4),custom:true,by:d.by,at:d.at};}}
function nextCode(grp){let mx=0;const re=new RegExp('^'+grp.replace('-','\\-')+'-(\\d{3})$');[...Object.keys(CAT),...Object.keys(S.catx)].forEach(c=>{const m=c.match(re);if(m)mx=Math.max(mx,+m[1]);});return `${grp}-${String(mx+1).padStart(3,'0')}`;}
const grpOptions=(sel,withOther)=>Object.entries(GROUPS).filter(([k])=>withOther||!k.endsWith('-00')).map(([k,v])=>`<option value="${k}" ${sel===k?'selected':''}>${k} ${v}</option>`).join('');
async function saveCatalogItem(f){const code=f.code||nextCode(f.grp);const d={name:f.name.trim(),unit:f.unit.trim()||'gói',spec:(f.spec||'').trim(),cost:Math.max(0,+f.cost||0),bien:f.bien||'TC',mmin:+f.mmin||0,mmax:+f.mmax||0,src:(f.src||'').trim()||'Bổ sung bởi '+(ROLES[S.role]||S.role),by:S.role,at:new Date().toISOString(),active:true};
 if(!d.name||!(d.cost>0)){toast('Nhập tên và giá vốn lớn hơn 0');return null;}await store.set('catalog/'+code,d);logAudit(f.code?'sửa hạng mục bảng giá':'thêm hạng mục bảng giá',code,d.name);applyCatalog({...S.catx,[code]:d});return code;}
function catForm(){const f=S.catForm;if(!f)return '';const m=(paramsOf()[BIEN_KEY[f.bien||'TC']]||0);
 return `<div class="panel stack" id="catform"><div class="row sb"><h3>${f.code?'Sửa hạng mục '+f.code:'Thêm hạng mục vào bảng giá chuẩn'}</h3><button class="b sm ghost" data-act="cat_cancel">Đóng</button></div>
  <div class="grid g2">
   <label class="f"><span class="lbl">Nhóm</span><select id="cf_grp" ${f.code?'disabled':''}>${grpOptions(f.grp||'1-04')}</select></label>
   <label class="f"><span class="lbl">Tên hạng mục</span><input id="cf_name" value="${esc(f.name||'')}" placeholder="Ví dụ: Sàn vinyl kháng khuẩn Tarkett iQ Granit 2 mm – vật tư"></label>
   <label class="f"><span class="lbl">ĐVT</span><input id="cf_unit" value="${esc(f.unit||'')}" placeholder="m², md, bộ, cái, điểm…"></label>
   <label class="f"><span class="lbl">Quy cách / phạm vi (hiện trên báo giá)</span><input id="cf_spec" value="${esc(f.spec||'')}"></label>
   <label class="f"><span class="lbl">Giá vốn (đ/ĐVT, chưa VAT)</span><input id="cf_cost" type="number" min="0" step="1000" value="${f.cost||''}"></label>
   <label class="f"><span class="lbl">Loại biên</span><select id="cf_bien">${Object.entries(BIEN_LABEL).map(([k,v])=>`<option value="${k}" ${(f.bien||'TC')===k?'selected':''}>${k} · ${v}</option>`).join('')}</select></label>
   <label class="f"><span class="lbl">Giá thị trường thấp nhất (tuỳ chọn)</span><input id="cf_mmin" type="number" min="0" value="${f.mmin||''}"></label>
   <label class="f"><span class="lbl">Giá thị trường cao nhất (tuỳ chọn)</span><input id="cf_mmax" type="number" min="0" value="${f.mmax||''}"></label>
   <label class="f" style="grid-column:1/-1"><span class="lbl">Nguồn giá</span><input id="cf_src" value="${esc(f.src||'')}" placeholder="Báo giá NCC Thiên Hà 10/2026, hoá đơn dự án DT-…"></label></div>
  <div class="row sb"><span class="sm muted">Mã sẽ cấp: <b class="code">${f.code||nextCode(f.grp||'1-04')}</b> · giá chào ước ${fmt(Math.round((+f.cost||0)*(1+m)/100)*100)} đ (biên ${pct(m)})</span><button class="b pri" data-act="cat_save">${f.code?'Lưu thay đổi':'Thêm vào bảng giá'}</button></div></div>`;}
/* ---- dòng tự nhập trong dự toán ---- */
function manualForm(e){const f=S.manual||{grp:'1-00',unit:'',qty:1,mode:'cost',val:'',bien:'TC',name:''};const m=e.params[BIEN_KEY[f.bien]]||0;const v=+f.val||0;const cost=f.mode==='cost'?v:Math.round(v/(1+m));
 return `<div class="panel stack"><div class="row sb"><h3>Thêm dòng tự nhập (AI bóc thiếu, hạng mục chưa có trong bảng giá)</h3><button class="b sm ghost" data-act="mf_toggle">Đóng</button></div>
  <div class="grid g2"><label class="f"><span class="lbl">Nhóm</span><select id="mf_grp">${grpOptions(f.grp,true)}</select></label>
   <label class="f"><span class="lbl">Tên hạng mục</span><input id="mf_name" value="${esc(f.name)}" placeholder="Ví dụ: Tháo dỡ trần thạch cao cũ"></label>
   <label class="f"><span class="lbl">ĐVT</span><input id="mf_unit" value="${esc(f.unit)}"></label><label class="f"><span class="lbl">Khối lượng</span><input id="mf_qty" type="number" step="any" min="0" value="${f.qty}"></label>
   <label class="f"><span class="lbl">Nhập theo</span><select id="mf_mode"><option value="cost" ${f.mode==='cost'?'selected':''}>Giá vốn (đ/ĐVT)</option><option value="offer" ${f.mode==='offer'?'selected':''}>Giá chào khách (đ/ĐVT)</option></select></label>
   <label class="f"><span class="lbl">${f.mode==='cost'?'Giá vốn':'Giá chào'}</span><input id="mf_val" type="number" min="0" step="1000" value="${f.val}"></label>
   <label class="f"><span class="lbl">Loại biên</span><select id="mf_bien">${Object.entries(BIEN_LABEL).map(([k,vv])=>`<option value="${k}" ${f.bien===k?'selected':''}>${k} · ${vv}</option>`).join('')}</select></label>
   <div class="sm muted" style="align-self:end">Giá vốn ${fmt(cost)} · giá chào ${fmt(Math.round(cost*(1+m)/100)*100)} (trước hệ số)</div></div>
  <div class="row"><button class="b pri" data-act="mf_add">Thêm vào dự toán</button><span class="sm muted">Dòng tự nhập dùng ngay cho dự án này; bấm “Đưa vào bảng giá” ở dòng đó để lần sau dùng lại.</span></div></div>`;}
function addManualLine(e){const f=S.manual;if(!f||!f.name.trim()){toast('Nhập tên hạng mục');return;}const m=e.params[BIEN_KEY[f.bien]]||0;const v=+f.val||0;const cost=f.mode==='cost'?v:Math.round(v/(1+m));
 let n=1;while(e.lines.some(l=>l.code===`${f.grp}-T${String(n).padStart(2,'0')}`))n++;const code=`${f.grp}-T${String(n).padStart(2,'0')}`;
 e.lines.push({code,name:f.name.trim(),unit:f.unit.trim()||'gói',qty:Math.max(0,+f.qty||0),cost,bien:f.bien,kkt:'',on:true,cdt:false,tb:f.bien==='TB',custom:true,src:'tự nhập'});e.lines.sort((a,b)=>a.code.localeCompare(b.code));S.manual={...f,name:'',val:'',qty:1};saveSoon(e);}
async function lineToCatalog(e,i,grp){const L=e.lines[i];if(!L)return;const code=await saveCatalogItem({grp,name:L.name,unit:L.unit,cost:L.cost,bien:L.bien,src:`Từ dự án ${e.ma}`});if(!code)return;L.code=code;L.custom=false;L.src=(L.src||'')+' · đã vào bảng giá';e.lines.sort((a,b)=>a.code.localeCompare(b.code));S.toCat=null;saveSoon(e);toast('Đã thêm '+code+' vào bảng giá chuẩn');}

/* ---- NHẬP BẢNG KHỐI LƯỢNG (Excel KTS / dán) ---- */
S.boq={rows:[],raw:null,sheets:null,sheet:'',hdr:-1,map:{},target:'new',meta:{type:'nha',S:'',ten:'',khach:'',diachi:''},file:'',busy:''};
const vn=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'d').toLowerCase();
const STOP=new Set(['va','cac','cua','theo','loai','cho','bang','voi','tai','tren','duoi','gom','bao','the','mot','hai','tu','den','khong','co','phan','hang','muc','cong','tac','tp','hcm','–','-']);
const toks=s=>vn(s).replace(/[^a-z0-9.x ]+/g,' ').split(/\s+/).filter(w=>w&&!STOP.has(w)&&w.length>1);
const bigr=s=>{const t=vn(s).replace(/[^a-z0-9]/g,'');const o=new Set();for(let i=0;i<t.length-1;i++)o.add(t.slice(i,i+2));return o;};
const dice=(a,b)=>{if(!a.size||!b.size)return 0;let n=0;a.forEach(x=>{if(b.has(x))n++;});return 2*n/(a.size+b.size);};
const unitN=u=>{u=vn(u).replace(/\s/g,'');if(/^m2|^m²|metvuong|^m\^2/.test(u))return 'm2';if(/^m3|khoi/.test(u))return 'm3';if(/^md|^m\.?dai|^mdai|^m$|^met$/.test(u))return 'md';if(/^bo|^cai|^chiec|^cay|^tam|^phong|^diem|^goi|^hethong/.test(u))return u.replace(/[^a-z]/g,'').slice(0,4);if(/^kg/.test(u))return 'kg';return u;};
let CATIDX=null;function catIndex(){if(CATIDX&&CATIDX.n===Object.keys(CAT).length)return CATIDX.list;const list=Object.values(CAT).map(c=>({c,t:new Set(toks(c.name+' '+(c.spec||'').slice(0,40))),b:bigr(c.name),u:unitN(c.unit),h:headOf(c.name)}));CATIDX={n:Object.keys(CAT).length,list};return list;}
const HEADS=['tran','vach','san','son','cua','op','lat','tu','quay','den','may','ong','day','o','cong','diem','thao','pha','chong','bang','chu','rem','giuong','ghe','tham','kinh','be','xay','to','can','dao','ep','thep','thiet','ho','phi','dich','van','ve','bao','he','nhan','dien','nuoc','camera','loa','binh','tam','go','da','gach','lam','tu'];
function headOf(s){const t=toks(s);const i=t.findIndex(w=>HEADS.includes(w));return i>=0&&i<3?t[i]:t[0]||'';}
function matchRow(name,unit){const t=new Set(toks(name)),b=bigr(name),u=unitN(unit),h=headOf(name);return catIndex().map(x=>{let s=0.6*dice(t,x.t)+0.4*dice(b,x.b);if(h&&x.h){if(h===x.h)s+=0.1;else if(HEADS.includes(h)&&HEADS.includes(x.h))s-=0.15;}if(u&&x.u){if(u===x.u||(u.slice(0,2)===x.u.slice(0,2)))s+=0.12;else s-=0.08;}return {code:x.c.code,s};}).sort((a,b2)=>b2.s-a.s).slice(0,5);}
const numVN=v=>{if(typeof v==='number')return v;let s=String(v??'').trim().replace(/\s|đ|vnd/gi,'');if(!s)return NaN;if(/,\d{1,2}$/.test(s)&&/\./.test(s))s=s.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');else if(/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s))s=s.replace(/,/g,'');else s=s.replace(',','.');return parseFloat(s);};
const KW={name:/hang muc|noi dung|ten cong viec|cong viec|dien giai|mo ta|ten vat/,unit:/^dvt|don vi|^dv$|^dvt\b/,qty:/khoi luong|^kl|so luong|^sl|k\.l/,price:/don gia|^dg|gia\b/,amt:/thanh tien|^tt$|thanh/,note:/ghi chu/};
function detectHeader(rows){let best=-1,bs=0,map={};for(let r=0;r<Math.min(25,rows.length);r++){const m={};let s=0;(rows[r]||[]).forEach((c,i)=>{const t=vn(c).trim();if(!t)return;for(const [k,re] of Object.entries(KW))if(m[k]==null&&re.test(t)){if(k==='price'&&/thanh tien/.test(t))continue;m[k]=i;s++;break;}});if(s>bs&&m.name!=null){bs=s;best=r;map=m;}}
 if(best<0){/* không có tiêu đề: đoán cột */const w=Math.max(...rows.slice(0,40).map(r=>r.length));const txt=[],numc=[];for(let i=0;i<w;i++){let L=0,N=0;rows.slice(0,60).forEach(r=>{const v=r[i];if(typeof v==='number'||!isNaN(numVN(v))&&String(v).trim())N++;else if(String(v||'').length>6)L+=String(v).length;});txt.push(L);numc.push(N);}
  map={name:txt.indexOf(Math.max(...txt))};const ni=numc.map((n,i)=>[n,i]).filter(([,i])=>i!==map.name).sort((a,b)=>b[0]-a[0]);if(ni[0])map.qty=ni[0][1];best=-1;}
 return {hdr:best,map};}
function buildBoqRows(){const B=S.boq;const rows=B.raw||[];const m=B.map;const out=[];let sec='';const p=paramsOf();
 for(let r=B.hdr+1;r<rows.length;r++){const row=rows[r]||[];const name=String(row[m.name]??'').replace(/\s+/g,' ').trim();if(!name)continue;const qty=numVN(row[m.qty]);const unit=m.unit!=null?String(row[m.unit]??'').trim():'';const price=m.price!=null?numVN(row[m.price]):NaN;
  if(!(qty>0)){if(!/^(tổng|cộng|total)/i.test(name))sec=name;continue;}if(/^(tổng|cộng)\b/i.test(name))continue;
  const cands=matchRow(name,unit);const top=cands[0]||{s:0};const st=top.s>=0.62?'khop':top.s>=0.42?'xem':'khong';
  out.push({i:out.length,r,name,unit,qty,price:price>0?price:0,sec,cands,code:st==='khong'?'':top.code,score:top.s,st,on:true,lop:1,by:'auto'});}
 B.rows=out;}
async function boqFile(f){const B=S.boq;B.file=f.name;B.busy='Đang đọc '+f.name;render();try{if(!window.XLSX)throw new Error('Thư viện Excel chưa tải xong, thử lại sau vài giây');
 const wb=XLSX.read(await f.arrayBuffer(),{type:'array'});B.sheets={};wb.SheetNames.forEach(n=>B.sheets[n]=XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:true,defval:''}));
 B.sheet=wb.SheetNames.find(n=>B.sheets[n].length>3)||wb.SheetNames[0];boqUseSheet();}catch(err){toast('Không đọc được file: '+(err.message||err));}B.busy='';render();}
function boqUseSheet(){const B=S.boq;B.raw=B.sheets[B.sheet]||[];const d=detectHeader(B.raw);B.hdr=d.hdr;B.map=d.map;buildBoqRows();}
function boqPaste(text){const B=S.boq;const rows=text.replace(/\r/g,'').split('\n').filter(l=>l.trim()).map(l=>l.split('\t'));if(!rows.length){toast('Chưa có dữ liệu dán');return;}B.file='Dán từ bảng tính';B.sheets={'Dán':rows};B.sheet='Dán';boqUseSheet();render();}
function boqOffer(code){const c=CAT[code];if(!c)return 0;const p=paramsOf();return Math.round(costOf(code)*(1+(p[BIEN_KEY[c.bien]]||0))/100)*100;}
async function boqAI(){const B=S.boq;if(!aiSample){toast('Trang này chưa được phép hỏi Claude');return;}const todo=B.rows.filter(x=>x.on&&x.st!=='khop').slice(0,80);if(!todo.length){toast('Không còn dòng nào cần AI khớp');return;}
 B.busy=`Claude đang khớp ${todo.length} dòng…`;render();
 const prompt=`Bạn là kỹ sư dự toán. Khớp từng dòng bảng khối lượng của kiến trúc sư với MÃ gần nghĩa nhất trong DANH MỤC bảng giá (cùng công việc, vật liệu, đơn vị tính tương thích). Không có mã phù hợp thì để code "". Không đoán bừa.
DÒNG CẦN KHỚP (i|tên|ĐVT|nhóm trong bảng KTS):
${todo.map(x=>`${x.i}|${x.name.slice(0,140)}|${x.unit}|${x.sec.slice(0,50)}`).join('\n')}

DANH MỤC (mã|tên|ĐVT):
${aiCatalog()}

Trả lời DUY NHẤT JSON: [{"i":0,"code":"1-05-001","ly_do":"ngắn gọn"}]`;
 try{const res=await aiSample.json(prompt,{modelTier:'default',cache:false});(Array.isArray(res)?res:[]).forEach(r=>{const x=B.rows[+r.i];if(!x)return;const code=String(r.code||'').trim();if(code&&CAT[code]){x.code=code;x.st='ai';x.why=String(r.ly_do||'');x.by='ai';}else if(code===''){x.st='khong';x.code='';x.why=String(r.ly_do||'AI: không có mã phù hợp');}});toast('AI đã khớp xong');}
 catch(e){toast(e.code==='not_granted'?'Bạn chưa cho phép trang dùng Claude':'Không gọi được Claude ('+(e.code||'lỗi')+')');}B.busy='';render();}
async function boqApply(){const B=S.boq;const use=B.rows.filter(x=>x.on);if(!use.length){toast('Chưa có dòng nào được chọn');return;}const ver=curVersion();let e;
 if(B.target==='new'){const m=B.meta;if(!(+m.S>0)){toast('Nhập diện tích sàn cho dự toán mới');return;}e=newEstimate({type:m.type,S:+m.S,pts:{},dd:'pho',dk:{},tang:1,ten:m.ten||'Dự án từ bảng KL',khach:m.khach,diachi:m.diachi});e.lines=[];}
 else{const p=S.projects[B.target];if(!p){toast('Chọn dự án để gộp');return;}e=JSON.parse(JSON.stringify(p));}
 const agg=new Map();let nX=0;
 use.forEach(x=>{if(x.code&&CAT[x.code]){const a=agg.get(x.code)||{qty:0,names:[],kts:0,ktsQ:0};a.qty+=x.qty;a.names.push(x.name);if(x.price){a.kts+=x.price*x.qty;a.ktsQ+=x.qty;}agg.set(x.code,a);}
  else{let code;do{nX++;code=`${x.lop}-00-B${String(nX).padStart(2,'0')}`;}while(e.lines.some(l=>l.code===code));const m=e.params[BIEN_KEY.TC]||0.25;
   e.lines.push({code,name:x.name,unit:x.unit||'gói',qty:Math.round(x.qty*100)/100,cost:x.price?Math.round(x.price/(1+m)):0,bien:x.lop===4?'DV':'TC',kkt:'',on:true,cdt:false,tb:false,custom:true,kts:x.price||0,src:'BOQ KTS, ngoài bảng giá'+(x.price?' · giá vốn suy từ giá KTS':'')});}});
 for(const [code,a] of agg){const it=CAT[code];let L=e.lines.find(l=>l.code===code);if(!L){L={code,name:it.name,unit:it.unit,qty:0,cost:costOf(code,ver),bien:it.bien,kkt:'',on:true,cdt:false,tb:it.bien==='TB',mmin:it.mmin,mmax:it.mmax};e.lines.push(L);}
  L.qty=Math.round(a.qty*100)/100;L.on=true;L.src='BOQ KTS: '+a.names.slice(0,3).join('; ').slice(0,140)+(a.names.length>3?` (+${a.names.length-3})`:'');if(a.ktsQ)L.kts=Math.round(a.kts/a.ktsQ);}
 e.lines.sort((a,b)=>a.code.localeCompare(b.code));e.boq={file:B.file,rows:use.length,at:new Date().toISOString(),mode:B.target==='new'?'new':'merge'};
 (e.notes=e.notes||[]).push({role:S.role,at:new Date().toISOString(),t:`Nhập bảng khối lượng "${B.file}": ${use.length} dòng, ${agg.size} mã khớp bảng giá, ${nX} dòng ngoài bảng giá.`});
 if(await saveProj(e)){S.cur=e.id;toast((B.target==='new'?'Đã tạo ':'Đã gộp vào ')+e.ma);go('chitiet');}}
function vBoq(){const B=S.boq;const r=S.role;const ps=Object.values(S.projects).sort((a,b)=>b.updated.localeCompare(a.updated));
 const cnt={khop:0,ai:0,xem:0,khong:0};B.rows.forEach(x=>{if(x.on)cnt[x.st]++;});const head=B.raw&&B.hdr>=0?B.raw[B.hdr]:(B.raw?B.raw[0]:[]);const colOpts=(sel)=>`<option value="">—</option>`+(head||[]).map((h,i)=>`<option value="${i}" ${sel===i?'selected':''}>${i+1}. ${esc(String(h).slice(0,24))}</option>`).join('');
 const stPill={khop:'<span class="pill ok">khớp</span>',ai:'<span class="pill ok">AI khớp</span>',xem:'<span class="pill lo">xem lại</span>',khong:'<span class="pill hi">ngoài bảng giá</span>'};
 return `<div class="panel stack"><h3>Nhập bảng khối lượng của KTS / khách hàng</h3>
  <div class="grid g2"><label class="drop" for="boq_file"><input id="boq_file" type="file" accept=".xlsx,.xls,.csv" hidden><b>Chọn file Excel / CSV</b><span class="sm muted">${B.file?esc(B.file):'File có cột tên hạng mục, ĐVT, khối lượng (đơn giá nếu có)'}</span></label>
   <label class="f"><span class="lbl">Hoặc dán vùng bảng từ Excel / Google Sheets</span><textarea id="boq_paste" rows="4" placeholder="Copy các ô (gồm dòng tiêu đề) rồi dán vào đây"></textarea><button class="b sm" data-act="boq_paste" style="align-self:flex-start">Đọc dữ liệu dán</button></label></div>
  ${B.busy?`<div class="sm">${esc(B.busy)}</div>`:''}
  ${B.raw?`<div class="row">${B.sheets&&Object.keys(B.sheets).length>1?`<label class="row" style="gap:6px"><span class="lbl">Sheet</span><select id="boq_sheet">${Object.keys(B.sheets).map(n=>`<option ${n===B.sheet?'selected':''}>${esc(n)}</option>`).join('')}</select></label>`:''}
   <label class="row" style="gap:6px"><span class="lbl">Dòng tiêu đề</span><input id="boq_hdr" type="number" min="0" value="${B.hdr+1}" style="width:60px"></label>
   ${['name','unit','qty','price'].map(k=>`<label class="row" style="gap:6px"><span class="lbl">${{name:'Cột tên',unit:'Cột ĐVT',qty:'Cột KL',price:'Cột đơn giá'}[k]}</span><select data-boqmap="${k}">${colOpts(B.map[k])}</select></label>`).join('')}</div>`:''}
 </div>
 ${B.rows.length?`<div class="panel stack"><div class="row sb"><div><h3>${B.rows.length} dòng khối lượng</h3><div class="sm muted">Khớp ${cnt.khop+cnt.ai} · cần xem ${cnt.xem} · ngoài bảng giá ${cnt.khong}. Giá áp theo bảng giá Cenova; giá KTS chỉ để so.</div></div>
   <div class="row"><button class="b" data-act="boq_ai" ${aiSample&&!B.busy?'':'disabled'} title="${aiSample?'':'Chỉ chạy khi mở trong claude.ai'}">Nhờ AI khớp dòng chưa chắc</button></div></div>
  <div class="tw" style="max-height:62vh"><table><thead><tr><th></th><th>Dòng KTS</th><th>ĐVT</th><th class="n">KL</th><th class="n">Giá KTS</th><th>Mã Cenova</th><th class="n">Giá Cenova</th><th>Trạng thái</th></tr></thead><tbody>
  ${B.rows.map(x=>{const c=CAT[x.code];const off=x.code?boqOffer(x.code):0;const d=x.price&&off?(off-x.price)/x.price:null;const uBad=c&&x.unit&&unitN(c.unit)&&unitN(x.unit)&&unitN(c.unit).slice(0,2)!==unitN(x.unit).slice(0,2);
   return `<tr class="${x.on?'':'off'}"><td class="keep"><input type="checkbox" data-boq="${x.i}" data-f="on" ${x.on?'checked':''} aria-label="Dùng dòng"></td><td style="min-width:200px">${esc(x.name)}${x.sec?`<div class="sm muted">${esc(x.sec.slice(0,60))}</div>`:''}</td><td>${esc(x.unit)}</td><td class="n">${fmtq(x.qty)}</td><td class="n">${x.price?fmt(x.price):'—'}</td>
   <td style="min-width:240px"><select data-boq="${x.i}" data-f="code" style="max-width:280px"><option value="">— Ngoài bảng giá (dòng tự nhập)</option>${[...new Set([x.code,...x.cands.map(c=>c.code)].filter(Boolean))].map(cd=>`<option value="${cd}" ${cd===x.code?'selected':''}>${cd} ${esc(CAT[cd]?.name.slice(0,48)||'')} (${esc(CAT[cd]?.unit||'')})</option>`).join('')}</select>
    <div class="row" style="margin-top:2px"><input data-boq="${x.i}" data-f="codein" placeholder="gõ mã khác" style="width:100px;font-size:12px;padding:2px 6px">${!x.code?`<select data-boq="${x.i}" data-f="lop" style="font-size:12px">${[1,2,3,4,9].map(L=>`<option value="${L}" ${x.lop==L?'selected':''}>Lớp ${L}</option>`).join('')}</select>`:''}${x.why?`<span class="sm muted">${esc(x.why.slice(0,60))}</span>`:''}</div></td>
   <td class="n">${x.code?fmt(off):(x.price?`<span class="sm muted">theo KTS</span>`:'<span class="pill hi">cần giá</span>')}${d!=null&&Math.abs(d)>0.2?` <span class="pill ${d>0?'hi':'lo'}">${d>0?'+':''}${pct(d)}</span>`:''}${uBad?' <span class="pill lo" title="ĐVT khác nhau">ĐVT?</span>':''}</td><td>${stPill[x.st]}${x.score?`<div class="sm muted">${Math.round(x.score*100)}%</div>`:''}</td></tr>`;}).join('')}
  </tbody></table></div>
  <div class="grid g2"><label class="f"><span class="lbl">Đưa vào</span><select id="boq_target"><option value="new" ${B.target==='new'?'selected':''}>Tạo dự toán mới</option>${ps.map(p=>`<option value="${p.id}" ${B.target===p.id?'selected':''}>Gộp vào ${esc(p.ma)} · ${esc(p.ten)}</option>`).join('')}</select></label>
   ${B.target==='new'?`<label class="f"><span class="lbl">Loại hình</span><select id="boq_type">${Object.entries(TEMPLATES).map(([k,T])=>`<option value="${k}" ${B.meta.type===k?'selected':''}>${T.label}</option>`).join('')}</select></label>
   <label class="f"><span class="lbl">Diện tích sàn (m²)</span><input id="boq_S" type="number" min="1" value="${esc(B.meta.S)}"></label><label class="f"><span class="lbl">Tên dự án</span><input id="boq_ten" value="${esc(B.meta.ten)}"></label>
   <label class="f"><span class="lbl">Khách hàng</span><input id="boq_khach" value="${esc(B.meta.khach)}"></label><label class="f"><span class="lbl">Địa chỉ</span><input id="boq_diachi" value="${esc(B.meta.diachi)}"></label>`:`<div class="sm muted" style="align-self:end">Dòng trùng mã thay khối lượng cũ; mã mới được thêm vào; dòng ngoài bảng giá thêm thành dòng tự nhập.</div>`}</div>
  ${can.createEst(r)?`<div class="row"><button class="b pri" data-act="boq_apply">${B.target==='new'?'Tạo dự toán từ bảng khối lượng':'Gộp vào dự toán'}</button><span class="sm muted">Dòng ngoài bảng giá lấy giá KTS làm giá chào ban đầu (giá vốn = giá KTS ÷ ${(1+(paramsOf().B1||.25)).toLocaleString('vi-VN')}).</span></div>`:'<div class="banner info">Vai trò này không tạo dự toán.</div>'}
 </div>`:''}`;}
/* sự kiện */
document.addEventListener('change',ev=>{const t=ev.target;const B=S.boq;
 if(t.id==='boq_file'&&t.files[0]){boqFile(t.files[0]);t.value='';return;}
 if(t.id==='boq_sheet'){B.sheet=t.value;boqUseSheet();return render();}
 if(t.id==='boq_hdr'){B.hdr=Math.max(0,(+t.value||1)-1);const h=B.raw[B.hdr]||[];const m={};h.forEach((c,i)=>{const s=vn(c).trim();for(const [k,re] of Object.entries(KW))if(m[k]==null&&re.test(s)&&!(k==='price'&&/thanh tien/.test(s))){m[k]=i;break;}});if(m.name!=null)B.map=m;buildBoqRows();return render();}
 if(t.dataset.boqmap){const v=t.value===''?undefined:+t.value;B.map[t.dataset.boqmap]=v;buildBoqRows();return render();}
 if(t.dataset.boq!=null){const x=B.rows[+t.dataset.boq];const f=t.dataset.f;if(f==='on')x.on=t.checked;else if(f==='code'){x.code=t.value;x.st=t.value?'khop':'khong';x.by='user';}else if(f==='codein'){const c=t.value.trim();if(CAT[c]){x.code=c;x.st='khop';x.by='user';}else if(c)toast('Không có mã '+c);}else if(f==='lop')x.lop=+t.value;return render();}
 if(t.id==='boq_target'){B.target=t.value;return render();}if(t.id==='boq_type'){B.meta.type=t.value;return;}
 if(['boq_S','boq_ten','boq_khach','boq_diachi'].includes(t.id)){B.meta[t.id.slice(4)]=t.value;return;}
 /* form bảng giá */
 if(t.id&&t.id.startsWith('cf_')&&S.catForm){S.catForm[t.id.slice(3)]=t.value;if(t.id==='cf_grp'||t.id==='cf_bien')render();return;}
 if(t.id&&t.id.startsWith('mf_')){S.manual=S.manual||{grp:'1-00',unit:'',qty:1,mode:'cost',val:'',bien:'TC',name:''};S.manual[t.id.slice(3)]=t.value;if(['mf_mode','mf_bien','mf_grp'].includes(t.id))render();return;}
 if(t.id==='tocat_grp'){S.toCatGrp=t.value;return;}});
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;const e=curProj();
 if(a==='boq_paste'){boqPaste(document.getElementById('boq_paste').value);}
 else if(a==='boq_ai')boqAI();else if(a==='boq_apply')boqApply();
 else if(a==='ai_mode2'){S.ai.mode2=b.dataset.v;render();}
 else if(a==='cat_new'){S.catForm={grp:'1-04',bien:'TC'};render();setTimeout(()=>document.getElementById('catform')?.scrollIntoView({block:'start'}),30);}
 else if(a==='cat_edit'){const c=CAT[b.dataset.v];S.catForm={code:c.code,grp:c.grp,name:c.name,unit:c.unit,spec:c.spec,cost:c.cost,bien:c.bien,mmin:c.mmin,mmax:c.mmax,src:c.src};render();setTimeout(()=>document.getElementById('catform')?.scrollIntoView({block:'start'}),30);}
 else if(a==='cat_cancel'){S.catForm=null;render();}
 else if(a==='cat_save'){const f=S.catForm;['name','unit','spec','cost','mmin','mmax','src'].forEach(k=>{const el=document.getElementById('cf_'+k);if(el)f[k]=el.value;});const code=await saveCatalogItem(f);if(code){toast((f.code?'Đã lưu ':'Đã thêm ')+code);S.catForm=null;S.bf=code;render();}}
 else if(a==='cat_off'){const c=b.dataset.v;const d=S.catx[c];if(d){await store.set('catalog/'+c,{...d,active:false});applyCatalog({...S.catx,[c]:{...d,active:false}});toast('Đã ngừng dùng '+c);render();}}
 else if(a==='mf_toggle'){S.showManual=!S.showManual;render();}
 else if(a==='mf_add'&&e){S.manual=S.manual||{grp:'1-00',unit:'',qty:1,mode:'cost',val:'',bien:'TC',name:''};['grp','mode','bien'].forEach(k=>{const el=document.getElementById('mf_'+k);if(el)S.manual[k]=el.value;});['name','unit','qty','val'].forEach(k=>{const el=document.getElementById('mf_'+k);if(el)S.manual[k]=el.value;});addManualLine(e);render();}
 else if(a==='tocat'&&e){S.toCat=+b.dataset.v;S.toCatGrp=e.lines[S.toCat].code.slice(0,4);render();}
 else if(a==='tocat_ok'&&e){let g=S.toCatGrp||'1-04';if(g.endsWith('-00')){toast('Chọn nhóm cụ thể (không phải nhóm “Ngoài danh mục”)');return;}await lineToCatalog(e,S.toCat,g);render();}
 else if(a==='tocat_no'){S.toCat=null;render();}
 /* thêm dòng trong kết quả AI */
 else if(a==='air_addcat'&&S.ai.res){const code=document.getElementById('air_code').value.trim();const kl=+document.getElementById('air_kl').value||0;if(!CAT[code]||!(kl>0)){toast('Chọn mã và nhập khối lượng');return;}const R=S.ai.res;const ex=R.lines.find(l=>l.code===code);if(ex){ex.kl=kl;ex.on=true;}else R.lines.push({code,kl,cach:'thêm tay',tc:'cao',ng:'kỹ sư',on:true});R.lines.sort((x,y)=>x.code.localeCompare(y.code));render();}
 else if(a==='air_addx'&&S.ai.res){const g=id=>document.getElementById(id)?.value||'';const ten=g('airx_ten').trim();const kl=+g('airx_kl');if(!ten||!(kl>0)){toast('Nhập tên và khối lượng');return;}S.ai.res.extra.push({lop:+g('airx_lop')||1,ten,dvt:g('airx_dvt')||'gói',kl,cach:'thêm tay',tc:'cao',ng:'kỹ sư',on:true,cost:+g('airx_cost')||0});render();}});
function aiAddRows(){return `<details class="panel" ${S.hs?.open?.air_add?'open':''} id="hs_air_add"><summary class="sm">+ AI bóc thiếu? Thêm hạng mục từ bảng giá hoặc dòng tự nhập</summary><div class="stack" style="margin-top:8px">
 <div class="row"><input id="air_code" list="air_codes" placeholder="Gõ mã hoặc tên rồi chọn" style="flex:1;min-width:220px"><datalist id="air_codes">${Object.values(CAT).map(c=>`<option value="${c.code}">${esc(c.name.slice(0,70))} (${esc(c.unit)})</option>`).join('')}</datalist><input id="air_kl" type="number" step="any" min="0" placeholder="KL" style="width:90px"><button class="b sm" data-act="air_addcat">Thêm từ bảng giá</button></div>
 <div class="row"><select id="airx_lop">${[1,2,3,4,9].map(L=>`<option value="${L}">Lớp ${L}</option>`).join('')}</select><input id="airx_ten" placeholder="Tên hạng mục ngoài bảng giá" style="flex:1;min-width:200px"><input id="airx_dvt" placeholder="ĐVT" style="width:70px"><input id="airx_kl" type="number" step="any" placeholder="KL" style="width:80px"><input id="airx_cost" type="number" placeholder="Giá vốn" style="width:110px"><button class="b sm" data-act="air_addx">Thêm dòng tự nhập</button></div></div></details>`;}

/* ===================== TÀI KHOẢN, VAI TRÒ, QUYỀN SỬA, NHẬT KÝ ===================== */
S.me={id:null,name:'',isOwner:false,canEdit:false,ready:false};S.roles={};S.audit={};S.people={};let U=null;
async function initAuth(){try{U=window.claude?await window.claude.use('user'):null;}catch(e){U=null;}
 if(U){const m=await U.me();S.me={id:m.id,name:m.name,isOwner:m.isOwner,canEdit:m.canEdit,ready:true};}
 else S.me={id:null,name:'',isOwner:false,canEdit:false,ready:true,offline:true};if(S.me.isOwner){let k=null;try{k=sessionStorage.getItem('cnv_view');}catch(e){}S.role=k||'gd';}applyRole();render();}
const SCHEMA_VERSION=2;
function myAssigned(){if(S.me.isOwner)return 'gd';const r=S.me.id&&S.roles[S.me.id];return r&&r.role&&r.active!==false?r.role:null;}
function canSwitchRole(){return S.me.offline||S.me.isOwner;}
function applyRole(){if(canSwitchRole())return;const r=myAssigned();S.role=r||'sale';}
function isMine(e){return !!S.me.id&&(e.createdBy===S.me.id||(e.assignees||[]).includes(S.me.id));}
function canEditProj(e){if(!e)return false;if(S.role==='gd')return true;if(!can.editEst(S.role))return false;if(S.me.offline||!e.createdBy)return true;return isMine(e);}
function canDelProj(e){return S.role==='gd'||(S.role==='dutoan'&&isMine(e)&&e.status==='nhap');}
/* ghi đè lưu dự án: thêm người tạo, người sửa, phiên bản lược đồ */
async function saveProj(e){e.updated=new Date().toISOString();e.updatedBy=S.me.id||null;const isNew=!S.projects[e.id];if(isNew&&!e.createdBy)e.createdBy=S.me.id||null;e.schema=SCHEMA_VERSION;e.assignees=e.assignees||[];
S.projects[e.id]=e;const ok=await store.set('projects/'+e.id,JSON.parse(JSON.stringify(e)));if(ok&&isNew)logAudit('tạo dự toán',e.ma,e.ten);return ok;}
/* nhật ký: mỗi ngày 1 tài liệu */
async function logAudit(act,ref,detail){const day=today();const path='audit/'+day;const cur=S.audit[day]?.entries||[];const ent={at:new Date().toISOString(),uid:S.me.id||null,role:S.role,act,ref:String(ref||''),d:String(detail||'').slice(0,200)};
 const entries=[...cur,ent].slice(-600);S.audit[day]={entries};try{await store.set(path,{entries});}catch(e){}}
/* tên người từ id */
async function resolvePeople(ids){ids=[...new Set(ids.filter(Boolean))].filter(id=>!S.people[id]);if(!ids.length||!U)return;try{const ps=await U.profiles(ids);let ch=false;for(const [id,p] of Object.entries(ps)){S.people[id]=p.name||'Người dùng';ch=true;}if(ch)render();}catch(e){}}
const who=id=>!id?'—':id===S.me.id?(S.me.name||'Bạn')+' (bạn)':(S.people[id]||'…');
function roleBox(){const r=S.role;if(canSwitchRole())return `<span class="lbl">${S.me.offline?'Vai trò':'Xem như'}</span><select id="role" aria-label="Vai trò">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k===r?'selected':''}>${v}</option>`).join('')}</select>${S.me.isOwner?'<span class="pill ok" title="Chủ app luôn có quyền Giám đốc">chủ app</span>':''}`;
 return `<span class="sm">${esc(S.me.name||'Bạn')}</span><span class="pill ${myAssigned()?'ok':'lo'}">${ROLES[r]||r}${myAssigned()?'':' · chưa được gán'}</span>`;}
/* màn Người dùng */
function vUsers(){const ids=Object.keys(S.roles);resolvePeople(ids);const isAdmin=S.me.isOwner||S.me.canEdit||S.me.offline;
 return `<div style="margin:20px 0 12px"><h2>Người dùng & vai trò</h2><div class="sm muted">Gán vai trò cho từng tài khoản trong tổ chức. Mọi người xem được mọi dự án; người lập, người được giao và Giám đốc mới sửa được. Chủ app luôn có quyền Giám đốc.</div></div>
 ${isAdmin?'':'<div class="banner warn">Chỉ người có quyền chỉnh sửa app (chủ app) mới đổi được vai trò.</div>'}
 <div class="split"><div class="panel stack" style="min-width:0"><h3>Danh sách</h3>${ids.length?`<div class="tw"><table><thead><tr><th>Người dùng</th><th>Vai trò</th><th>Cập nhật</th><th></th></tr></thead><tbody>
 ${ids.map(id=>{const r=S.roles[id];return `<tr class="${r.active===false?'off':''}"><td>${esc(who(id))}</td><td>${isAdmin?`<select data-roleuid="${id}">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${r.role===k?'selected':''}>${v}</option>`).join('')}</select>`:ROLES[r.role]}</td><td class="sm">${dvn(r.at)}</td><td>${isAdmin?`<button class="b sm ghost" data-act="role_off" data-v="${id}">${r.active===false?'Bật lại':'Khoá'}</button>`:''}</td></tr>`;}).join('')}</tbody></table></div>`:'<div class="empty">Chưa gán vai trò cho ai. Tìm tên đồng nghiệp ở khung bên phải để thêm.</div>'}</div>
 <aside class="panel stack"><h3>Thêm người</h3>${isAdmin?`<input id="usr_q" placeholder="Gõ tên hoặc email đồng nghiệp" autocomplete="off"><div id="usr_hits" class="stack" style="gap:4px"></div>
  <label class="f"><span class="lbl">Vai trò khi thêm</span><select id="usr_role">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k==='dutoan'?'selected':''}>${v}</option>`).join('')}</select></label>
  <div class="sm muted">Người được thêm phải có quyền mở app (anh chia sẻ link trong menu Share). Muốn người đó ban hành bảng giá và gán vai trò thì chia sẻ quyền chỉnh sửa.</div>`:'<div class="sm muted">Liên hệ chủ app để được gán vai trò.</div>'}</aside></div>`;}
function auditPanel(){const days=Object.keys(S.audit).sort().reverse().slice(0,7);const rows=days.flatMap(d=>(S.audit[d].entries||[]).slice().reverse()).slice(0,80);resolvePeople(rows.map(r=>r.uid));
 return `<div class="panel stack" style="margin-top:16px"><div class="row sb"><h3>Nhật ký thao tác (7 ngày gần nhất)</h3>${S.role==='gd'?'<button class="b sm" data-act="backup">Sao lưu toàn bộ dữ liệu (.json)</button>':''}</div>
 ${rows.length?`<div class="tw" style="max-height:40vh"><table><thead><tr><th>Lúc</th><th>Người</th><th>Thao tác</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="sm">${new Date(r.at).toLocaleString('vi-VN')}</td><td class="sm">${esc(who(r.uid))} · ${esc(ROLES[r.role]||r.role)}</td><td>${esc(r.act)}</td><td class="code">${esc(r.ref)}</td><td class="sm">${esc(r.d)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="sm muted">Chưa có thao tác nào được ghi.</div>'}</div>`;}
async function backupAll(){const data={app:'APP DỰ TOÁN CENOVA',schema:SCHEMA_VERSION,exportedAt:new Date().toISOString(),projects:S.projects,expenses:S.expenses,catalog:S.catx,versions:S.versions,proposals:S.proposals,settings:{company:S.company},roles:S.roles};
 await downloadFile(`SaoLuu_AppDuToan_${today().replace(/-/g,'')}.json`,JSON.stringify(data,null,1));logAudit('sao lưu dữ liệu','toàn bộ',`${Object.keys(S.projects).length} dự án`);}
/* giao việc trong dự án */
function assignBox(e){const can2=S.role==='gd'||isMine(e)||(!e.createdBy&&can.editEst(S.role));const ids=[e.createdBy,...(e.assignees||[])].filter(Boolean);resolvePeople(ids);
 return `<div class="row sm" style="margin-top:6px;gap:6px">${e.createdBy?`<span class="muted">Người lập:</span><span class="pill">${esc(who(e.createdBy))}</span>`:'<span class="muted">Dự toán cũ, chưa có người lập</span>'}<span class="muted">Giao cho:</span>${(e.assignees||[]).map(id=>`<span class="pill">${esc(who(id))}${can2?` <button class="b sm ghost" data-act="asg_del" data-v="${id}" style="padding:0 2px" aria-label="Bỏ giao">×</button>`:''}</span>`).join('')||'<span class="muted">chưa giao</span>'}
 ${can2&&U?`<input id="asg_q" placeholder="+ giao cho…" style="width:150px;padding:2px 6px" autocomplete="off"><span id="asg_hits" class="row" style="gap:4px"></span>`:''}</div>`;}
/* sự kiện */
document.addEventListener('change',async ev=>{const t=ev.target;
 if(t.id==='role'&&canSwitchRole()){S.role=t.value;try{localStorage.setItem('cnv_role',S.role);if(S.me.isOwner)sessionStorage.setItem('cnv_view',S.role);}catch(x){}render();return;}
 if(t.dataset.roleuid){const id=t.dataset.roleuid;const d={...S.roles[id],role:t.value,at:new Date().toISOString(),by:S.me.id};S.roles[id]=d;await store.set('roles/'+id,d);logAudit('đổi vai trò',who(id),ROLES[t.value]);render();}});
let usrT=null;
document.addEventListener('input',ev=>{const t=ev.target;if((t.id==='usr_q'||t.id==='asg_q')&&U){const box=document.getElementById(t.id==='usr_q'?'usr_hits':'asg_hits');U.search(t.value).then(hits=>{if(!box)return;box.innerHTML='';hits.slice(0,6).forEach(h=>{const b=document.createElement('button');b.className='b sm';b.dataset.act=t.id==='usr_q'?'usr_add':'asg_add';b.dataset.v=h.id;b.textContent=h.name+(h.isMe?' (bạn)':'');S.people[h.id]=h.name;box.appendChild(b);});});}});
document.addEventListener('focusin',ev=>{const t=ev.target;if((t.id==='usr_q'||t.id==='asg_q')&&U)t.dispatchEvent(new Event('input',{bubbles:true}));});
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;const e=curProj();
 if(a==='usr_add'){const id=b.dataset.v;const role=document.getElementById('usr_role')?.value||'dutoan';const d={role,active:true,at:new Date().toISOString(),by:S.me.id};S.roles[id]=d;await store.set('roles/'+id,d);logAudit('gán vai trò',who(id),ROLES[role]);toast('Đã gán '+ROLES[role]);render();}
 else if(a==='role_off'){const id=b.dataset.v;const d={...S.roles[id],active:S.roles[id].active===false,at:new Date().toISOString(),by:S.me.id};S.roles[id]=d;await store.set('roles/'+id,d);logAudit(d.active?'mở khoá':'khoá tài khoản',who(id),'');render();}
 else if(a==='backup')backupAll();
 else if(a==='asg_add'&&e){e.assignees=[...new Set([...(e.assignees||[]),b.dataset.v])];await saveProj(e);logAudit('giao dự án',e.ma,who(b.dataset.v));render();}
 else if(a==='asg_del'&&e){e.assignees=(e.assignees||[]).filter(x=>x!==b.dataset.v);await saveProj(e);render();}});

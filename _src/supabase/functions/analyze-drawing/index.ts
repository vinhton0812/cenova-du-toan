// Edge Function: analyze-drawing — AI bóc khối lượng cho APP DỰ TOÁN CENOVA.
// Khoá Anthropic lấy từ secrets (ANTHROPIC_API_KEY), KHÔNG nằm trong code hay frontend.
// Chỉ người dùng đã đăng nhập, đang hoạt động và đã được gán vai trò mới gọi được. Kết quả luôn là bản nháp.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const out = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const fail = (code: string, message: string, status = 400) => out({ error: { code, message } }, status);

const MAX_IMAGES = 8;
const MAX_IMAGE_B64 = 6_000_000; // ~4,5 MB / ảnh
const MAX_PROMPT = 120_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail("method", "Chỉ nhận POST", 405);

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return fail("sampling_disabled", "Chưa cài ANTHROPIC_API_KEY trong secrets của Supabase", 503);

  // xác thực người gọi
  const auth = req.headers.get("Authorization") ?? "";
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: u, error: ue } = await sb.auth.getUser();
  if (ue || !u?.user) return fail("not_granted", "Chưa đăng nhập", 401);
  const { data: prof } = await sb.from("qs_profiles").select("role,active").eq("id", u.user.id).maybeSingle();
  if (!prof || !prof.active || !prof.role) return fail("not_granted", "Tài khoản chưa được gán vai trò", 403);

  let body: { prompt?: string; images?: { media_type: string; data: string }[]; tier?: string };
  try { body = await req.json(); } catch { return fail("bad_request", "Dữ liệu gửi lên không hợp lệ"); }
  const prompt = String(body.prompt ?? "");
  const images = Array.isArray(body.images) ? body.images : [];
  if (!prompt) return fail("bad_request", "Thiếu nội dung yêu cầu");
  if (prompt.length > MAX_PROMPT) return fail("prompt_too_large", "Hồ sơ quá dài");
  if (images.length > MAX_IMAGES) return fail("image_rejected", `Tối đa ${MAX_IMAGES} ảnh`);
  for (const im of images) {
    if (!/^image\/(png|jpeg|webp|gif)$/.test(im?.media_type) || typeof im?.data !== "string" || im.data.length > MAX_IMAGE_B64)
      return fail("image_rejected", "Có ảnh quá lớn hoặc sai định dạng");
  }

  const model = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5-5";
  const content = [
    ...images.map((im) => ({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } })),
    { type: "text", text: prompt },
  ];
  let r: Response;
  try {
    r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: 16000,
        system: "Bạn là kỹ sư dự toán. Chỉ trả về MỘT đối tượng JSON hợp lệ theo đúng cấu trúc được yêu cầu, không kèm lời giải thích hay khối mã. Mọi số liệu là bản nháp để con người duyệt; không bịa số khi bản vẽ không có, hãy ghi vào danh sách câu hỏi.",
        messages: [{ role: "user", content }],
      }),
    });
  } catch (e) {
    return fail("network", "Không gọi được Anthropic: " + (e as Error).message, 502);
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = j?.error?.message ?? `HTTP ${r.status}`;
    const code = r.status === 429 || r.status === 529 ? "rate_limited"
      : /prompt is too long|too many tokens/i.test(msg) ? "prompt_too_large"
      : /image/i.test(msg) ? "image_rejected" : "upstream_" + r.status;
    return fail(code, msg, r.status === 429 ? 429 : 502);
  }
  if (j.stop_reason === "refusal") return fail("refused", "Claude từ chối đọc hồ sơ này");
  const text = (j.content ?? []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");

  // ghi lượt AI (không lưu ảnh) để GĐ theo dõi chi phí
  await sb.from("qs_audit_log").insert({
    user_id: u.user.id, role: prof.role, action: "AI bóc khối lượng",
    ref: model, detail: `${images.length} ảnh, ${j.usage?.input_tokens ?? "?"} in / ${j.usage?.output_tokens ?? "?"} out tokens`,
  });
  return out({ text, model, usage: j.usage ?? null });
});

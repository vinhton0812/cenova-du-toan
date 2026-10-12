# APP DỰ TOÁN CENOVA — bản web (Supabase)

Trang tĩnh, đăng nhập bằng email, dữ liệu trên project Supabase **cenova-du-toan** (`mihlrktmodxnqvxlbtdp`, Singapore).

## Thư mục
- `dist/` — **bản chạy được**, đưa nguyên thư mục này lên GitHub Pages / Vercel / Netlify. Có `index.html`, `assets/` (logo, font PDF), `tplb64/` (12 mẫu BG/HD/TT/NT).
- `src/supa.js` — lớp nối Supabase thay cho `window.claude` của bản claude.ai (db, user, downloads, assets, sample). Logic tính giá, xuất Excel/Word/PDF giữ nguyên mã v7 trong `../app/`.
- `src/web.css` — CSS màn đăng nhập + thanh tài khoản.
- `build.py` — dựng lại `dist/`: `python3 web/build.py` (chạy từ thư mục gốc gói).
- `../supabase/functions/analyze-drawing/index.ts` — Edge Function AI bóc khối lượng (đã deploy).

## Khoá
- Frontend chỉ chứa URL + khoá **publishable** (công khai theo thiết kế của Supabase). Mọi quyền do RLS.
- Khoá Anthropic: Supabase → Edge Functions → Secrets → thêm `ANTHROPIC_API_KEY` (anh tự nhập). Tuỳ chọn `ANTHROPIC_MODEL` (mặc định `claude-sonnet-5-5`). Không đưa khoá vào code/chat.

## Đưa lên GitHub Pages (miễn phí)
1. Tạo repo `cenova-du-toan` (Private nếu dùng gói GitHub trả phí; Pages với repo private cần GitHub Pro).
2. Đưa nội dung thư mục `dist/` lên nhánh `main` (gốc repo).
3. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
4. Địa chỉ: `https://vinhton0812.github.io/cenova-du-toan/`

## Cấu hình Supabase Auth (bắt buộc để link đăng nhập về đúng trang)
Supabase → Authentication → URL Configuration:
- **Site URL**: địa chỉ trang ở trên.
- **Redirect URLs**: thêm cùng địa chỉ (và `http://localhost:*` nếu cần thử trên máy).

## Email
Dịch vụ email có sẵn của Supabase chỉ gửi tới email thành viên tổ chức Supabase và giới hạn vài email/giờ. Để mời nhân viên: Authentication → Emails → SMTP Settings, cài SMTP công ty (Google Workspace / Zoho / Resend…). Tạm thời GĐ có thể tạo tài khoản ở Authentication → Users → *Add user* (đặt mật khẩu), nhân viên đăng nhập bằng email + mật khẩu.

## Quyền
- `tonly@cenovaasia.com`, `vinhton0812@gmail.com` tự nhận vai trò **Giám đốc** khi đăng nhập lần đầu.
- Người khác đăng nhập xong ở trạng thái *chưa được gán* (chỉ xem); GĐ gán vai trò ở màn **Người dùng**.
- Mọi người xem tất cả dự án; người lập, người được giao và GĐ sửa; chỉ GĐ xoá, ban hành bảng giá, gán vai trò.

## Ghi chú kỹ thuật
- Mỗi dự án lưu nguyên tài liệu gốc ở `qs_projects.doc` (nguồn chính cho giao diện); cột và `qs_estimate_lines`, `qs_project_members` được đồng bộ khi lưu để làm báo cáo.
- Kết quả AI luôn là bản nháp; điều khoản pháp lý thiếu dữ liệu giữ “……” và cần pháp chế duyệt.

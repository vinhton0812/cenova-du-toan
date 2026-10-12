#!/usr/bin/env python3
"""Dựng bản web APP DỰ TOÁN (trang tĩnh) vào web/dist từ mã nguồn app v7 + lớp nối Supabase.
Chạy: python3 web/build.py   (từ thư mục gốc CENOVA_APP_DU_TOAN)"""
import base64, hashlib, os, re, shutil, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
APP, WEB = ROOT / 'app', ROOT / 'web'
DIST = WEB / 'dist'
if DIST.exists(): shutil.rmtree(DIST)
(DIST / 'tplb64').mkdir(parents=True)
shutil.copytree(APP / 'assets', DIST / 'assets')
for f in sorted((APP / 'tpl').iterdir()):  # mẫu hồ sơ gốc → base64 như bản claude.ai đọc
    (DIST / 'tplb64' / (f.name + '.b64.txt')).write_text(base64.b64encode(f.read_bytes()).decode())

rd = lambda p: p.read_text(encoding='utf-8')
extra_css = rd(WEB / 'src' / 'web.css')
head = rd(APP / 'head.html').replace('</style>', extra_css + '\n</style>', 1)
# Bảng giá vốn KHÔNG đóng gói vào trang: data.js chỉ còn lấy từ Supabase sau khi đăng nhập
data_js = rd(APP / 'data.js')
assert data_js.startswith('const CAT_RAW=') and data_js.count('\n') <= 1, 'data.js đổi cấu trúc, kiểm tra lại build'
js = 'const CAT_RAW=window.__CAT_RAW__;\n' + '\n'.join(rd(APP / n) for n in ['app.js', 'ai.js', 'docgen.js', 'export.js', 'catalog.js', 'auth.js'])
assert '"1-02-001","Xây tường' not in js, 'bảng giá lọt vào bundle'
bundle = 'app.' + hashlib.sha1(js.encode()).hexdigest()[:10] + '.js'
(DIST / bundle).write_text(js, encoding='utf-8')
html = f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<link rel="icon" href="assets/logo.png">
{head}
</head>
<body>
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<script>
const APP_BUNDLE='{bundle}';
{rd(WEB / 'src' / 'supa.js')}
cnvBoot(()=>{{render();initDb();initAuth();}});
</script>
</body>
</html>
'''
(DIST / 'index.html').write_text(html, encoding='utf-8')
(DIST / '.nojekyll').write_text('')
print('OK', DIST / 'index.html', len(html.encode()) // 1024, 'KB +', bundle, len(js.encode()) // 1024, 'KB')

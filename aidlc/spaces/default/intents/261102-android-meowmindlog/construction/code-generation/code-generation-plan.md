# Code Generation Plan: MeowMindLog (PWA Offline)

## Architecture Overview
Ứng dụng MeowMindLog được xây dựng theo chuẩn Progressive Web App (PWA) Offline-First, sử dụng Vanilla HTML5, CSS hiện đại (Design System HSL, Responsive, Dark/Light Theme) và JavaScript ES6 Modules kết hợp IndexedDB Storage.

## Implementation Steps

- [x] **Bước 1: Thiết kế giao diện khung ứng dụng & Design System (HTML5 & CSS)**
  - `index.html`: Cấu trúc ngữ nghĩa (Semantic HTML5), hệ thống Tab (Timeline hôm nay, Lưới nhiệt Heatmap cả năm, Thống kê & Sao lưu), modal thêm việc, modal backup.
  - `index.css`: Design token (Warm Cozy Cat palette), Dark/Light theme, Glassmorphism, Responsive Mobile-first, hiệu ứng hover/bouncy.

- [x] **Bước 2: Xây dựng tầng lưu trữ dữ liệu cục bộ (Storage Engine)**
  - `app.js (StorageModule)`: Sử dụng IndexedDB để lưu trữ không giới hạn bản ghi nhật ký, hỗ trợ truy vấn theo ngày, danh mục, và thống kê cả năm.

- [x] **Bước 3: Xây dựng tính năng Ghi chép & Dòng thời gian (Timeline View)**
  - Thêm, sửa, xóa việc đã làm với thời gian, category, ghi chú, mood tag.
  - Bộ chọn ngày và bộ lọc danh mục trực quan.

- [x] **Bước 4: Xây dựng Lưới nhiệt hoạt động cả năm phong cách GitHub (Yearly Heatmap Grid)**
  - Sinh lưới 52 tuần x 7 ngày cho năm hiện tại.
  - Tính toán 4 cấp độ màu dựa trên số việc hoàn thành.
  - Popup xem nhanh chi tiết ngày khi click vào ô và tính toán Streak (chuỗi ngày liên tục).

- [x] **Bước 5: Xây dựng tính năng Sao lưu / Xuất nhập dữ liệu (Backup & Export/Import)**
  - Export dữ liệu ra file JSON & CSV.
  - Import file JSON với kiểm tra tính toàn vẹn (Schema validation) và tùy chọn Merge/Overwrite.

- [x] **Bước 6: Cấu hình PWA (Service Worker & Manifest)**
  - `manifest.json`: Khai báo PWA (standalone, icon, theme-color).
  - `sw.js`: Service Worker cache tài nguyên tĩnh, đảm bảo chạy 100% offline không cần internet.

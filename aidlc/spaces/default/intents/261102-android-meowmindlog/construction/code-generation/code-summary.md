# Tóm Tắt Mã Nguồn Xây Dựng: MeowMindLog (PWA Offline)

## Các Tệp Đã Xây Dựng
1. [index.html](file:///e:/Workspace/LEARN/MeowMindLog/index.html): Khung giao diện HTML5 ngữ nghĩa, responsive cho điện thoại và máy tính, hệ thống tab chuyển đổi, form thêm việc, bộ chọn ngày, modal chỉnh sửa, giao diện Lưới nhiệt 52 tuần.
2. [index.css](file:///e:/Workspace/LEARN/MeowMindLog/index.css): Hệ thống phong cách Cozy Cat hiện đại, hỗ trợ Dark / Light theme, tokens HSL, lưới GitHub Heatmap 52 tuần x 7 ngày, hiệu ứng micro-animations.
3. [app.js](file:///e:/Workspace/LEARN/MeowMindLog/app.js): Toàn bộ logic ứng dụng (StorageManager với IndexedDB/LocalStorage, TaskManager, HeatmapRenderer & Streak Calculator, BackupManager Export/Import JSON & CSV, ThemeManager, PWA lifecycle).
4. [sw.js](file:///e:/Workspace/LEARN/MeowMindLog/sw.js): Service Worker điều phối bộ nhớ đệm Cache API, đảm bảo ứng dụng chạy 100% khi ngắt mạng hoàn toàn.
5. [manifest.json](file:///e:/Workspace/LEARN/MeowMindLog/manifest.json): Khai báo PWA chuẩn (standalone mode, portrait, theme color, icons).
6. [icons/icon.svg](file:///e:/Workspace/LEARN/MeowMindLog/icons/icon.svg): Biểu tượng mèo đáng yêu MeowMindLog kèm dấu chân năng suất màu xanh ngọc.

## Yêu Cầu Đã Hiện Thực
- `FR1`: Quản lý nhật ký công việc (Thêm, Sửa, Xóa, Đánh dấu hoàn thành, Ghi chú, Phân loại, Mood tag, Timeline ngày).
- `FR2`: Lọc và Lịch sử ngày (Bộ chọn ngày trước/sau/hôm nay, Lọc theo 5 Category).
- `FR3`: Thống kê năng suất ngày (Thanh tiến độ, Lời chào mèo động khích lệ).
- `FR4`: Lưới nhiệt cả năm kiểu GitHub (52 tuần x 7 ngày, 4 cấp độ màu, Chuỗi ngày liên tục Streak, Kỷ lục chuỗi, Bấm vào ô ngày để xem chi tiết).
- `FR5`: Xuất / Nhập dữ liệu (Backup JSON, Import JSON có kiểm tra cấu trúc và hỏi Gộp/Ghi đè, Xuất CSV cho Excel).
- `FR6`: Hệ thống biểu đồ thống kê trực quan (Biểu đồ 12 tháng, Biểu đồ thứ trong tuần, Tỷ lệ danh mục, Phân tích cảm xúc, Chỉ số KPIs).
- `NFR1 - NFR5`: 100% Offline, không tốn dung lượng ổ C, không cần cài Android Studio hay môi trường nặng nề.

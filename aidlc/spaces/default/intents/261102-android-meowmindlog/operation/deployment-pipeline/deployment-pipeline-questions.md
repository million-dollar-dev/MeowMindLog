# Câu Hỏi & Quyết Định Deployment Pipeline - MeowMindLog

## Sources
- [desc] Khởi tạo ứng dụng Android offline MeowMindLog ghi chép nhật ký công việc đã hoàn thành trong ngày
- [scope] express
- [assumption] Ứng dụng PWA hoạt động offline 100%, triển khai qua static hosting / GitHub Pages và hỗ trợ chạy local server

## Assumptions & Open Questions
### Assumptions
- [assumption:A1] Nền tảng hosting chính là GitHub Pages hoàn toàn miễn phí, hỗ trợ giao thức HTTPS cần thiết cho Progressive Web App (PWA) và Service Worker.
- [assumption:A2] Quy trình Continuous Deployment kích hoạt tự động mỗi khi có commit mới đẩy lên nhánh `main`.
- [assumption:A3] Pipeline tích hợp bước kiểm tra cú pháp tự động (`node --check app.js`, `node --check sw.js`) trước khi tiến hành đóng gói và triển khai.
- [assumption:A4] Môi trường cục bộ sử dụng bất kỳ HTTP static server nào (`npx serve .`, `python -m http.server`, hoặc Live Server) mà không cần build step.

### Open Questions
- None.

## Review
Các giả định trên phù hợp hoàn toàn với phạm vi `express` gọn nhẹ, zero-build và triết lý offline-first của ứng dụng MeowMindLog.

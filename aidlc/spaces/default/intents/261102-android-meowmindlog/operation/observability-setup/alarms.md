# Định Nghĩa Cảnh Báo & Xử Lý Sự Cố (Alarms & Alerting) - MeowMindLog

## 1. Cảnh Báo Phía Người Dùng & Trình Duyệt (Client-Side Alarms)

| Mã Cảnh Báo | Mức Độ | Điều Kiện Kích Hoạt | Hành Động Xử Lý Tự Động |
| :--- | :--- | :--- | :--- |
| **ALM-STORAGE-QUOTA** | Warning | Dung lượng lưu trữ IndexedDB vượt quá 80% hạn ngạch trình duyệt cấp | Hiển thị thông báo khuyến nghị người dùng tải bản sao lưu JSON và dọn dẹp các bản ghi cũ |
| **ALM-IDB-UNAVAILABLE** | High | Trình duyệt chặn IndexedDB (chế độ ẩn danh nghiêm ngặt hoặc lỗi phân vùng) | Tự động kích hoạt cơ chế Fallback sang `LocalStorage`, hiển thị thông báo nhẹ nhàng cho người dùng |
| **ALM-IMPORT-CORRUPT** | High | Người dùng tải lên file JSON sao lưu bị sai cấu trúc hoặc không parse được | Ngăn chặn quá trình ghi đè, bảo toàn 100% dữ liệu hiện tại, hiển thị thông báo lỗi chi tiết |
| **ALM-SW-REG-FAIL** | Medium | Trình duyệt không hỗ trợ Service Worker hoặc đăng ký thất bại | Ứng dụng vẫn chạy bình thường ở chế độ web thông thường và ghi nhật ký cảnh báo vào console |

---

## 2. Cảnh Báo Quy Trình CI/CD (GitHub Actions Pipeline Alarms)

- **Cảnh báo thất bại Build/Test**: Gửi email thông báo tự động từ GitHub tới lập trình viên khi có commit trên nhánh `main` không vượt qua được bước kiểm tra cú pháp (`node --check`).
- **Cảnh báo thất bại Triển khai Pages**: Báo cáo sự cố khi GitHub Pages gặp lỗi phân quyền hoặc CDN timeout.

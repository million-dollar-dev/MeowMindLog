# MeowMindLog 🐾

> **Ứng dụng ghi chép nhật ký công việc & thói quen hằng ngày — Hoạt động 100% Offline (PWA), nhẹ nhàng, riêng tư và không phụ thuộc bất kỳ backend nào.**

[![Deploy MeowMindLog PWA](https://github.com/million-dollar-dev/MeowMindLog/actions/workflows/deploy.yml/badge.svg)](https://github.com/million-dollar-dev/MeowMindLog/actions/workflows/deploy.yml)

---

## ✨ Điểm Nổi Bật

- 📱 **Offline-First Progressive Web App (PWA)**: Cài đặt trực tiếp lên điện thoại Android như một ứng dụng Native, mở toàn màn hình, tải tức thì (<50ms) ngay cả khi không có kết nối Internet.
- 🪶 **Siêu Nhẹ (Zero-Build & Zero-SDK)**: Tổng dung lượng toàn bộ ứng dụng chỉ **~77 KB**, không tốn dung lượng bộ nhớ máy, không cần cài đặt Android Studio hay máy ảo nặng nề.
- 🟩 **Lưới Nhiệt Hoạt Động (52-Week Activity Heatmap)**: Ma trận đóng góp phong cách GitHub giúp theo dõi thói quen liên tục trong năm, tự động tính chuỗi ngày (Streak) và kỷ lục cá nhân.
- 📊 **Thống Kê Trực Quan (Analytics)**: Biểu đồ năng suất 12 tháng, thống kê theo thứ trong tuần, tỷ lệ danh mục và phân bổ tâm trạng.
- 🔒 **Bảo Mật & Riêng Tư Tuyệt Đối**: Dữ liệu lưu cục bộ trong `IndexedDB` của thiết bị người dùng. Không thu thập thông tin, không gửi dữ liệu ra máy chủ bên ngoài.
- 💾 **Sao Lưu Đa Dạng**: Xuất / Nhập bản sao lưu JSON an toàn với bộ kiểm tra cấu trúc, xuất báo cáo CSV tương thích Excel và Google Sheets.
- 🌓 **Giao Diện Tối Giản & Thanh Lịch**: Thiết kế hiện đại với font Plus Jakarta Sans, hỗ trợ cả 2 chế độ Sáng (Light) và Tối (Dark).

---

## 🛠️ Công Nghệ Sử Dụng

- **Cấu trúc**: Semantic HTML5
- **Giao diện**: Vanilla CSS (Custom Design System, Responsive Mobile-First, HSL Tokens)
- **Logic**: Vanilla JavaScript (ES6 Modules, Zero external dependencies)
- **Cơ sở dữ liệu**: W3C `IndexedDB` (với fallback an toàn sang `LocalStorage`)
- **Ngoại tuyến**: W3C `Service Worker` (Chiến lược Cache-First with Network Fallback)
- **CI/CD**: GitHub Actions tự động kiểm tra cú pháp và xuất bản lên GitHub Pages

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Trải nghiệm trực tiếp trên máy tính
Bạn có thể mở trực tiếp file `index.html` bằng bất kỳ trình duyệt hiện đại nào (Chrome, Edge, Firefox, Safari).

### 2. Khởi chạy Local Server (Khuyên dùng)
```bash
# Khởi chạy bằng npx serve:
npx serve .

# Hoặc sử dụng Python có sẵn:
python -m http.server 8000
```
Truy cập: `http://localhost:3000` (hoặc `http://localhost:8000`).

### 3. Cài đặt thành App trên điện thoại Android
1. Đảm bảo điện thoại và máy tính kết nối chung mạng Wi-Fi.
2. Mở trình duyệt Chrome trên điện thoại và truy cập địa chỉ IP máy tính (ví dụ: `http://192.168.1.x:3000`).
3. Bấm vào nút **Cài đặt ứng dụng** trên thanh tiêu đề hoặc mở menu trình duyệt Chrome chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
4. Ứng dụng MeowMindLog sẽ xuất hiện trên màn hình điện thoại và hoạt động độc lập, mượt mà không cần mạng.

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phát triển mã nguồn mở dưới giấy phép MIT. Toàn bộ dữ liệu nhật ký thuộc quyền sở hữu riêng tư tuyệt đối của người dùng.
# MeowMindLog 🐾

> **Ứng dụng ghi chép nhật ký công việc & thói quen hằng ngày — Hoạt động 100% Offline (PWA), nhẹ nhàng, riêng tư và không phụ thuộc bất kỳ backend nào.**

[![Deploy MeowMindLog PWA](https://github.com/million-dollar-dev/MeowMindLog/actions/workflows/deploy.yml/badge.svg)](https://github.com/million-dollar-dev/MeowMindLog/actions/workflows/deploy.yml)
[![AI-DLC Powered](https://img.shields.io/badge/Architecture-100%25%20AI--DLC-059669?style=flat&logo=openai&logoColor=white)](https://github.com/million-dollar-dev/MeowMindLog)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🤖 Tuyên Ngôn Kiến Tạo 100% Bằng AI-DLC

Toàn bộ mã nguồn, cấu trúc dữ liệu, tài liệu kiến trúc, hệ thống kiểm thử và quy trình CI/CD của **MeowMindLog** được **lên kế hoạch, thiết kế và lập trình hoàn toàn bằng AI-DLC (AI-Driven Development Life Cycle)**.

Dự án tuân thủ nghiêm ngặt 4 giai đoạn cốt lõi của AI-DLC:
1. 💡 **Ideation (Khởi tạo ý tưởng)**: Định hình triết lý sản phẩm tối giản, không gây xao nhãng, tôn trọng quyền riêng tư và hoạt động độc lập không cần server.
2. 📐 **Inception (Thiết kế & Kiến trúc)**: Hoạch định kiến trúc dữ liệu kép IndexedDB kết hợp LocalStorage dự phòng, thiết kế hợp đồng dữ liệu Offline-First PWA và chuẩn hóa Service Worker.
3. ⚡ **Construction (Xây dựng & Tinh chỉnh)**: Sinh mã nguồn giao diện (HTML5, Vanilla CSS, ES6 JS), xây dựng thuật toán đường cong Bezier cho biểu đồ xu hướng hàng ngày, ma trận nhiệt 52 tuần GitHub-style, cùng bộ kiểm tra cú pháp tự động.
4. 🚀 **Operation (Vận hành & Phát hành)**: Thiết lập pipeline CI/CD GitHub Actions, triển khai tự động lên GitHub Pages và cấu hình giám sát nhật ký vận hành.

---

## ✨ Điểm Nổi Bật

- 📱 **Offline-First Progressive Web App (PWA)**: Cài đặt trực tiếp lên điện thoại Android, iOS, máy tính như một ứng dụng Native, mở toàn màn hình, tải tức thì (<50ms) ngay cả khi không có kết nối Internet.
- 🪶 **Siêu Nhẹ (Zero-Build & Zero-SDK)**: Tổng dung lượng toàn bộ ứng dụng chỉ **~80 KB**, không tốn tài nguyên máy, không cần build step cồng kềnh.
- 📈 **Biểu Đồ Xu Hướng Hàng Ngày (Daily Trend Line Chart)**: Biểu đồ đường cong Bezier tương tác mượt mà với hiệu ứng gradient, trực quan hóa tần suất công việc dao động lên xuống theo 7, 14 và 30 ngày qua kèm tooltip và chỉ số KPI.
- 🟩 **Lưới Nhiệt Hoạt Động 52 Tuần (GitHub-Style Activity Heatmap)**: Ma trận đóng góp với nhãn tháng và thứ rõ ràng, phân cấp màu sắc chuẩn xác theo 5 cấp độ (0, 1, 2, 3-4, 5+ việc), tự động tính chuỗi ngày liên tục (Streak).
- 📊 **Thống Kê Trực Quan (Analytics Engine)**: Biểu đồ năng suất 12 tháng, thống kê theo các thứ trong tuần, tỷ lệ danh mục và phân bổ tâm trạng.
- 🔒 **Bảo Mật & Riêng Tư Tuyệt Đối**: Dữ liệu lưu cục bộ trong `IndexedDB` của thiết bị người dùng. Không thu thập thông tin, không gửi dữ liệu ra bất kỳ máy chủ bên ngoài nào.
- 💾 **Sao Lưu Đa Dạng**: Xuất / Nhập bản sao lưu JSON an toàn với bộ kiểm tra cấu trúc, xuất báo cáo CSV tương thích Excel và Google Sheets.
- 🌓 **Giao Diện Tối Giản & Thanh Lịch**: Thiết kế hiện đại với font Plus Jakarta Sans, hỗ trợ chuyển đổi mượt mà giữa chế độ Sáng (Light) và Tối (Dark).

---

## 🛠️ Công Nghệ Sử Dụng

- **Cấu trúc**: Semantic HTML5
- **Giao diện**: Vanilla CSS (Custom Design System, Mobile-First, HSL & Slate/Emerald Color Tokens)
- **Logic**: Vanilla JavaScript (ES6 Modules, Zero external dependencies)
- **Cơ sở dữ liệu**: W3C `IndexedDB` (với fallback an toàn sang `LocalStorage`)
- **Ngoại tuyến**: W3C `Service Worker` (Chiến lược Cache-First with Network Fallback)
- **CI/CD**: GitHub Actions tự động kiểm tra cú pháp và xuất bản lên GitHub Pages
- **Phương pháp luận**: AI-DLC (AI-Driven Development Life Cycle)

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### 1. Trải nghiệm trực tuyến
Truy cập ngay tại: **[https://million-dollar-dev.github.io/MeowMindLog/](https://million-dollar-dev.github.io/MeowMindLog/)**

### 2. Khởi chạy Local Server
```bash
# Khởi chạy bằng npx serve:
npx serve .

# Hoặc sử dụng Python có sẵn:
python -m http.server 8000
```
Truy cập: `http://localhost:3000` (hoặc `http://localhost:8000`).

### 3. Cài đặt thành App trên điện thoại (PWA)
1. Mở trang web trên trình duyệt điện thoại (Chrome trên Android, Safari trên iOS).
2. Nhấn vào nút **Cài đặt ứng dụng** trên thanh tiêu đề hoặc mở menu trình duyệt chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
3. Ứng dụng MeowMindLog sẽ xuất hiện trên màn hình điện thoại và hoạt động độc lập, mượt mà không cần mạng.

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phát triển mã nguồn mở dưới giấy phép MIT. Toàn bộ dữ liệu nhật ký thuộc quyền sở hữu riêng tư tuyệt đối của người dùng.
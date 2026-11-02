# Hướng Dẫn Build & Khởi Chạy Ứng Dụng: MeowMindLog

## 1. Bản Chất Dự Án
MeowMindLog là ứng dụng **Progressive Web App (PWA) Offline-First**, được tối ưu để hoạt động trực tiếp trên trình duyệt hoặc cài đặt thành ứng dụng độc lập trên điện thoại Android mà **không đòi hỏi bất kỳ bước build phức tạp, npm install hay cài Android SDK nặng nề**.

## 2. Cách Khởi Chạy Trên Máy Tính
- **Cách 1 (Mở trực tiếp)**:
  Mở tệp `index.html` bằng bất kỳ trình duyệt nào (Google Chrome, Microsoft Edge, Mozilla Firefox, Cốc Cốc).
- **Cách 2 (Local Web Server)**:
  Nếu muốn test đầy đủ Service Worker (PWA install prompt):
  ```bash
  # Chạy bằng Node.js có sẵn trên máy:
  npx -y serve .
  # Hoặc mở cổng 3000:
  # Mở trình duyệt truy cập: http://localhost:3000
  ```

## 3. Cách Cài Đặt Lên Điện Thoại Android (Thành App Độc Lập)
1. Mở trình duyệt Chrome hoặc Edge trên điện thoại Android của bạn.
2. Truy cập vào ứng dụng (hoặc qua link local IP / GitHub Pages).
3. Nhấn vào menu trình duyệt (dấu 3 chấm ở góc trên) hoặc nút **"📲 Cài đặt"** trên thanh tiêu đề ứng dụng.
4. Chọn **"Thêm vào màn hình chính" (Add to Home screen / Install app)**.
5. Biểu tượng chú mèo ta xám trắng vằn đen **MeowMindLog** sẽ xuất hiện trên màn hình chính của điện thoại. Mở lên sẽ chạy toàn màn hình độc lập 100% offline, không có thanh địa chỉ web.

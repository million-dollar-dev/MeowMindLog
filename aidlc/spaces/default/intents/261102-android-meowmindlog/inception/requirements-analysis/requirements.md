# Yêu Cầu Kỹ Thuật Dự Án (Requirements Document): MeowMindLog

## 1. Intent Analysis (Phân Tích Mục Tiêu)
Mục tiêu là xây dựng một ứng dụng Android mang tên **MeowMindLog**, hoạt động **offline 100%**, giúp người dùng ghi chép, theo dõi và nhìn lại tất cả các công việc/hoạt động mình đã hoàn thành trong một ngày. Ứng dụng mang phong cách nhẹ nhàng, tinh gọn (cat-inspired cozy theme), giúp tạo động lực và theo dõi năng suất cá nhân mà không bị phân tâm bởi quảng cáo hoặc yêu cầu đăng nhập tài khoản.

## 2. Functional Requirements (Yêu Cầu Chức Năng)

### FR1: Quản lý Bản ghi Nhật ký Công việc (Daily Activity Logging)
- **FR1.1**: Người dùng có thể tạo một bản ghi công việc mới với các trường:
  - Tiêu đề công việc (Bắt buộc).
  - Ghi chú / Chi tiết mô tả (Tùy chọn).
  - Mốc thời gian hoàn thành (Giờ:Phút, mặc định là thời điểm hiện tại).
  - Phân loại / Danh mục (Ví dụ: Work, Study, Life, Health, Hobby).
  - Cảm xúc / Mood tag đi kèm (Ví dụ: Hài lòng, Mệt mỏi, Hào hứng, Bình thường).
- **FR1.2**: Người dùng có thể xem danh sách các việc đã làm trong ngày dưới dạng Timeline (dòng thời gian trực quan).
- **FR1.3**: Người dùng có thể chỉnh sửa nội dung bất kỳ bản ghi nào đã lưu.
- **FR1.4**: Người dùng có thể xóa một bản ghi với hộp thoại xác nhận an toàn.

### FR2: Xem Lịch Sử & Lọc Dữ Liệu (History & Filtering)
- **FR2.1**: Hỗ trợ chuyển đổi nhanh giữa các ngày (Hôm nay, Hôm qua, hoặc chọn ngày bất kỳ trên Calendar picker).
- **FR2.2**: Lọc danh sách công việc theo Danh mục (Category filter) để xem riêng các việc đã làm cho từng mục đích.

### FR3: Thống Kê Năng Suất Trong Ngày (Productivity Summary)
- **FR3.1**: Hiển thị tổng số công việc đã hoàn thành trong ngày được chọn.
- **FR3.2**: Hiển thị thông điệp khích lệ thân thiện kèm biểu tượng chú mèo MeowMind khi hoàn thành mục tiêu trong ngày.

### FR4: Màn Hình Lưới Nhiệt Cả Năm Phong Cách GitHub (Yearly Activity Heatmap)
- **FR4.1**: Hiển thị màn hình Lưới nhiệt hoạt động (Activity Heatmap Grid) mô phỏng GitHub contribution graph với 52 tuần x 7 ngày cho cả năm (365 ngày).
- **FR4.2**: Tự động tính toán và hiển thị 4 cấp độ màu (Color Intensity Levels) theo số lượng công việc hoàn thành trong ngày (0 việc, 1-2 việc, 3-4 việc, 5+ việc).
- **FR4.3**: Cho phép người dùng chạm (click) vào từng ô ngày trên Heatmap để xem nhanh popup số việc đã làm và nút chuyển nhanh đến trang xem chi tiết ngày đó.
- **FR4.4**: Thống kê chuỗi ngày hoạt động liên tục (Current Streak, Longest Streak) và tổng số công việc đã hoàn thành trong năm.

### FR5: Sao Lưu & Phục Hồi Dữ Liệu (Data Export & Import)
- **FR5.1**: Xuất toàn bộ dữ liệu nhật ký công việc (Tasks, Categories, Moods, Timestamps) ra tệp JSON chuẩn thông qua Android Storage Access Framework (SAF) để lưu vào bộ nhớ máy hoặc chia sẻ sang thiết bị khác.
- **FR5.2**: Nhập dữ liệu từ tệp JSON sao lưu trước đó, có cơ chế xác thực cấu trúc (schema validation) và tùy chọn gộp thêm (Merge) hoặc ghi đè toàn bộ (Overwrite).
- **FR5.3**: Hỗ trợ xuất dữ liệu ra tệp CSV / Text để người dùng dễ dàng mở và xem trên máy tính hoặc nhập vào các công cụ bảng tính/ghi chú khác (Excel, Notion).

### FR6: Hệ Thống Thống Kê & Biểu Đồ Trực Quan (Analytics & Visual Charts)
- **FR6.1**: Biểu đồ phân bổ danh mục công việc (Category Distribution Chart) dạng thanh tỷ lệ phần trăm trực quan (Work, Study, Life, Health, Pet).
- **FR6.2**: Biểu đồ năng suất theo 12 tháng trong năm (Monthly Productivity Trend Chart) hiển thị tiến độ tăng trưởng công việc qua các tháng.
- **FR6.3**: Biểu đồ ngày năng suất nhất trong tuần (Day of Week Activity Chart từ Thứ 2 đến Chủ nhật) giúp xác định thói quen làm việc.
- **FR6.4**: Thống kê tâm trạng và chỉ số năng suất chính (KPIs: Tỷ lệ hoàn thành, Tổng thời gian, Tâm trạng chủ đạo).

## 3. Non-Functional Requirements (Yêu Cầu Phi Chức Năng)

- **NFR1 (Offline-First & PWA Architecture)**: Hoạt động 100% offline không cần internet nhờ Service Worker cache và cơ sở dữ liệu cục bộ IndexedDB / LocalStorage. Có Web App Manifest để cài đặt trực tiếp lên điện thoại Android thành ứng dụng độc lập (Add to Home Screen / Install as App).
- **NFR2 (Siêu Nhẹ & Hiệu Năng Cao)**: Dung lượng source code cực nhẹ (< 1MB), không tốn dung lượng ổ đĩa `C:\`, không cần cài Android SDK hay Emulator. Khởi chạy tức thì trong trình duyệt.
- **NFR3 (Privacy & Security)**: Toàn bộ dữ liệu nằm cục bộ trong trình duyệt/thiết bị của người dùng, không gửi bất kỳ dữ liệu cá nhân nào lên internet.
- **NFR4 (Modern Cozy Meow UX & Rich Aesthetics)**: Giao diện thiết kế theo phong cách hiện đại (Material 3 tokens, HSL custom palette), tông màu ấm áp thân thiện (Cozy Cat theme), mượt mà, hỗ trợ Dark / Light Mode tự động hoặc chuyển đổi thủ công.
- **NFR5 (Maintainability & Clean Web Architecture)**: Cấu trúc code mô-đun hóa rõ ràng (Storage, Models, UI Components, Heatmap Engine), dễ bảo trì và mở rộng.

## 4. Constraints (Ràng Buộc Kỹ Thuật)
- Nền tảng: Progressive Web App (PWA) hỗ trợ cài đặt trên Android (Chrome, Edge, Samsung Internet) và máy tính.
- Công nghệ cốt lõi: HTML5 Semantic, Vanilla CSS (Design tokens, Glassmorphism, Responsive Mobile-first), Vanilla JavaScript (ES Modules, IndexedDB API).
- Không yêu cầu cài đặt môi trường phức tạp (Node.js/Android Studio/Emulator) trên máy tính cá nhân.
- Chuẩn PWA: `manifest.json` đầy đủ icon, theme color, standalone display và `sw.js` (Service Worker) để offline caching.

## 5. Assumptions (Giả Định)
- Người dùng có thể sử dụng ứng dụng trên trình duyệt máy tính để xem trước ngay, hoặc mở link trên điện thoại Android và bấm "Cài đặt ứng dụng" để dùng lâu dài.
- Dữ liệu lưu trong IndexedDB cục bộ của thiết bị. Khi muốn chuyển máy, người dùng dùng tính năng Export JSON (FR5).

## 6. Out of Scope (Ngoài Phạm Vi Phiên Bản Này)
- Đăng ký/đăng nhập tài khoản trực tuyến qua máy chủ.
- Đồng bộ đám mây thời gian thực (Real-time Cloud Sync).
- Chia sẻ bài viết lên mạng xã hội.

## 7. Open Questions (Câu Hỏi Mở)
- None. (Các yêu cầu cốt lõi cho phiên bản offline ban đầu đã được định hình rõ ràng).

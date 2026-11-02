# Requirements Analysis Questions: MeowMindLog

## Initial Description
Khởi tạo ứng dụng Android offline MeowMindLog bằng Kotlin, Jetpack Compose, Room Database để ghi chép nhật ký công việc đã hoàn thành trong ngày.

## Questions & Answers

### Q1: Trọng tâm giao diện chính của ứng dụng
Bạn muốn màn hình chính (Home) của MeowMindLog hiển thị như thế nào?
- A. Danh sách các việc đã làm hôm nay theo dạng Timeline (dòng thời gian có giờ giấc)
- B. Danh sách thẻ công việc dạng Card phân loại theo Category (Công việc, Cá nhân, Thói quen)
- C. Màn hình tối giản dạng Check-list công việc trong ngày
- D. Tích hợp lịch (Calendar) ở trên đầu và danh sách việc ở dưới
- X. Other (please specify)
[Answer]: A

### Q2: Các trường thông tin cho mỗi bản ghi nhật ký
Mỗi việc đã làm cần lưu những thông tin nào?
- A. Tiêu đề, Ghi chú chi tiết, Thời gian hoàn thành, Danh mục (Category), Cảm xúc/Tâm trạng (Mood tag)
- B. Chỉ cần Tiêu đề và Thời gian
- C. Tiêu đề, Thời gian bắt đầu - kết thúc, Mức độ ưu tiên
- X. Other (please specify)
[Answer]: A

### Q3: Chế độ lưu trữ và sao lưu
Dữ liệu nhật ký được xử lý ra sao?
- A. Hoàn toàn cục bộ trên máy qua Room SQLite, không cần internet
- B. Lưu cục bộ và hỗ trợ tính năng xuất/nhập file JSON dự phòng (Backup/Export)
- X. Other (please specify)
[Answer]: B

### Q4: Màn hình trực quan hóa năng suất & Heatmap
Người dùng yêu cầu màn hình thống kê dạng lưới nhiệt theo năm (GitHub style heatmap):
- A. Tích hợp màn hình Heatmap 52 tuần x 7 ngày, màu đậm dần theo số việc đã làm trong ngày (0, 1-2, 3-4, 5+ việc), cho phép bấm vào từng ô để xem chi tiết
- X. Other (please specify)
[Answer]: A

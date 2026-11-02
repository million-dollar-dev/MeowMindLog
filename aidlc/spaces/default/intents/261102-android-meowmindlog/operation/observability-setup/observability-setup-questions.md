# Câu Hỏi & Quyết Định Thiết Lập Giám Sát (Observability Setup) - MeowMindLog

## Sources
- [desc] Khởi tạo ứng dụng Android offline MeowMindLog ghi chép nhật ký công việc đã hoàn thành trong ngày
- [scope] express
- [assumption] Ứng dụng PWA offline-first yêu cầu giám sát tài nguyên lưu trữ cục bộ (IndexedDB), vòng đời Service Worker và pipeline CI/CD

## Assumptions & Open Questions
### Assumptions
- [assumption:A1] Vì ứng dụng hoạt động 100% offline trên thiết bị của người dùng và không gửi dữ liệu về máy chủ từ xa nhằm đảm bảo tính riêng tư tuyệt đối, hệ thống giám sát tập trung vào kiểm tra sức khỏe trong ứng dụng (In-App Diagnostics), giám sát hạn ngạch bộ nhớ (`navigator.storage.estimate`) và giám sát trạng thái pipeline GitHub Actions.
- [assumption:A2] Các tín hiệu vàng (Golden Signals) cho PWA offline bao gồm: Tỷ lệ sẵn sàng Service Worker (Availability), Tỷ lệ ghi thành công IndexedDB (Correctness), Thời gian phản hồi thao tác CRUD (Latency <10ms), và Tỷ lệ chiếm dụng bộ nhớ (Saturation).
- [assumption:A3] Các chỉ số SLO/SLI được định lượng cụ thể: 99.99% phiên làm việc tải tức thì từ Cache Storage, 100% dữ liệu không thất thoát qua cơ chế transaction an toàn của IndexedDB.

### Open Questions
- None.

## Review
Các giải pháp giám sát này đảm bảo quyền riêng tư người dùng (không theo dõi trái phép), đồng thời cung cấp đầy đủ công cụ chẩn đoán khi người dùng cần hỗ trợ kỹ thuật hoặc sao lưu dữ liệu.

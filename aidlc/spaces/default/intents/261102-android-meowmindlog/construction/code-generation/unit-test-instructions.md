# Hướng Dẫn Kiểm Thử (Unit & Integration Test Instructions)

## Phạm Vi Kiểm Thử
Ứng dụng **MeowMindLog (Offline PWA)** là ứng dụng web phi tập trung chạy trực tiếp trên trình duyệt hoặc cài đặt thành ứng dụng độc lập trên điện thoại Android.

## Quy Trình Kiểm Thử Thủ Công & Tự Động

### 1. Kiểm Thử Trực Quan & Chức Năng (End-to-End Visual Verification)
1. Mở file [index.html](file:///e:/Workspace/LEARN/MeowMindLog/index.html) trực tiếp trên trình duyệt (Chrome, Edge hoặc Firefox).
2. **Kiểm tra Tab Hôm Nay**:
   - Thêm một việc mới qua nút "Thêm Việc Đã Làm": điền tiêu đề, chọn category, chọn mood, lưu bản ghi.
   - Kiểm tra thanh tiến độ (Progress bar) tăng phần trăm và lời chào động thay đổi.
   - Thử bấm checkbox hoàn thành/hủy hoàn thành, sửa việc và xóa việc.
   - Thử điều hướng ngày (Nút Ngày trước, Ngày sau, Hôm nay).
3. **Kiểm tra Tab Lưới Nhiệt (Yearly Heatmap Grid - GitHub Style)**:
   - Chuyển sang tab "Lưới Nhiệt (Năm)".
   - Kiểm tra ma trận 52 tuần x 7 ngày hiển thị đủ các ô với các cấp độ màu khác nhau (xanh nhạt đến xanh ngọc đậm).
   - Click vào một ô ngày bất kỳ trên lưới: kiểm tra thông báo và nhảy tự động về tab Hôm nay của ngày đó.
   - Kiểm tra các thẻ thống kê: Chuỗi ngày liên tục (Current Streak), Kỷ lục chuỗi (Longest Streak), Tổng số ngày có việc.
4. **Kiểm tra Tab Sao Lưu & Xuất Nhập**:
   - Bấm "Tải File JSON": kiểm tra file `MeowMindLog-Backup-YYYY-MM-DD.json` được tải về máy an toàn.
   - Bấm "Tải File CSV": kiểm tra file CSV có thể mở bằng Excel/Notion.
   - Chọn file JSON vừa xuất để nhập lại: kiểm tra hộp thoại hỏi Gộp (Merge) hoặc Ghi đè (Overwrite).
5. **Kiểm thử Offline & PWA**:
   - Mở DevTools (F12) -> Application -> Service Workers: Kiểm tra Service Worker đã đăng ký trạng thái `Active`.
   - Chuyển DevTools -> Network sang chế độ `Offline`.
   - Tải lại trang (F5): Ứng dụng vẫn mở lên và hoạt động mượt mà 100% không báo lỗi kết nối.

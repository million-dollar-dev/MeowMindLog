# Truy Vấn Nhật Ký & Lệnh Chẩn Đoán (Log Queries & Diagnostics) - MeowMindLog

## 1. Các Lệnh Chẩn Đoán Trực Tiếp Trên Trình Duyệt (Client DevTools Queries)

Các kỹ sư và người dùng kỹ thuật có thể mở **F12 / Web Developer Console** trên máy tính hoặc kết nối remote debug thiết bị Android qua `chrome://inspect` để chạy các câu lệnh chẩn đoán nhanh:

### Truy vấn 1: Kiểm tra dung lượng bộ nhớ đã sử dụng
```javascript
navigator.storage.estimate().then(({usage, quota}) => {
  const usedMB = (usage / (1024 * 1024)).toFixed(2);
  const totalMB = (quota / (1024 * 1024)).toFixed(2);
  console.log(`[Storage] Đã sử dụng: ${usedMB} MB / Hạn ngạch: ${totalMB} MB (${((usage/quota)*100).toFixed(2)}%)`);
});
```

### Truy vấn 2: Thống kê tổng số bản ghi và kiểm tra toàn vẹn IndexedDB
```javascript
const req = indexedDB.open('meowmindlog_db', 1);
req.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('tasks', 'readonly');
  const store = tx.objectStore('tasks');
  const countReq = store.count();
  countReq.onsuccess = () => {
    console.log(`[Database] meowmindlog_db kết nối TỐT. Tổng số công việc đã lưu: ${countReq.result}`);
  };
};
```

### Truy vấn 3: Kiểm tra trạng thái Cache Storage của Service Worker
```javascript
caches.keys().then(keys => {
  console.log('[Service Worker] Các phiên bản cache hiện tại:', keys);
  keys.forEach(key => {
    caches.open(key).then(cache => cache.keys().then(requests => {
      console.log(`- Cache "${key}": ${requests.length} tài nguyên đã lưu đệm`);
    }));
  });
});
```

---

## 2. Truy Vấn Lịch Sử CI/CD Qua GitHub CLI
Dành cho người quản trị dự án kiểm tra tình trạng pipeline triển khai:

```bash
# Liệt kê 5 đợt triển khai gần nhất
gh run list --workflow=deploy.yml --limit 5

# Xem chi tiết kết quả đợt chạy mới nhất
gh run view
```

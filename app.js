/**
 * MeowMindLog - Core Application Engine (Offline PWA)
 * Clean, Human-Crafted, Distraction-Free Daily Tracker
 */

// === 1. Storage Manager (IndexedDB with LocalStorage Fallback) ===
const StorageManager = {
  dbName: 'MeowMindLogDB',
  storeName: 'tasks',
  version: 1,
  db: null,

  async init() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        resolve(false);
        return;
      }
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(true);
      };
      request.onerror = () => {
        console.error('Failed to open IndexedDB, falling back to LocalStorage');
        resolve(false);
      };
    });
  },

  async getAllTasks() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } else {
      const data = localStorage.getItem('meowmindlog_tasks');
      return data ? JSON.parse(data) : [];
    }
  },

  async saveTask(task) {
    if (this.db) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.put(task);
        req.onsuccess = () => resolve(task);
        req.onerror = (e) => reject(e);
      });
    } else {
      const tasks = await this.getAllTasks();
      const idx = tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) tasks[idx] = task;
      else tasks.push(task);
      localStorage.setItem('meowmindlog_tasks', JSON.stringify(tasks));
      return task;
    }
  },

  async deleteTask(id) {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } else {
      let tasks = await this.getAllTasks();
      tasks = tasks.filter((t) => t.id !== id);
      localStorage.setItem('meowmindlog_tasks', JSON.stringify(tasks));
      return true;
    }
  },

  async clearAll() {
    if (this.db) {
      return new Promise((resolve) => {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } else {
      localStorage.removeItem('meowmindlog_tasks');
      return true;
    }
  }
};

// === 2. Seed Initial Friendly Data (If First Launch) ===
async function seedDefaultDataIfEmpty() {
  const existing = await StorageManager.getAllTasks();
  if (existing.length === 0) {
    const today = new Date();
    const getDateStrMinusDays = (days) => {
      const d = new Date(today);
      d.setDate(today.getDate() - days);
      return formatDateStr(d);
    };

    const sampleTasks = [
      // 5 ngày trước (2 việc)
      { id: 'sample-5-1', title: 'Khởi động tuần mới & kiểm tra email', category: 'work', time: '09:00', date: getDateStrMinusDays(5), mood: 'peaceful', notes: 'Lập danh sách đầu việc tuần.', completed: true, createdAt: Date.now() - 86400000 * 5 },
      { id: 'sample-5-2', title: 'Đi dạo và chơi cùng thú cưng', category: 'pet', time: '17:30', date: getDateStrMinusDays(5), mood: 'happy', notes: 'Cho mèo ăn và chải lông.', completed: true, createdAt: Date.now() - 86400000 * 5 },

      // 4 ngày trước (1 việc)
      { id: 'sample-4-1', title: 'Đọc tài liệu lập trình giao diện PWA', category: 'study', time: '20:00', date: getDateStrMinusDays(4), mood: 'hardwork', notes: '', completed: true, createdAt: Date.now() - 86400000 * 4 },

      // 3 ngày trước (4 việc - Ngày năng suất cao nhất)
      { id: 'sample-3-1', title: 'Họp thống nhất kiến trúc hệ thống', category: 'work', time: '09:30', date: getDateStrMinusDays(3), mood: 'hardwork', notes: 'Đạt đồng thuận giải pháp kỹ thuật.', completed: true, createdAt: Date.now() - 86400000 * 3 },
      { id: 'sample-3-2', title: 'Chạy bộ 4km rèn luyện sức bền', category: 'health', time: '06:30', date: getDateStrMinusDays(3), mood: 'proud', notes: '', completed: true, createdAt: Date.now() - 86400000 * 3 },
      { id: 'sample-3-3', title: 'Hoàn thiện chức năng lưu trữ IndexedDB', category: 'work', time: '14:30', date: getDateStrMinusDays(3), mood: 'proud', notes: 'Kiểm thử offline hoạt động tốt.', completed: true, createdAt: Date.now() - 86400000 * 3 },
      { id: 'sample-3-4', title: 'Tưới cây và chăm sóc ban công', category: 'life', time: '18:00', date: getDateStrMinusDays(3), mood: 'peaceful', notes: '', completed: true, createdAt: Date.now() - 86400000 * 3 },

      // 2 ngày trước (2 việc)
      { id: 'sample-2-1', title: 'Xem lại tài liệu kiểm thử', category: 'study', time: '10:00', date: getDateStrMinusDays(2), mood: 'hardwork', notes: '', completed: true, createdAt: Date.now() - 86400000 * 2 },
      { id: 'sample-2-2', title: 'Dọn dẹp góc làm việc', category: 'life', time: '21:00', date: getDateStrMinusDays(2), mood: 'peaceful', notes: '', completed: true, createdAt: Date.now() - 86400000 * 2 },

      // Hôm qua (3 việc)
      { id: 'sample-1-1', title: 'Thiết kế biểu đồ hoạt động', category: 'work', time: '10:30', date: getDateStrMinusDays(1), mood: 'hardwork', notes: '', completed: true, createdAt: Date.now() - 86400000 * 1 },
      { id: 'sample-1-2', title: 'Tập yoga 30 phút buổi chiều', category: 'health', time: '16:00', date: getDateStrMinusDays(1), mood: 'peaceful', notes: '', completed: true, createdAt: Date.now() - 86400000 * 1 },
      { id: 'sample-1-3', title: 'Gặp gỡ bạn bè cà phê cuối tuần', category: 'life', time: '19:30', date: getDateStrMinusDays(1), mood: 'happy', notes: '', completed: true, createdAt: Date.now() - 86400000 * 1 },

      // Hôm nay (3 việc)
      { id: 'sample-0-1', title: 'Lập kế hoạch công việc trong ngày', category: 'work', time: '08:30', date: getDateStrMinusDays(0), mood: 'happy', notes: 'Xác định 3 ưu tiên quan trọng nhất cần hoàn thành.', completed: true, createdAt: Date.now() - 3600000 * 4 },
      { id: 'sample-0-2', title: 'Chạy bộ và rèn luyện thể lực', category: 'health', time: '09:45', date: getDateStrMinusDays(0), mood: 'proud', notes: '3km khởi động ngày mới, uống đủ nước.', completed: true, createdAt: Date.now() - 3600000 * 2 },
      { id: 'sample-0-3', title: 'Đọc tài liệu kỹ thuật & Service Worker', category: 'study', time: '14:00', date: getDateStrMinusDays(0), mood: 'hardwork', notes: 'Nghiên cứu nguyên lý offline-first.', completed: true, createdAt: Date.now() - 3600000 }
    ];

    for (const t of sampleTasks) {
      await StorageManager.saveTask(t);
    }
  }
}

// Helper: Format Date String YYYY-MM-DD
function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getTodayDateStr() {
  return formatDateStr(new Date());
}

// Helper: Format Readable Vietnamese Date
function formatReadableDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[date.getDay()];
  return `${dayName}, ${d}/${m}/${y}`;
}

// === 3. State Management ===
const AppState = {
  selectedDate: getTodayDateStr(),
  selectedCategory: 'all',
  currentTab: 'timeline-tab',
  allTasks: [],
  selectedMood: 'happy',
  trendRange: 7,

  async refresh() {
    this.allTasks = await StorageManager.getAllTasks();
    renderTimeline();
    renderDailyTrendChart();
    renderHeatmap();
    renderAnalytics();
  }
};

// Category Map without emoji slop
const CATEGORY_MAP = {
  work: { label: 'Công việc', class: 'badge-work', dotClass: 'dot-work' },
  study: { label: 'Học tập', class: 'badge-study', dotClass: 'dot-study' },
  life: { label: 'Đời sống', class: 'badge-life', dotClass: 'dot-life' },
  health: { label: 'Sức khỏe', class: 'badge-health', dotClass: 'dot-health' },
  pet: { label: 'Thú cưng', class: 'badge-pet', dotClass: 'dot-pet' }
};

// Mood labels and subtle badges
const MOOD_MAP = {
  happy: { label: 'Tích cực' },
  proud: { label: 'Tự hào' },
  peaceful: { label: 'Bình yên' },
  hardwork: { label: 'Tập trung' },
  tired: { label: 'Mệt mỏi' }
};

// === 4. UI Rendering Functions ===

// Render Timeline Tab
function renderTimeline() {
  const container = document.getElementById('task-list-container');
  const dateText = document.getElementById('current-date-text');
  const progressText = document.getElementById('progress-percent-text');
  const progressFill = document.getElementById('progress-bar-fill');
  const greetingText = document.getElementById('cat-greeting');

  // Update date title
  const isToday = AppState.selectedDate === getTodayDateStr();
  dateText.textContent = isToday ? `Hôm nay (${formatReadableDate(AppState.selectedDate)})` : formatReadableDate(AppState.selectedDate);

  // Filter tasks for this date
  let dayTasks = AppState.allTasks.filter((t) => t.date === AppState.selectedDate);
  const totalInDay = dayTasks.length;
  const completedInDay = dayTasks.filter((t) => t.completed).length;

  // Calculate Progress
  const percent = totalInDay === 0 ? 0 : Math.round((completedInDay / totalInDay) * 100);
  progressText.textContent = `${completedInDay}/${totalInDay} mục (${percent}%)`;
  progressFill.style.width = `${percent}%`;

  // Natural, clean encouragement without cheesy AI tone
  if (totalInDay === 0) {
    greetingText.textContent = 'Chưa có mục nào được ghi lại cho ngày này.';
  } else if (completedInDay === totalInDay) {
    greetingText.textContent = `Đã hoàn thành toàn bộ ${totalInDay} mục trong ngày. Tiếp tục duy trì phong độ!`;
  } else {
    greetingText.textContent = `Đã hoàn thành ${completedInDay} trên ${totalInDay} mục. Còn ${totalInDay - completedInDay} việc cần làm.`;
  }

  // Filter by category
  if (AppState.selectedCategory !== 'all') {
    dayTasks = dayTasks.filter((t) => t.category === AppState.selectedCategory);
  }

  // Sort by time
  dayTasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (dayTasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <h3>Chưa có bản ghi nào</h3>
        <p>Bấm vào nút <strong>"Thêm công việc"</strong> ở trên để ghi lại các việc bạn đã hoàn thành.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = dayTasks.map((task) => {
    const cat = CATEGORY_MAP[task.category] || { label: 'Khác', class: 'badge-life', dotClass: 'dot-life' };
    const moodInfo = MOOD_MAP[task.mood] || { label: 'Tích cực' };
    const isCompleted = task.completed ? 'completed' : '';

    return `
      <div class="task-card ${isCompleted}" data-id="${task.id}">
        <div class="task-main">
          <button class="task-checkbox" onclick="toggleTaskCompletion('${task.id}')" title="Đánh dấu hoàn thành" aria-label="Đánh dấu hoàn thành">
            ${task.completed ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
          </button>
          <div class="task-details">
            <div class="task-header-row">
              <span class="task-title">${escapeHTML(task.title)}</span>
              <span class="task-badge ${cat.class}">
                <span class="badge-dot ${cat.dotClass}"></span>
                ${cat.label}
              </span>
              <span class="task-mood-tag">${moodInfo.label}</span>
            </div>
            ${task.notes ? `<div class="task-notes">${escapeHTML(task.notes)}</div>` : ''}
            <div class="task-footer">
              <span class="task-time-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${task.time || 'Cả ngày'}
              </span>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="task-action-btn" onclick="openEditTaskModal('${task.id}')" title="Chỉnh sửa" aria-label="Chỉnh sửa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="task-action-btn delete" onclick="deleteTaskPrompt('${task.id}')" title="Xóa" aria-label="Xóa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// === 4.1 Daily Trend Line Chart (Biểu đồ đường thể hiện lên xuống theo ngày) ===
function renderDailyTrendChart() {
  const container = document.getElementById('trend-line-chart-viewport');
  if (!container) return;

  const range = AppState.trendRange || 7;
  const today = new Date();
  const dateList = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dateList.push(formatDateStr(d));
  }

  // Map tasks by date: dateStr -> count
  const taskCountMap = {};
  AppState.allTasks.forEach((t) => {
    if (t.completed !== false && t.date) {
      taskCountMap[t.date] = (taskCountMap[t.date] || 0) + 1;
    }
  });

  const counts = dateList.map((d) => taskCountMap[d] || 0);
  const totalCompleted = counts.reduce((sum, c) => sum + c, 0);
  const avgPerDay = (totalCompleted / range).toFixed(1);
  const peakVal = Math.max(...counts, 0);
  const activeDays = counts.filter((c) => c > 0).length;
  const activeRate = Math.round((activeDays / range) * 100);

  // Assess trend status
  const half = Math.floor(range / 2);
  const firstHalfSum = counts.slice(0, half).reduce((a, b) => a + b, 0);
  const secondHalfSum = counts.slice(-half).reduce((a, b) => a + b, 0);
  const diff = secondHalfSum - firstHalfSum;

  const badgeElem = document.getElementById('trend-status-badge');
  if (badgeElem) {
    if (diff > 1) {
      badgeElem.textContent = 'Tăng trưởng ↗';
      badgeElem.className = 'trend-badge up';
    } else if (diff < -1) {
      badgeElem.textContent = 'Giảm nhẹ ↘';
      badgeElem.className = 'trend-badge down';
    } else {
      badgeElem.textContent = 'Ổn định ➔';
      badgeElem.className = 'trend-badge';
    }
  }

  // Update Ribbon KPI Stats
  const avgElem = document.getElementById('trend-avg-val');
  const peakElem = document.getElementById('trend-peak-val');
  const totalElem = document.getElementById('trend-total-val');
  const rateElem = document.getElementById('trend-active-rate-val');
  if (avgElem) avgElem.textContent = `${avgPerDay} việc`;
  if (peakElem) peakElem.textContent = peakVal > 0 ? `${peakVal} việc` : '0 việc';
  if (totalElem) totalElem.textContent = `${totalCompleted} việc`;
  if (rateElem) rateElem.textContent = `${activeRate}%`;

  // SVG Chart Geometry
  const W = 760;
  const H = 220;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const yMax = Math.max(peakVal + 1, 4);

  // Compute point coordinates
  const points = dateList.map((dateStr, i) => {
    const count = counts[i];
    const x = padLeft + (i / (range - 1)) * chartW;
    const y = padTop + chartH - (count / yMax) * chartH;
    return { x, y, dateStr, count, index: i };
  });

  // Smooth Bezier Curve Path generator
  let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    let cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    let cp2y = p2.y - (p3.y - p1.y) / 6;

    const bottomY = padTop + chartH;
    if (cp1y > bottomY) cp1y = bottomY;
    if (cp2y > bottomY) cp2y = bottomY;
    if (cp1y < padTop) cp1y = padTop;
    if (cp2y < padTop) cp2y = padTop;

    linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  // Area under curve
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${padTop + chartH} L ${points[0].x.toFixed(1)} ${padTop + chartH} Z`;

  // Horizontal Grid Lines & Y-ticks
  const yTicks = [0, Math.round(yMax / 3), Math.round((yMax * 2) / 3), yMax];
  const uniqueTicks = Array.from(new Set(yTicks)).sort((a, b) => a - b);
  const gridLinesHTML = uniqueTicks.map((val) => {
    const gy = padTop + chartH - (val / yMax) * chartH;
    return `
      <line class="trend-grid-line" x1="${padLeft}" y1="${gy.toFixed(1)}" x2="${W - padRight}" y2="${gy.toFixed(1)}" />
      <text class="trend-axis-text" x="${padLeft - 10}" y="${(gy + 4).toFixed(1)}" text-anchor="end">${val}</text>
    `;
  }).join('');

  // X Axis Date Labels
  const xLabelsHTML = points.map((p, i) => {
    let show = false;
    if (range === 7) show = true;
    else if (range === 14) show = i % 2 === 0 || i === range - 1;
    else if (range === 30) show = i % 5 === 0 || i === range - 1;

    if (!show) return '';

    const [y, m, d] = p.dateStr.split('-');
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    const isToday = p.dateStr === getTodayDateStr();
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const labelText = isToday ? 'Hôm nay' : `${dayNames[dt.getDay()]} ${d}/${m}`;

    return `
      <text class="trend-axis-text" x="${p.x.toFixed(1)}" y="${H - 12}" text-anchor="middle" font-weight="${isToday ? '700' : '500'}">
        ${labelText}
      </text>
    `;
  }).join('');

  // Circular Data Dots
  const dotsHTML = points.map((p) => {
    return `
      <circle 
        class="trend-chart-dot" 
        cx="${p.x.toFixed(1)}" 
        cy="${p.y.toFixed(1)}" 
        r="5" 
        data-date="${p.dateStr}" 
        data-count="${p.count}"
        data-x="${p.x.toFixed(1)}"
        data-y="${p.y.toFixed(1)}"
      />
    `;
  }).join('');

  container.innerHTML = `
    <svg class="trend-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" id="trend-svg-elem">
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.32" />
          <stop offset="85%" stop-color="var(--accent-primary)" stop-opacity="0.04" />
          <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Grid lines & Y scale -->
      ${gridLinesHTML}

      <!-- Bottom X baseline -->
      <line x1="${padLeft}" y1="${padTop + chartH}" x2="${W - padRight}" y2="${padTop + chartH}" stroke="var(--border-subtle)" stroke-width="1.2" />

      <!-- Area gradient fill -->
      <path d="${areaPath}" fill="url(#trendGradient)" />

      <!-- Main smooth line curve -->
      <path class="trend-curve-line" d="${linePath}" />

      <!-- Vertical Guide Line -->
      <line id="trend-vertical-guide" class="trend-guide-line" x1="0" y1="${padTop}" x2="0" y2="${padTop + chartH}" style="display: none;" />

      <!-- Data Dots -->
      ${dotsHTML}

      <!-- X-axis Labels -->
      ${xLabelsHTML}
    </svg>
  `;

  attachLineChartInteractions(points, container);
}

// Attach hover and click interactions to Line Chart
function attachLineChartInteractions(points, container) {
  const tooltip = document.getElementById('trend-chart-tooltip');
  const svg = document.getElementById('trend-svg-elem');
  const guide = document.getElementById('trend-vertical-guide');
  if (!svg || !tooltip) return;

  const showPointTooltip = (p) => {
    const isToday = p.dateStr === getTodayDateStr();
    const dateFormatted = formatReadableDate(p.dateStr);

    let statusNote = 'Chưa có việc';
    if (p.count >= 4) statusNote = '⭐ Rất tích cực!';
    else if (p.count >= 2) statusNote = '✓ Đạt năng suất';
    else if (p.count === 1) statusNote = 'Khởi động';

    tooltip.innerHTML = `
      <div class="tt-date">${isToday ? '🌟 Hôm nay - ' : ''}${dateFormatted}</div>
      <div class="tt-count">${p.count} việc hoàn thành <span style="font-size:0.75rem; font-weight:normal; color:var(--text-secondary); margin-left:4px;">(${statusNote})</span></div>
      <div class="tt-hint">Bấm để mở dòng thời gian ngày này ➔</div>
    `;
    tooltip.style.display = 'block';

    const rect = container.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const scaleX = svgRect.width / 760;
    const scaleY = svgRect.height / 220;

    const posX = p.x * scaleX + (svgRect.left - rect.left);
    const posY = p.y * scaleY + (svgRect.top - rect.top);

    tooltip.style.left = `${posX}px`;
    tooltip.style.top = `${posY}px`;

    if (guide) {
      guide.setAttribute('x1', p.x);
      guide.setAttribute('x2', p.x);
      guide.style.display = 'block';
    }
  };

  const hideTooltip = () => {
    tooltip.style.display = 'none';
    if (guide) guide.style.display = 'none';
    svg.querySelectorAll('.trend-chart-dot').forEach((d) => d.classList.remove('active'));
  };

  svg.querySelectorAll('.trend-chart-dot').forEach((dot) => {
    const dateStr = dot.dataset.date;
    const p = points.find((pt) => pt.dateStr === dateStr);

    dot.addEventListener('mouseenter', () => {
      dot.classList.add('active');
      if (p) showPointTooltip(p);
    });

    dot.addEventListener('click', () => {
      if (p) onHeatmapCellClick(p.dateStr);
    });
  });

  container.addEventListener('mouseleave', hideTooltip);

  svg.addEventListener('mousemove', (e) => {
    const svgRect = svg.getBoundingClientRect();
    const mouseSvgX = ((e.clientX - svgRect.left) / svgRect.width) * 760;

    let closest = points[0];
    let minDiff = Infinity;
    points.forEach((pt) => {
      const diff = Math.abs(pt.x - mouseSvgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = pt;
      }
    });

    if (closest && minDiff < 45) {
      svg.querySelectorAll('.trend-chart-dot').forEach((d) => {
        d.classList.toggle('active', d.dataset.date === closest.dateStr);
      });
      showPointTooltip(closest);
    }
  });
}

// === 4.2 Render Heatmap Grid (GitHub Style 52 Weeks x 7 Days) ===
function renderHeatmap() {
  const matrix = document.getElementById('heatmap-matrix-grid');
  const yearText = document.getElementById('heatmap-year-text');
  const monthsHeader = document.getElementById('heatmap-months-header');
  if (!matrix) return;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  if (yearText) yearText.textContent = String(currentYear);

  // Map tasks by date: dateStr -> count
  const taskCountMap = {};
  AppState.allTasks.forEach((t) => {
    if (t.completed !== false && t.date) {
      taskCountMap[t.date] = (taskCountMap[t.date] || 0) + 1;
    }
  });

  // Calculate Streaks & KPIs
  const { currentStreak, longestStreak, activeDays, totalYearTasks } = calculateStreaks(taskCountMap, currentYear);
  const curStreakElem = document.getElementById('current-streak-val');
  const longStreakElem = document.getElementById('longest-streak-val');
  const activeDaysElem = document.getElementById('total-active-days-val');
  const totalTasksElem = document.getElementById('total-tasks-year-val');
  if (curStreakElem) curStreakElem.textContent = currentStreak;
  if (longStreakElem) longStreakElem.textContent = longestStreak;
  if (activeDaysElem) activeDaysElem.textContent = activeDays;
  if (totalTasksElem) totalTasksElem.textContent = totalYearTasks;

  // Generate 53 weeks aligned to Monday
  const startDate = new Date(currentYear, 0, 1);
  const dayOfWeek = startDate.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  startDate.setDate(startDate.getDate() - diffToMonday);

  // Render Month Labels across 53 weeks
  if (monthsHeader) {
    const monthNames = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'];
    let lastMonth = -1;
    const monthLabels = [];

    for (let w = 0; w < 53; w++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(startDate.getDate() + w * 7);
      const m = weekDate.getMonth();
      if (m !== lastMonth && weekDate.getFullYear() === currentYear) {
        lastMonth = m;
        const leftPx = w * 15;
        monthLabels.push(`<span class="heatmap-month-label" style="left: ${leftPx}px;">${monthNames[m]}</span>`);
      }
    }
    monthsHeader.innerHTML = monthLabels.join('');
  }

  const totalDays = 53 * 7;
  const todayStr = getTodayDateStr();
  const cellsHTML = [];

  for (let i = 0; i < totalDays; i++) {
    const cur = new Date(startDate);
    cur.setDate(startDate.getDate() + i);
    const dateStr = formatDateStr(cur);
    const count = taskCountMap[dateStr] || 0;
    const isToday = dateStr === todayStr;
    
    let level = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    cellsHTML.push(`
      <div 
        class="heatmap-cell box-${level} ${isToday ? 'is-today' : ''}" 
        data-date="${dateStr}" 
        data-count="${count}"
        title="${isToday ? '★ Hôm nay - ' : ''}${formatReadableDate(dateStr)}: ${count} việc hoàn thành"
        onclick="onHeatmapCellClick('${dateStr}')"
      ></div>
    `);
  }

  matrix.innerHTML = cellsHTML.join('');
}

// Auto-scroll heatmap to current week
function scrollHeatmapToToday() {
  const scrollWrapper = document.getElementById('heatmap-scroll-container');
  const todayCell = document.querySelector('.heatmap-cell.is-today');
  if (scrollWrapper && todayCell) {
    const cellLeft = todayCell.offsetLeft || 0;
    const targetScroll = Math.max(0, cellLeft - (scrollWrapper.clientWidth / 2) + 20);
    scrollWrapper.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }
}

// Calculate Current Streak & Longest Streak
function calculateStreaks(taskCountMap, year) {
  const dates = Object.keys(taskCountMap).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let activeDays = 0;
  let totalYearTasks = 0;

  dates.forEach((d) => {
    if (d.startsWith(String(year)) && taskCountMap[d] > 0) {
      activeDays++;
      totalYearTasks += taskCountMap[d];
    }
  });

  // Calculate current streak backwards from today
  const today = new Date();
  let check = new Date(today);
  while (true) {
    const dStr = formatDateStr(check);
    if (taskCountMap[dStr] && taskCountMap[dStr] > 0) {
      currentStreak++;
      check.setDate(check.getDate() - 1);
    } else {
      if (dStr === formatDateStr(today)) {
        check.setDate(check.getDate() - 1);
        const yStr = formatDateStr(check);
        if (taskCountMap[yStr] && taskCountMap[yStr] > 0) {
          continue;
        }
      }
      break;
    }
  }

  // Calculate longest streak in year
  let tempStreak = 0;
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  for (let d = new Date(startOfYear); d <= endOfYear; d.setDate(d.getDate() + 1)) {
    const dStr = formatDateStr(d);
    if (taskCountMap[dStr] && taskCountMap[dStr] > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak, activeDays, totalYearTasks };
}

// Cell Click on Heatmap / Chart Dot: Jump to that day's timeline
window.onHeatmapCellClick = function(dateStr) {
  AppState.selectedDate = dateStr;
  switchTab('timeline-tab');
  AppState.refresh();
  showToast(`Đang xem ngày: ${formatReadableDate(dateStr)}`);
};

// === 5. Analytics & Visual Charts Engine ===
function renderAnalytics() {
  const tasks = AppState.allTasks;
  const currentYear = new Date().getFullYear();
  const yearElem = document.getElementById('monthly-chart-year');
  if (yearElem) yearElem.textContent = String(currentYear);

  // 1. Calculate KPIs
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed !== false).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalElem = document.getElementById('kpi-total-tasks');
  const rateElem = document.getElementById('kpi-completion-rate');
  if (totalElem) totalElem.textContent = completedTasks;
  if (rateElem) rateElem.textContent = `${completionRate}%`;

  // Aggregate stats
  const catCounts = { work: 0, study: 0, life: 0, health: 0, pet: 0 };
  const dowCounts = [0, 0, 0, 0, 0, 0, 0];
  const monthCounts = new Array(12).fill(0);
  const moodCounts = { happy: 0, proud: 0, peaceful: 0, hardwork: 0, tired: 0 };

  tasks.forEach((t) => {
    if (t.completed !== false) {
      if (catCounts[t.category] !== undefined) catCounts[t.category]++;
      if (t.mood && moodCounts[t.mood] !== undefined) moodCounts[t.mood]++;

      if (t.date) {
        const [y, m, d] = t.date.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        dowCounts[dt.getDay()]++;
        if (y === currentYear) {
          monthCounts[m - 1]++;
        }
      }
    }
  });

  // Top Category KPI
  let topCatKey = '---';
  let maxCatCount = 0;
  for (const [k, v] of Object.entries(catCounts)) {
    if (v > maxCatCount) {
      maxCatCount = v;
      topCatKey = k;
    }
  }
  const topCatInfo = CATEGORY_MAP[topCatKey];
  const topCatElem = document.getElementById('kpi-top-category');
  if (topCatElem) {
    topCatElem.textContent = topCatInfo ? topCatInfo.label : '---';
  }

  // Most Productive Day of Week KPI
  const dowNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  let topDowIdx = 1;
  let maxDowCount = 0;
  dowCounts.forEach((cnt, idx) => {
    if (cnt > maxDowCount) {
      maxDowCount = cnt;
      topDowIdx = idx;
    }
  });
  const prodDayElem = document.getElementById('kpi-productive-day');
  if (prodDayElem) {
    prodDayElem.textContent = maxDowCount > 0 ? dowNames[topDowIdx] : '---';
  }

  // 2. Render Monthly Activity Bar Chart (12 Months)
  const maxMonthly = Math.max(...monthCounts, 1);
  const monthlyChartContainer = document.getElementById('monthly-bar-chart');
  if (monthlyChartContainer) {
    monthlyChartContainer.innerHTML = monthCounts.map((cnt, idx) => {
      const heightPercent = Math.max(Math.round((cnt / maxMonthly) * 100), 4);
      const monthLabel = `T${idx + 1}`;
      return `
        <div class="bar-col">
          <div class="bar-tooltip">Tháng ${idx + 1}: ${cnt} việc</div>
          <div class="bar-fill-wrap">
            <div class="bar-fill" style="height: ${cnt > 0 ? heightPercent : 4}%;"></div>
          </div>
          <span class="bar-label">${monthLabel}</span>
        </div>
      `;
    }).join('');
  }

  // 3. Render Day of Week Chart (Mon to Sun)
  const dowOrder = [1, 2, 3, 4, 5, 6, 0];
  const maxDow = Math.max(...dowCounts, 1);
  const dowContainer = document.getElementById('dow-bar-chart');
  if (dowContainer) {
    dowContainer.innerHTML = dowOrder.map((dayIdx) => {
      const count = dowCounts[dayIdx];
      const percent = Math.round((count / maxDow) * 100);
      return `
        <div class="dow-row">
          <span class="dow-day-label">${dowNames[dayIdx]}</span>
          <div class="dow-bar-track">
            <div class="dow-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="dow-val-label">${count} việc</span>
        </div>
      `;
    }).join('');
  }

  // 4. Render Category Breakdown
  const catContainer = document.getElementById('category-breakdown-container');
  const catColors = {
    work: '#0284c7',
    study: '#d97706',
    life: '#9333ea',
    health: '#16a34a',
    pet: '#e11d48'
  };
  if (catContainer) {
    catContainer.innerHTML = Object.entries(catCounts).map(([catKey, count]) => {
      const cat = CATEGORY_MAP[catKey];
      const percent = completedTasks > 0 ? Math.round((count / completedTasks) * 100) : 0;
      const color = catColors[catKey] || '#10b981';
      return `
        <div class="cat-row">
          <div class="cat-row-info">
            <span class="cat-row-name"><span class="badge-dot" style="background:${color};"></span>${cat.label}</span>
            <span class="cat-row-count">${count} (${percent}%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${percent}%; background: ${color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 5. Render Mood Distribution
  const moodContainer = document.getElementById('mood-breakdown-container');
  if (moodContainer) {
    const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
    moodContainer.innerHTML = Object.entries(moodCounts).map(([mKey, count]) => {
      const mInfo = MOOD_MAP[mKey] || { label: mKey };
      const percent = totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0;
      return `
        <div class="mood-stat-box">
          <div class="mood-box-header">
            <span class="mood-title-text">${mInfo.label}</span>
            <span class="mood-count-text">${count} (${percent}%)</span>
          </div>
          <div class="mood-bar-track">
            <div class="mood-bar-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// === 6. Task Actions ===
window.toggleTaskCompletion = async function(id) {
  const task = AppState.allTasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    await StorageManager.saveTask(task);
    AppState.refresh();
    if (task.completed) {
      showToast('Đã hoàn thành công việc.');
    }
  }
};

window.deleteTaskPrompt = async function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
    await StorageManager.deleteTask(id);
    AppState.refresh();
    showToast('Đã xóa bản ghi.');
  }
};

window.openEditTaskModal = function(id) {
  const task = AppState.allTasks.find((t) => t.id === id);
  if (!task) return;

  document.getElementById('modal-title').textContent = 'Chỉnh sửa công việc';
  document.getElementById('task-edit-id').value = task.id;
  document.getElementById('task-title-input').value = task.title;
  document.getElementById('task-category-select').value = task.category || 'work';
  document.getElementById('task-time-input').value = task.time || '';
  document.getElementById('task-notes-input').value = task.notes || '';

  AppState.selectedMood = task.mood || 'happy';
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.mood === AppState.selectedMood);
  });

  document.getElementById('task-modal').classList.add('active');
};

function openAddModal() {
  document.getElementById('modal-title').textContent = 'Thêm công việc';
  document.getElementById('task-edit-id').value = '';
  document.getElementById('task-form').reset();
  
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  document.getElementById('task-time-input').value = timeStr;

  AppState.selectedMood = 'happy';
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.mood === 'happy');
  });

  document.getElementById('task-modal').classList.add('active');
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.remove('active');
}

// === 7. Backup & Export / Import Management ===
const BackupManager = {
  async exportJSON() {
    const tasks = await StorageManager.getAllTasks();
    const exportData = {
      app: 'MeowMindLog',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasksCount: tasks.length,
      tasks: tasks
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MeowMindLog-Backup-${getTodayDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file sao lưu JSON thành công.');
  },

  async importJSON(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.tasks || !Array.isArray(json.tasks)) {
          alert('Tệp JSON không đúng định dạng của MeowMindLog.');
          return;
        }

        const isMerge = confirm(`Tệp có ${json.tasks.length} bản ghi.\nBấm OK để GỘP thêm vào dữ liệu hiện tại, hoặc Hủy để GHI ĐÈ toàn bộ.`);
        if (!isMerge) {
          await StorageManager.clearAll();
        }

        for (const t of json.tasks) {
          if (t.id && t.title && t.date) {
            await StorageManager.saveTask(t);
          }
        }

        await AppState.refresh();
        showToast(`Đã nhập thành công ${json.tasks.length} bản ghi.`);
      } catch (err) {
        alert('Lỗi khi đọc file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  },

  async exportCSV() {
    const tasks = await StorageManager.getAllTasks();
    if (tasks.length === 0) {
      alert('Chưa có dữ liệu để xuất file CSV.');
      return;
    }
    const headers = ['ID', 'Ngày', 'Thời gian', 'Tiêu đề', 'Danh mục', 'Tâm trạng', 'Đã xong', 'Ghi chú'];
    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.time || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${CATEGORY_MAP[t.category]?.label || t.category || ''}"`,
      `"${MOOD_MAP[t.mood]?.label || t.mood || ''}"`,
      `"${t.completed ? 'Có' : 'Không'}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MeowMindLog-Export-${getTodayDateStr()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file CSV thành công.');
  }
};

// === 8. Toast Notifications ===
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

// === 9. Tab Navigation ===
function switchTab(tabId) {
  AppState.currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.toggle('active', pane.id === tabId);
  });
  if (tabId === 'heatmap-tab') {
    renderDailyTrendChart();
    setTimeout(scrollHeatmapToToday, 80);
  }
}

// === 10. Theme Manager ===
const ThemeManager = {
  theme: 'light',
  init() {
    const saved = localStorage.getItem('meowmindlog_theme');
    if (saved) {
      this.theme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark';
    }
    this.apply();
  },
  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('meowmindlog_theme', this.theme);
    this.apply();
  },
  apply() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (this.theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }
};

// === 11. PWA Manager ===
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('install-pwa-btn');
  if (installBtn) installBtn.style.display = 'inline-flex';
});

// === 12. App Initialization & Event Listeners ===
document.addEventListener('DOMContentLoaded', async () => {
  ThemeManager.init();
  await StorageManager.init();
  await seedDefaultDataIfEmpty();
  await AppState.refresh();

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Trend Range Selector Buttons
  document.querySelectorAll('#trend-range-buttons .range-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#trend-range-buttons .range-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.trendRange = parseInt(btn.dataset.range, 10) || 7;
      renderDailyTrendChart();
    });
  });

  // Date navigation
  document.getElementById('prev-day-btn').addEventListener('click', () => {
    const [y, m, d] = AppState.selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d - 1);
    AppState.selectedDate = formatDateStr(dt);
    AppState.refresh();
  });

  document.getElementById('next-day-btn').addEventListener('click', () => {
    const [y, m, d] = AppState.selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d + 1);
    AppState.selectedDate = formatDateStr(dt);
    AppState.refresh();
  });

  document.getElementById('today-btn').addEventListener('click', () => {
    AppState.selectedDate = getTodayDateStr();
    AppState.refresh();
  });

  // Category filter
  document.querySelectorAll('#category-filter-bar .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#category-filter-bar .chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.selectedCategory = chip.dataset.category;
      renderTimeline();
    });
  });

  // Modal open / close
  document.getElementById('open-add-task-modal-btn').addEventListener('click', openAddModal);
  document.getElementById('close-task-modal-btn').addEventListener('click', closeTaskModal);
  document.getElementById('cancel-task-btn').addEventListener('click', closeTaskModal);

  // Close modal on click backdrop
  document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target.id === 'task-modal') closeTaskModal();
  });

  // Mood buttons in modal
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      AppState.selectedMood = btn.dataset.mood;
    });
  });

  // Task Form Submit
  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('task-edit-id').value;
    const title = document.getElementById('task-title-input').value.trim();
    const category = document.getElementById('task-category-select').value;
    const time = document.getElementById('task-time-input').value;
    const notes = document.getElementById('task-notes-input').value.trim();

    if (!title) return;

    if (editId) {
      const task = AppState.allTasks.find((t) => t.id === editId);
      if (task) {
        task.title = title;
        task.category = category;
        task.time = time;
        task.notes = notes;
        task.mood = AppState.selectedMood;
        await StorageManager.saveTask(task);
        showToast('Đã cập nhật công việc.');
      }
    } else {
      const newTask = {
        id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        title,
        category,
        time,
        notes,
        mood: AppState.selectedMood,
        date: AppState.selectedDate,
        completed: true,
        createdAt: Date.now()
      };
      await StorageManager.saveTask(newTask);
      showToast('Đã thêm công việc thành công.');
    }

    closeTaskModal();
    AppState.refresh();
  });

  // Theme toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    ThemeManager.toggle();
  });

  // Install PWA
  const installBtn = document.getElementById('install-pwa-btn');
  const installModal = document.getElementById('install-modal');
  const closeInstallBtn = document.getElementById('close-install-modal-btn');
  const confirmInstallBtn = document.getElementById('confirm-install-modal-btn');

  function openInstallModal() {
    if (installModal) installModal.classList.add('active');
  }

  function closeInstallModal() {
    if (installModal) installModal.classList.remove('active');
  }

  if (closeInstallBtn) closeInstallBtn.addEventListener('click', closeInstallModal);
  if (confirmInstallBtn) confirmInstallBtn.addEventListener('click', closeInstallModal);
  if (installModal) {
    installModal.addEventListener('click', (e) => {
      if (e.target.id === 'install-modal') closeInstallModal();
    });
  }

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('Đang cài đặt ứng dụng...');
        }
        deferredPrompt = null;
      } else {
        openInstallModal();
      }
    });
  }

  // Backup actions
  document.getElementById('export-json-btn').addEventListener('click', () => BackupManager.exportJSON());
  document.getElementById('export-csv-btn').addEventListener('click', () => BackupManager.exportCSV());
  document.getElementById('trigger-import-json-btn').addEventListener('click', () => {
    document.getElementById('import-json-file-input').click();
  });
  document.getElementById('import-json-file-input').addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      BackupManager.importJSON(e.target.files[0]);
    }
  });

  // Clear data
  document.getElementById('clear-all-data-btn').addEventListener('click', async () => {
    if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu không? Thao tác này sẽ xóa sạch tất cả nhật ký.')) {
      if (confirm('Xác nhận lần cuối: Bạn có chắc không?')) {
        await StorageManager.clearAll();
        await AppState.refresh();
        showToast('Đã xóa sạch dữ liệu.');
      }
    }
  });

  // Register Service Worker for 100% Offline Capability
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('[MeowMindLog] Service Worker registered with scope:', reg.scope);
    }).catch((err) => {
      console.error('[MeowMindLog] Service Worker registration failed:', err);
    });
  }
});

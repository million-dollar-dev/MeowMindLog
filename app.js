/**
 * MeowMindLog - Core Application Engine (Offline PWA)
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
    const today = getTodayDateStr();
    const sampleTasks = [
      {
        id: 'sample-1',
        title: 'Khởi động ngày mới cùng MeowMindLog',
        category: 'life',
        time: '08:00',
        date: today,
        mood: 'happy',
        notes: 'Bắt đầu thói quen ghi lại các việc đã làm để theo dõi năng suất!',
        completed: true,
        createdAt: Date.now() - 3600000 * 4
      },
      {
        id: 'sample-2',
        title: 'Hoàn thành buổi tập thể dục buổi sáng',
        category: 'health',
        time: '09:30',
        date: today,
        mood: 'proud',
        notes: 'Chạy bộ 2km và uống đủ 500ml nước',
        completed: true,
        createdAt: Date.now() - 3600000 * 2
      },
      {
        id: 'sample-3',
        title: 'Học và tìm hiểu ứng dụng PWA Offline',
        category: 'study',
        time: '14:15',
        date: today,
        mood: 'hardwork',
        notes: 'Web app offline siêu nhẹ, chạy mượt mà không cần cài Android Studio',
        completed: true,
        createdAt: Date.now() - 3600000
      }
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
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
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

  async refresh() {
    this.allTasks = await StorageManager.getAllTasks();
    renderTimeline();
    renderHeatmap();
    renderAnalytics();
  }
};

// Category Badge Labels & Classes
const CATEGORY_MAP = {
  work: { label: 'Công việc', class: 'badge-work', icon: '💼' },
  study: { label: 'Học tập', class: 'badge-study', icon: '📚' },
  life: { label: 'Đời sống', class: 'badge-life', icon: '🏡' },
  health: { label: 'Sức khỏe', class: 'badge-health', icon: '🏃' },
  pet: { label: 'Nuôi mèo', class: 'badge-pet', icon: '🐱' }
};

const MOOD_EMOJIS = {
  happy: '😸',
  proud: '😺',
  peaceful: '🐱',
  hardwork: '🐾',
  tired: '😿'
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
  progressText.textContent = `${completedInDay}/${totalInDay} việc (${percent}%)`;
  progressFill.style.width = `${percent}%`;

  // Dynamic Greeting based on progress
  if (totalInDay === 0) {
    greetingText.textContent = 'Chưa có nhật ký nào cho ngày này meow! Hãy thêm việc đầu tiên nhé.';
  } else if (completedInDay === totalInDay) {
    greetingText.textContent = 'Tuyệt vời lắm Sen ơi! Đã hoàn thành 100% mục tiêu hôm nay rồi 😸🎉';
  } else {
    greetingText.textContent = `Sen đã xong ${completedInDay} việc rồi, cố gắng lên nào meow! 🐾`;
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
        <div class="cat-mascot">🐱</div>
        <h3>Không có bản ghi nào</h3>
        <p>Bấm vào nút <strong>"Thêm Việc Đã Làm"</strong> ở trên để lưu lại công việc của bạn nhé!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = dayTasks.map((task) => {
    const cat = CATEGORY_MAP[task.category] || { label: 'Khác', class: 'badge-life', icon: '📌' };
    const moodEmoji = MOOD_EMOJIS[task.mood] || '😸';
    const isCompleted = task.completed ? 'completed' : '';
    const checkIcon = task.completed ? '✓' : '';

    return `
      <div class="task-card ${isCompleted}" data-id="${task.id}">
        <div class="task-main">
          <button class="task-checkbox" onclick="toggleTaskCompletion('${task.id}')" title="Đánh dấu hoàn thành">${checkIcon}</button>
          <div class="task-details">
            <div class="task-header-row">
              <span class="task-title">${escapeHTML(task.title)}</span>
              <span class="task-badge ${cat.class}">${cat.icon} ${cat.label}</span>
              <span title="Tâm trạng">${moodEmoji}</span>
            </div>
            ${task.notes ? `<div class="task-notes">${escapeHTML(task.notes)}</div>` : ''}
            <div class="task-footer">
              <span>⏰ ${task.time || 'Cả ngày'}</span>
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="task-action-btn" onclick="openEditTaskModal('${task.id}')" title="Chỉnh sửa">✏️</button>
          <button class="task-action-btn delete" onclick="deleteTaskPrompt('${task.id}')" title="Xóa">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

// Render Heatmap Grid (GitHub Style 52 Weeks x 7 Days)
function renderHeatmap() {
  const matrix = document.getElementById('heatmap-matrix-grid');
  const yearText = document.getElementById('heatmap-year-text');
  
  const now = new Date();
  const currentYear = now.getFullYear();
  yearText.textContent = String(currentYear);

  // Map tasks by date: dateStr -> count
  const taskCountMap = {};
  AppState.allTasks.forEach((t) => {
    if (t.completed !== false) {
      taskCountMap[t.date] = (taskCountMap[t.date] || 0) + 1;
    }
  });

  // Calculate Streak
  const { currentStreak, longestStreak, activeDays, totalYearTasks } = calculateStreaks(taskCountMap, currentYear);
  document.getElementById('current-streak-val').textContent = currentStreak;
  document.getElementById('longest-streak-val').textContent = longestStreak;
  document.getElementById('total-active-days-val').textContent = activeDays;
  document.getElementById('total-tasks-year-val').textContent = totalYearTasks;

  // Generate 52 weeks (364/365 days)
  // Find start: 52 weeks ago starting on Monday
  const startDate = new Date(currentYear, 0, 1);
  // Align to previous Monday if Jan 1 is not Monday
  const dayOfWeek = startDate.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMonday = (dayOfWeek + 6) % 7;
  startDate.setDate(startDate.getDate() - diffToMonday);

  const totalDays = 53 * 7;
  const cellsHTML = [];

  for (let i = 0; i < totalDays; i++) {
    const cur = new Date(startDate);
    cur.setDate(startDate.getDate() + i);
    const dateStr = formatDateStr(cur);
    const count = taskCountMap[dateStr] || 0;
    
    // Intensity level: 0, 1, 2, 3, 4
    let level = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    cellsHTML.push(`
      <div 
        class="heatmap-cell box-${level}" 
        data-date="${dateStr}" 
        data-count="${count}"
        title="${dateStr}: ${count} việc hoàn thành"
        onclick="onHeatmapCellClick('${dateStr}')"
      ></div>
    `);
  }

  matrix.innerHTML = cellsHTML.join('');
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
      // If today has 0 tasks yet, check yesterday
      if (dStr === formatDateStr(today)) {
        check.setDate(check.getDate() - 1);
        const yStr = formatDateStr(check);
        if (taskCountMap[yStr] && taskCountMap[yStr] > 0) {
          // Continue from yesterday
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

// Cell Click on Heatmap: Jump to that day's timeline
window.onHeatmapCellClick = function(dateStr) {
  AppState.selectedDate = dateStr;
  switchTab('timeline-tab');
  AppState.refresh();
  showToast(`📅 Đang xem ngày: ${formatReadableDate(dateStr)}`);
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
  const dowCounts = [0, 0, 0, 0, 0, 0, 0]; // 0: CN, 1: T2, 2: T3, ...
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
    topCatElem.textContent = topCatInfo ? `${topCatInfo.icon} ${topCatInfo.label}` : '---';
  }

  // Most Productive Day of Week KPI
  const dowNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
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
  const dowOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon -> Sun
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
      const color = catColors[catKey] || '#e07a5f';
      return `
        <div class="cat-row">
          <div class="cat-row-info">
            <span>${cat.icon} ${cat.label}</span>
            <span>${count} việc (${percent}%)</span>
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
  const moodNames = {
    happy: 'Rất vui',
    proud: 'Tự hào',
    peaceful: 'Bình yên',
    hardwork: 'Chăm chỉ',
    tired: 'Mệt mỏi'
  };
  if (moodContainer) {
    moodContainer.innerHTML = Object.entries(moodCounts).map(([mKey, count]) => {
      const emoji = MOOD_EMOJIS[mKey] || '😸';
      const mName = moodNames[mKey] || mKey;
      return `
        <div class="mood-stat-box">
          <span class="mood-emoji-big">${emoji}</span>
          <span class="mood-count-text">${count}</span>
          <span class="mood-title-text">${mName}</span>
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
      showToast('🐾 Giỏi lắm! Đã hoàn thành 1 việc.');
    }
  }
};

window.deleteTaskPrompt = async function(id) {
  if (confirm('Bạn có chắc chắn muốn xóa công việc này không meow?')) {
    await StorageManager.deleteTask(id);
    AppState.refresh();
    showToast('🗑️ Đã xóa bản ghi.');
  }
};

window.openEditTaskModal = function(id) {
  const task = AppState.allTasks.find((t) => t.id === id);
  if (!task) return;

  document.getElementById('modal-title').textContent = '✏️ Chỉnh Sửa Việc Đã Làm';
  document.getElementById('task-edit-id').value = task.id;
  document.getElementById('task-title-input').value = task.title;
  document.getElementById('task-category-select').value = task.category || 'work';
  document.getElementById('task-time-input').value = task.time || '';
  document.getElementById('task-notes-input').value = task.notes || '';

  // Select mood
  AppState.selectedMood = task.mood || 'happy';
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.mood === AppState.selectedMood);
  });

  document.getElementById('task-modal').classList.add('active');
};

// Open Add Modal
function openAddModal() {
  document.getElementById('modal-title').textContent = '🐾 Thêm Việc Đã Làm';
  document.getElementById('task-edit-id').value = '';
  document.getElementById('task-form').reset();
  
  // Default to current time
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

// === 6. Backup & Export / Import Management ===
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
    showToast('📥 Xuất tệp JSON sao lưu thành công!');
  },

  async importJSON(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.tasks || !Array.isArray(json.tasks)) {
          alert('Tệp JSON không đúng cấu trúc của MeowMindLog!');
          return;
        }

        const isMerge = confirm(`Tệp có ${json.tasks.length} bản ghi.\nBấm OK để GỘP thêm vào dữ liệu hiện tại, hoặc Cancel để GHI ĐÈ toàn bộ.`);
        if (!isMerge) {
          await StorageManager.clearAll();
        }

        for (const t of json.tasks) {
          if (t.id && t.title && t.date) {
            await StorageManager.saveTask(t);
          }
        }

        await AppState.refresh();
        showToast(`📤 Đã nhập thành công ${json.tasks.length} bản ghi!`);
      } catch (err) {
        alert('Lỗi đọc tệp JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  },

  async exportCSV() {
    const tasks = await StorageManager.getAllTasks();
    if (tasks.length === 0) {
      alert('Chưa có dữ liệu để xuất CSV!');
      return;
    }
    const headers = ['ID', 'Ngày', 'Thời gian', 'Tiêu đề', 'Danh mục', 'Tâm trạng', 'Đã xong', 'Ghi chú'];
    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.time || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${t.category || ''}"`,
      `"${t.mood || ''}"`,
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
    showToast('📊 Xuất tệp CSV thành công!');
  }
};

// === 7. Toast Notifications ===
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🐾</span> ${escapeHTML(message)}`;
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

// === 8. Tab Navigation ===
function switchTab(tabId) {
  AppState.currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.toggle('active', pane.id === tabId);
  });
}

// === 9. Event Listeners Initialization ===
function initEventListeners() {
  // Tab clicks
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Modal controls
  document.getElementById('open-add-task-modal-btn').addEventListener('click', openAddModal);
  document.getElementById('close-task-modal-btn').addEventListener('click', closeTaskModal);
  document.getElementById('cancel-task-btn').addEventListener('click', closeTaskModal);

  // Mood selector buttons
  document.querySelectorAll('.mood-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      AppState.selectedMood = btn.dataset.mood;
    });
  });

  // Task form submit
  document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('task-edit-id').value;
    const title = document.getElementById('task-title-input').value.trim();
    const category = document.getElementById('task-category-select').value;
    const time = document.getElementById('task-time-input').value;
    const notes = document.getElementById('task-notes-input').value.trim();

    if (!title) return;

    const taskObj = {
      id: editId || 'task-' + Date.now(),
      title,
      category,
      time,
      notes,
      mood: AppState.selectedMood,
      date: AppState.selectedDate,
      completed: true, // Default to completed since this is a log of done tasks
      createdAt: editId ? undefined : Date.now()
    };

    // If editing, preserve completion state & createdAt
    if (editId) {
      const existing = AppState.allTasks.find((t) => t.id === editId);
      if (existing) {
        taskObj.completed = existing.completed;
        taskObj.createdAt = existing.createdAt;
      }
    }

    await StorageManager.saveTask(taskObj);
    closeTaskModal();
    AppState.refresh();
    showToast(editId ? '✏️ Đã cập nhật công việc!' : '🐾 Đã ghi nhận việc hoàn thành!');
  });

  // Date Navigation
  document.getElementById('prev-day-btn').addEventListener('click', () => {
    const cur = new Date(AppState.selectedDate);
    cur.setDate(cur.getDate() - 1);
    AppState.selectedDate = formatDateStr(cur);
    AppState.refresh();
  });

  document.getElementById('next-day-btn').addEventListener('click', () => {
    const cur = new Date(AppState.selectedDate);
    cur.setDate(cur.getDate() + 1);
    AppState.selectedDate = formatDateStr(cur);
    AppState.refresh();
  });

  document.getElementById('today-btn').addEventListener('click', () => {
    AppState.selectedDate = getTodayDateStr();
    AppState.refresh();
  });

  // Category filter chips
  document.querySelectorAll('#category-filter-bar .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#category-filter-bar .chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.selectedCategory = chip.dataset.category;
      renderTimeline();
    });
  });

  // Theme Toggle (Dark / Light)
  const themeBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('meowmindlog_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('meowmindlog_theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // Backup buttons
  document.getElementById('export-json-btn').addEventListener('click', () => BackupManager.exportJSON());
  document.getElementById('export-csv-btn').addEventListener('click', () => BackupManager.exportCSV());

  const fileInput = document.getElementById('import-json-file-input');
  document.getElementById('trigger-import-json-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      BackupManager.importJSON(e.target.files[0]);
      fileInput.value = '';
    }
  });

  document.getElementById('clear-all-data-btn').addEventListener('click', async () => {
    if (confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ nhật ký của bạn trên máy này!\nBạn có chắc chắn muốn xóa không?')) {
      await StorageManager.clearAll();
      AppState.refresh();
      showToast('🗑️ Đã xóa sạch toàn bộ dữ liệu.');
    }
  });
}

// === 10. PWA Service Worker Registration & Install Prompt ===
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
        .catch((err) => console.log('Service Worker registration failed:', err));
    });
  }

  // Handle Android Install Prompt
  let deferredPrompt;
  const installBtn = document.getElementById('install-pwa-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'flex';
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });
}

// === App Entry Point ===
document.addEventListener('DOMContentLoaded', async () => {
  await StorageManager.init();
  await seedDefaultDataIfEmpty();
  initEventListeners();
  initPWA();
  await AppState.refresh();
});

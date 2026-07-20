// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setupEventListeners();
  updateLastUpdated();
  loadSavedState();
});

// Load tasks from data file and render
function loadTasks() {
  renderMorning();
  renderEvening();
  renderWeekly();
  renderMonthly();
  renderSeasonal();
  renderYearly();
}

// Render morning tasks
function renderMorning() {
  const container = document.getElementById('morning');
  container.innerHTML = '';
  tasks.morning.forEach((task, index) => {
    const taskId = `morning-${index}`;
    const checkbox = createCheckbox(taskId, task);
    container.appendChild(checkbox);
  });
}

// Render evening tasks
function renderEvening() {
  const container = document.getElementById('evening');
  container.innerHTML = '';
  tasks.evening.forEach((task, index) => {
    const taskId = `evening-${index}`;
    const checkbox = createCheckbox(taskId, task);
    container.appendChild(checkbox);
  });
}

// Render weekly tasks
function renderWeekly() {
  const container = document.getElementById('weekly');
  container.innerHTML = '';
  
  Object.entries(tasks.weekly).forEach(([day, dayTasks]) => {
    const dayGroup = document.createElement('div');
    dayGroup.className = 'day-group';
    
    const dayHeader = document.createElement('h3');
    dayHeader.textContent = day;
    dayGroup.appendChild(dayHeader);
    
    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    
    dayTasks.forEach((task, index) => {
      const taskId = `weekly-${day}-${index}`;
      const checkbox = createCheckbox(taskId, task);
      taskList.appendChild(checkbox);
    });
    
    dayGroup.appendChild(taskList);
    container.appendChild(dayGroup);
  });
}

// Render monthly tasks
function renderMonthly() {
  const container = document.getElementById('monthly');
  container.innerHTML = '';
  
  const monthlyGrid = document.createElement('div');
  monthlyGrid.className = 'monthly-day';
  
  Object.entries(tasks.monthly).forEach(([date, task]) => {
    const card = document.createElement('div');
    card.className = 'monthly-card';
    
    const taskId = `monthly-${date}`;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = taskId;
    input.className = 'task-checkbox';
    input.addEventListener('change', () => saveState());
    
    const label = document.createElement('label');
    label.htmlFor = taskId;
    
    const dateSpan = document.createElement('strong');
    dateSpan.textContent = date;
    
    const taskSpan = document.createElement('span');
    taskSpan.textContent = task;
    taskSpan.style.display = 'block';
    taskSpan.style.marginTop = '0.5rem';
    
    label.appendChild(dateSpan);
    label.appendChild(taskSpan);
    
    card.appendChild(input);
    card.appendChild(label);
    monthlyGrid.appendChild(card);
  });
  
  container.appendChild(monthlyGrid);
}

// Render seasonal tasks
function renderSeasonal() {
  const container = document.getElementById('seasonal');
  container.innerHTML = '';
  
  Object.entries(tasks.seasonal).forEach(([season, seasonTasks]) => {
    const seasonSection = document.createElement('div');
    seasonSection.className = 'seasonal-section';
    
    const seasonHeader = document.createElement('h4');
    seasonHeader.textContent = season;
    seasonSection.appendChild(seasonHeader);
    
    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    
    seasonTasks.forEach((task, index) => {
      const taskId = `seasonal-${season}-${index}`;
      const checkbox = createCheckbox(taskId, task);
      taskList.appendChild(checkbox);
    });
    
    seasonSection.appendChild(taskList);
    container.appendChild(seasonSection);
  });
}

// Render yearly tasks
function renderYearly() {
  const container = document.getElementById('yearly');
  container.innerHTML = '';
  tasks.yearly.forEach((task, index) => {
    const taskId = `yearly-${index}`;
    const checkbox = createCheckbox(taskId, task);
    container.appendChild(checkbox);
  });
}

// Create checkbox element
function createCheckbox(id, label) {
  const div = document.createElement('div');
  div.className = 'task-item';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.className = 'task-checkbox';
  input.addEventListener('change', () => saveState());
  
  const labelElem = document.createElement('label');
  labelElem.htmlFor = id;
  labelElem.className = 'task-label';
  labelElem.textContent = label;
  
  div.appendChild(input);
  div.appendChild(labelElem);
  
  return div;
}

// Setup event listeners
function setupEventListeners() {
  const todayBtn = document.getElementById('todayBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  
  todayBtn.addEventListener('click', resetToday);
  clearAllBtn.addEventListener('click', clearAll);
}

// Reset today's tasks
function resetToday() {
  const checkboxes = document.querySelectorAll('.task-checkbox');
  checkboxes.forEach(checkbox => {
    const id = checkbox.id;
    if (id.startsWith('morning-') || id.startsWith('evening-')) {
      checkbox.checked = false;
    }
  });
  saveState();
}

// Clear all tasks
function clearAll() {
  if (confirm('Are you sure you want to clear all checked tasks?')) {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    saveState();
  }
}

// Save state to localStorage
function saveState() {
  const state = {};
  const checkboxes = document.querySelectorAll('.task-checkbox');
  checkboxes.forEach(checkbox => {
    state[checkbox.id] = checkbox.checked;
  });
  localStorage.setItem('cleaningTrackerState', JSON.stringify(state));
  updateLastUpdated();
}

// Load state from localStorage
function loadSavedState() {
  const saved = localStorage.getItem('cleaningTrackerState');
  if (saved) {
    const state = JSON.parse(saved);
    Object.entries(state).forEach(([id, checked]) => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = checked;
      }
    });
  }
}

// Update last updated timestamp
function updateLastUpdated() {
  const lastUpdatedElem = document.getElementById('lastUpdated');
  const now = new Date();
  const timeString = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  lastUpdatedElem.textContent = timeString;
}

// Service worker registration for PWA support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {
    console.log('Service Worker not supported or failed to register');
  });
}
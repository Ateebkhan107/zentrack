
// ZenTrack - Daily Motivation & Productivity Tracker
// JavaScript functionality for all features

class ZenTracker {
    constructor() {
      this.initializeApp();
      this.setupEventListeners();
      this.loadSavedData();
    }
  
    // Initialize the application
    initializeApp() {
      console.log('🧘‍♀️ ZenTracker initialized');
      
      // Set current date for journal
      this.updateJournalDate();
      
      // Load daily quote
      this.loadDailyQuote();
      
      // Initialize timer
      this.initializeTimer();
      
      // Load dark mode preference
      this.loadThemePreference();
    }
  
    // Set up all event listeners
    setupEventListeners() {
      // Dark mode toggle
      document.getElementById('darkModeToggle').addEventListener('click', () => {
        this.toggleDarkMode();
      });
  
      // Quote section
      document.getElementById('newQuoteBtn').addEventListener('click', () => {
        this.loadNewQuote();
      });
  
      // Todo section
      document.getElementById('addTodoBtn').addEventListener('click', () => {
        this.addTodo();
      });
      
      document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addTodo();
        }
      });
  
      // Journal section
      document.getElementById('saveJournalBtn').addEventListener('click', () => {
        this.saveJournal();
      });
      
      // Auto-save journal every 30 seconds while typing
      let journalTimer;
      document.getElementById('journalText').addEventListener('input', () => {
        clearTimeout(journalTimer);
        journalTimer = setTimeout(() => {
          this.autoSaveJournal();
        }, 30000);
      });
  
      // Timer section
      document.getElementById('startTimerBtn').addEventListener('click', () => {
        this.startTimer();
      });
      
      document.getElementById('pauseTimerBtn').addEventListener('click', () => {
        this.pauseTimer();
      });
      
      document.getElementById('resetTimerBtn').addEventListener('click', () => {
        this.resetTimer();
      });
  
      // Timer settings
      document.getElementById('focusMinutes').addEventListener('change', () => {
        this.updateTimerSettings();
      });
      
      document.getElementById('breakMinutes').addEventListener('change', () => {
        this.updateTimerSettings();
      });
    }
  
    // Load all saved data from localStorage
    loadSavedData() {
      this.loadTodos();
      this.loadJournal();
      this.loadTimerSettings();
    }
  
    // ==================== DARK MODE FUNCTIONALITY ====================
    
    toggleDarkMode() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('zentrack-theme', newTheme);
      
      console.log(`🌙 Theme switched to: ${newTheme}`);
    }
  
    loadThemePreference() {
      const savedTheme = localStorage.getItem('zentrack-theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  
    // ==================== QUOTE FUNCTIONALITY ====================
    
    async loadDailyQuote() {
      const quoteContainer = document.getElementById('quoteContainer');
      const quoteText = document.getElementById('quoteText');
      const quoteAuthor = document.getElementById('quoteAuthor');
      
      // Check if we already have today's quote
      const today = new Date().toDateString();
      const savedQuote = localStorage.getItem('zentrack-daily-quote');
      const savedDate = localStorage.getItem('zentrack-quote-date');
      
      if (savedQuote && savedDate === today) {
        const quote = JSON.parse(savedQuote);
        this.displayQuote(quote);
        return;
      }
      
      // Fetch new quote
      try {
        quoteText.innerHTML = '<div class="loading"></div> Loading inspiration...';
        
        const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=200');
        const quote = await response.json();
        
        // Save today's quote
        localStorage.setItem('zentrack-daily-quote', JSON.stringify(quote));
        localStorage.setItem('zentrack-quote-date', today);
        
        this.displayQuote(quote);
        console.log('📜 Daily quote loaded successfully');
        
      } catch (error) {
        console.error('❌ Error loading quote:', error);
        this.displayFallbackQuote();
      }
    }
  
    async loadNewQuote() {
      const quoteText = document.getElementById('quoteText');
      
      try {
        quoteText.innerHTML = '<div class="loading"></div> Finding new inspiration...';
        
        const response = await fetch('https://api.quotable.io/random?minLength=30&maxLength=200');
        const quote = await response.json();
        
        this.displayQuote(quote);
        console.log('🔄 New quote loaded');
        
      } catch (error) {
        console.error('❌ Error loading new quote:', error);
        this.displayFallbackQuote();
      }
    }
  
    displayQuote(quote) {
      const quoteText = document.getElementById('quoteText');
      const quoteAuthor = document.getElementById('quoteAuthor');
      
      // Add fade effect
      const quoteContainer = document.getElementById('quoteContainer');
      quoteContainer.style.opacity = '0';
      
      setTimeout(() => {
        quoteText.textContent = quote.content;
        quoteAuthor.textContent = `— ${quote.author}`;
        quoteContainer.style.opacity = '1';
      }, 300);
    }
  
    displayFallbackQuote() {
      const fallbackQuotes = [
        { content: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
      ];
      
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      this.displayQuote(randomQuote);
    }
  
    // ==================== TODO FUNCTIONALITY ====================
    
    addTodo() {
      const todoInput = document.getElementById('todoInput');
      const todoText = todoInput.value.trim();
      
      if (!todoText) {
        todoInput.focus();
        return;
      }
      
      const todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      this.saveTodo(todo);
      this.renderTodo(todo);
      
      todoInput.value = '';
      todoInput.focus();
      
      this.updateTodoStats();
      console.log('✅ Todo added:', todoText);
    }
  
    saveTodo(todo) {
      const todos = this.getTodos();
      todos.push(todo);
      localStorage.setItem('zentrack-todos', JSON.stringify(todos));
    }
  
    getTodos() {
      const todos = localStorage.getItem('zentrack-todos');
      return todos ? JSON.parse(todos) : [];
    }
  
    loadTodos() {
      const todos = this.getTodos();
      const todoList = document.getElementById('todoList');
      todoList.innerHTML = '';
      
      todos.forEach(todo => {
        this.renderTodo(todo);
      });
      
      this.updateTodoStats();
    }
  
    renderTodo(todo) {
      const todoList = document.getElementById('todoList');
      const todoItem = document.createElement('li');
      todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      todoItem.setAttribute('data-id', todo.id);
      
      todoItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.text}</span>
        <button class="todo-delete">Delete</button>
      `;
      
      // Add event listeners
      const checkbox = todoItem.querySelector('.todo-checkbox');
      const deleteBtn = todoItem.querySelector('.todo-delete');
      
      checkbox.addEventListener('change', () => {
        this.toggleTodo(todo.id);
      });
      
      deleteBtn.addEventListener('click', () => {
        this.deleteTodo(todo.id);
      });
      
      todoList.appendChild(todoItem);
    }
  
    toggleTodo(id) {
      const todos = this.getTodos();
      const todo = todos.find(t => t.id === id);
      
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('zentrack-todos', JSON.stringify(todos));
        
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        todoItem.classList.toggle('completed', todo.completed);
        
        this.updateTodoStats();
        console.log(`✅ Todo ${todo.completed ? 'completed' : 'uncompleted'}:`, todo.text);
      }
    }
  
    deleteTodo(id) {
      const todos = this.getTodos();
      const filteredTodos = todos.filter(t => t.id !== id);
      localStorage.setItem('zentrack-todos', JSON.stringify(filteredTodos));
      
      const todoItem = document.querySelector(`[data-id="${id}"]`);
      todoItem.style.transform = 'translateX(-100%)';
      todoItem.style.opacity = '0';
      
      setTimeout(() => {
        todoItem.remove();
        this.updateTodoStats();
      }, 300);
      
      console.log('🗑️ Todo deleted');
    }
  
    updateTodoStats() {
      const todos = this.getTodos();
      const remaining = todos.filter(t => !t.completed).length;
      const total = todos.length;
      
      const statsElement = document.getElementById('todoStats');
      if (total === 0) {
        statsElement.textContent = 'No tasks yet. Add one above!';
      } else if (remaining === 0) {
        statsElement.textContent = '🎉 All tasks completed! Great job!';
      } else {
        statsElement.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining of ${total}`;
      }
    }
  
    // ==================== JOURNAL FUNCTIONALITY ====================
    
    updateJournalDate() {
      const journalDate = document.getElementById('journalDate');
      const today = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      journalDate.textContent = today.toLocaleDateString('en-US', options);
    }
  
    saveJournal() {
      const journalText = document.getElementById('journalText').value.trim();
      const today = new Date().toDateString();
      
      if (!journalText) {
        this.showJournalStatus('Please write something first!', 'error');
        return;
      }
      
      const journalEntry = {
        date: today,
        content: journalText,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('zentrack-journal', JSON.stringify(journalEntry));
      this.showJournalStatus('Journal entry saved! ✨', 'success');
      
      console.log('📝 Journal entry saved for:', today);
    }
  
    autoSaveJournal() {
      const journalText = document.getElementById('journalText').value.trim();
      
      if (journalText) {
        const today = new Date().toDateString();
        const journalEntry = {
          date: today,
          content: journalText,
          timestamp: new Date().toISOString(),
          autoSaved: true
        };
        
        localStorage.setItem('zentrack-journal', JSON.stringify(journalEntry));
        this.showJournalStatus('Auto-saved', 'success');
        console.log('💾 Journal auto-saved');
      }
    }
  
    loadJournal() {
      const savedJournal = localStorage.getItem('zentrack-journal');
      const today = new Date().toDateString();
      
      if (savedJournal) {
        const journal = JSON.parse(savedJournal);
        
        // Only load if it's today's entry
        if (journal.date === today) {
          document.getElementById('journalText').value = journal.content;
          
          if (journal.autoSaved) {
            this.showJournalStatus('Previous entry restored', 'info');
          }
        }
      }
    }
  
    showJournalStatus(message, type = 'success') {
      const statusElement = document.getElementById('journalStatus');
      statusElement.textContent = message;
      statusElement.className = `journal-status ${type}`;
      
      setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = 'journal-status';
      }, 3000);
    }
  
    // ==================== TIMER FUNCTIONALITY ====================
    
    initializeTimer() {
      this.timerState = {
        isRunning: false,
        isPaused: false,
        currentTime: 25 * 60, // 25 minutes in seconds
        isBreakTime: false,
        focusMinutes: 25,
        breakMinutes: 5,
        interval: null
      };
      
      this.updateTimerDisplay();
    }
  
    loadTimerSettings() {
      const savedSettings = localStorage.getItem('zentrack-timer-settings');
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.timerState.focusMinutes = settings.focusMinutes || 25;
        this.timerState.breakMinutes = settings.breakMinutes || 5;
        
        document.getElementById('focusMinutes').value = this.timerState.focusMinutes;
        document.getElementById('breakMinutes').value = this.timerState.breakMinutes;
        
        // Reset current time to match settings
        this.timerState.currentTime = this.timerState.focusMinutes * 60;
        this.updateTimerDisplay();
      }
    }
  
    updateTimerSettings() {
      const focusMinutes = parseInt(document.getElementById('focusMinutes').value) || 25;
      const breakMinutes = parseInt(document.getElementById('breakMinutes').value) || 5;
      
      this.timerState.focusMinutes = focusMinutes;
      this.timerState.breakMinutes = breakMinutes;
      
      // Save settings
      const settings = { focusMinutes, breakMinutes };
      localStorage.setItem('zentrack-timer-settings', JSON.stringify(settings));
      
      // Reset timer if not running
      if (!this.timerState.isRunning) {
        this.timerState.currentTime = this.timerState.isBreakTime ? 
          this.timerState.breakMinutes * 60 : 
          this.timerState.focusMinutes * 60;
        this.updateTimerDisplay();
      }
      
      console.log('⚙️ Timer settings updated:', settings);
    }
  
    startTimer() {
      if (this.timerState.isRunning) return;
      
      this.timerState.isRunning = true;
      this.timerState.isPaused = false;
      
      // Update UI
      document.getElementById('startTimerBtn').textContent = 'Running...';
      document.querySelector('.timer-section').classList.add('timer-active');
      
      this.timerState.interval = setInterval(() => {
        this.timerState.currentTime--;
        this.updateTimerDisplay();
        
        if (this.timerState.currentTime <= 0) {
          this.timerComplete();
        }
      }, 1000);
      
      console.log(`⏰ Timer started: ${this.timerState.isBreakTime ? 'Break' : 'Focus'} time`);
    }
  
    pauseTimer() {
      if (!this.timerState.isRunning) return;
      
      this.timerState.isRunning = false;
      this.timerState.isPaused = true;
      
      clearInterval(this.timerState.interval);
      
      // Update UI
      document.getElementById('startTimerBtn').textContent = 'Resume';
      document.querySelector('.timer-section').classList.remove('timer-active');
      
      console.log('⏸️ Timer paused');
    }
  
    resetTimer() {
      this.timerState.isRunning = false;
      this.timerState.isPaused = false;
      
      clearInterval(this.timerState.interval);
      
      // Reset time based on current mode
      this.timerState.currentTime = this.timerState.isBreakTime ? 
        this.timerState.breakMinutes * 60 : 
        this.timerState.focusMinutes * 60;
      
      this.updateTimerDisplay();
      
      // Update UI
      document.getElementById('startTimerBtn').textContent = 'Start';
      document.querySelector('.timer-section').classList.remove('timer-active');
      
      console.log('🔄 Timer reset');
    }
  
    timerComplete() {
      this.timerState.isRunning = false;
      clearInterval(this.timerState.interval);
      
      // Play notification sound
      this.playNotificationSound();
      
      // Switch between focus and break
      this.timerState.isBreakTime = !this.timerState.isBreakTime;
      
      // Set new time
      this.timerState.currentTime = this.timerState.isBreakTime ? 
        this.timerState.breakMinutes * 60 : 
        this.timerState.focusMinutes * 60;
      
      this.updateTimerDisplay();
      
      // Update UI
      document.getElementById('startTimerBtn').textContent = 'Start';
      document.querySelector('.timer-section').classList.remove('timer-active');
      
      // Show notification
      const message = this.timerState.isBreakTime ? 
        '🎉 Focus session complete! Time for a break.' : 
        '⚡ Break time over! Ready to focus?';
      
      this.showTimerNotification(message);
      
      console.log(`✅ Timer complete: ${this.timerState.isBreakTime ? 'Starting break' : 'Break ended'}`);
    }
  
    updateTimerDisplay() {
      const minutes = Math.floor(this.timerState.currentTime / 60);
      const seconds = this.timerState.currentTime % 60;
      
      const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      document.getElementById('timerDisplay').textContent = display;
      
      // Update mode display
      const mode = this.timerState.isBreakTime ? 'Break Time' : 'Focus Time';
      document.getElementById('timerMode').textContent = mode;
      
      // Update page title with timer
      if (this.timerState.isRunning) {
        document.title = `${display} - ${mode} | ZenTrack`;
      } else {
        document.title = 'ZenTrack - Daily Motivation & Productivity Tracker';
      }
    }
  
    playNotificationSound() {
      const audio = document.getElementById('timerSound');
      audio.play().catch(error => {
        console.log('🔇 Could not play notification sound:', error);
      });
    }
  
    showTimerNotification(message) {
      // Create a simple notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ZenTrack Timer', {
          body: message,
          icon: '/favicon.ico'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('ZenTrack Timer', {body: message});
          }
        });
      }
      
      // Fallback: show an alert
      setTimeout(() => {
        alert(message);
      }, 100);
    }
  }
  
  // Initialize the application when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new ZenTracker();
  });
  
  // Request notification permission on load
  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      Notification.requestPermission();
    }, 2000);
  }
  
# ZenTrack

**ZenTrack** is a modern, beautifully designed productivity web app that combines daily motivational quotes, a Pomodoro-style focus timer, a task manager, and a daily journal—all in a single workspace. The goal: to help you stay mindful, motivated, and focused throughout your day.

## ✨ Features

- **Daily Motivational Quote**  
  Get a fresh, inspiring quote every day (or fetch a new one anytime!)

- **Simple To-Do List Manager**  
  Add, finish, and remove daily tasks. See stats and stay motivated to clear your list.

- **Pomodoro-Style Focus Timer**  
  Customizable focus & break intervals. Get browser notifications and sound alerts when time is up.

- **Daily Journal**  
  Reflect every day. Autosave & restore your writing—never lose your thoughts.

- **Dark / Light Theme Toggle**  
  Soothing light & dark modes. Theme is remembered across visits.

## 🖥 Demo

> _Add link here if deployed_

## 🚀 Getting Started

### 1. Download or Clone

```bash
git clone https://github.com/your-username/zentrack.git
cd zentrack
```

### 2. Open Locally

Just open `index.html` in your browser.  
_All data (tasks, journal, preferences) is stored locally in the browser._

No servers, accounts, or installations required!

## 📂 Project Structure

```
zentrack/
│
├── index.html          # Main HTML file
├── style.css           # Modern responsive styles (light & dark)
├── script.js           # App logic: todos, timer, journal, quotes, theme
├── README.md           # This file
└── assets/             # (Optional: fonts, icons, sound)
```

## ⚙️ Customization

- **Timer Settings**:  
  Adjust focus & break durations right in the UI (default: 25/5 min Pomodoro).
- **Quotes**:  
  Pulls new quotes via [Quotable API](https://api.quotable.io).
- **Theme**:  
  Click the sun/moon toggle in the header to switch themes.

## 🛡️ Privacy

All your data **stays on your device** (uses localStorage).  
No account or cloud sync—perfect for personal workflows.

## 📝 How it Works

- **Tasks:**  
  Add, complete, and delete. Progress updates dynamically.
- **Timer:**  
  Start/stop/pause/reset. Switches between focus/break automatically, with sound/notifications.
- **Journal:**  
  Saved and auto-saved daily. Each day is a new blank; previous day's writing won’t appear.
- **Quotes:**  
  Loads one motivational quote each day (with fallback if API fails).

## 📱 Responsive Design

ZenTrack is fully responsive—usable on desktops, tablets, and phones.

## 🙏 Credits

- [Quotable API](https://api.quotable.io/) for quotes
- Emoji icons from [Twitter Emoji](https://twemoji.twitter.com/)
- Open source web fonts

## 🪴 License

MIT License.  
You are free to use, modify, and share.

## 💡 Inspiration

ZenTrack was built as a mindful, minimal workspace to help anyone balance productivity and well-being—no accounts, no distractions, just your day.

**Enjoy focused, mindful productivity!** 😊

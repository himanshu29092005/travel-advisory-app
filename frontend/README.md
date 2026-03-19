# ✈️ TravelMadeEazy

> AI-Powered Travel Advisor — Plan your perfect trip with live weather, budget planning, and AI suggestions!

![TravelMadeEazy](https://img.shields.io/badge/TravelMadeEazy-Live-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13-blue)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama3-orange)

---

## 🌟 Features

- 🌤️ **Live Weather** — Real-time weather of any city using OpenWeather API
- 🤖 **AI Travel Advisor** — Personalized trip plans using Groq (Llama 3.3)
- 💰 **Budget Planning** — Set your budget and get suggestions accordingly
- 🎯 **Interest Based** — Mountains, Beach, Food, Adventure and more!
- 📱 **Responsive UI** — Beautiful, modern React frontend

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Python + FastAPI |
| AI Model | Groq (Llama 3.3 70B) |
| Weather | OpenWeather API |
| Styling | CSS-in-JS |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/himanshu29092005/travel-advisory-app.git
cd travel-advisory-app
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file in backend folder:
```
OPENWEATHER_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
```

Run backend:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in Browser
```
Frontend → http://localhost:5173
Backend  → http://localhost:8000
API Docs → http://localhost:8000/docs
```

---

## 📸 Screenshots

### Home Page
![Home](screenshots/home.png)

### AI Response
![AI](screenshots/ai.png)

---

## 🔑 API Keys Required

| API | Link | Free? |
|-----|------|-------|
| OpenWeather | [openweathermap.org](https://openweathermap.org/api) | ✅ Free |
| Groq | [console.groq.com](https://console.groq.com) | ✅ Free |

---

## 👨‍💻 Developer

**Himanshu** — Built with ❤️

[![GitHub](https://img.shields.io/badge/GitHub-himanshu29092005-black)](https://github.com/himanshu29092005)

---

## 📄 License

MIT License — Free to use and modify!



# Decisio — Frontend

> AI-Powered Probabilistic Decision Intelligence Platform

## What It Does

Decisio is a structured decision analysis tool. Users score key factors about a decision, and the system returns a mathematical verdict, regret probability, simulation range, and AI explanation — not a chatbot, a decision engine.

---

## Tech Stack

- **React** — UI framework
- **Vite** — build tool
- **Tailwind CSS v3** — styling
- **Axios** — API requests
- **React Router** — navigation

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | JWT authentication |
| Register | `/register` | Create account |
| New Decision | `/` | Score a decision and analyze it |
| Result | `/result/:id` | Full breakdown with AI analysis |
| History | `/history` | All past decisions |
| Analytics | `/analytics` | Behavioral patterns over time |

---

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Desktop + mobile navigation
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── NewDecision.jsx     # Decision input with sliders
│   ├── DecisionResult.jsx  # Score rings + AI analysis
│   ├── History.jsx         # Decision history list
│   └── Analytics.jsx       # Behavioral dashboard
├── services/
│   └── api.js              # Axios instance + JWT interceptor
├── App.jsx                 # Router + protected routes
└── index.css               # Tailwind + global styles
```

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/decisio-frontend.git
cd decisio-frontend
npm install
```

### 2. Point to Your Backend

Open `src/services/api.js` and make sure the `baseURL` points to your backend:

```js
const api = axios.create({
  baseURL: 'http://localhost:8000',
})
```

### 3. Run

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## How It Works

1. User registers and logs in — gets a JWT token stored in localStorage
2. Every API request automatically carries the token via Axios interceptor
3. User fills in decision title and scores 5 factors on 1–10 sliders
4. Backend runs the engine → returns score, verdict, regret probability
5. Result page shows score rings, input breakdown, and AI analysis
6. History and Analytics pages track patterns over time

---

## Design

- **Theme** — Dark, minimal, clean (Notion/Linear inspired)
- **Accent** — Violet `#7c3aed`
- **Font** — Inter
- **Mobile** — Fully responsive with bottom tab navigation
- **Desktop** — Top navbar with active state indicators

---

## Backend

This frontend requires the Decisio backend to be running.
Backend repo: https://github.com/onchainkaiser/decisio-backend

---

## Author

Built by David — full stack decision intelligence system.
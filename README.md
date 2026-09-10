# InterviewReady AI — Full-Stack AI Placement Interview Coach for B.Tech Students

> **Prepare. Practice. Improve. Get Interview Ready.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS_3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini 3.6 Flash](https://img.shields.io/badge/AI_Engine-Gemini_3.6_Flash-8E75B2.svg?logo=google&logoColor=white)](https://ai.google.dev)
[![Deployment](https://img.shields.io/badge/Deploy-Render_Cloud-46E3B7.svg?logo=render&logoColor=black)](https://render.com)

**InterviewReady AI** is an enterprise-grade, full-stack placement preparation platform engineered specifically for engineering students (CSE, IT, ECE, EEE, Mechanical, Civil). It is **not** a basic question-and-answer app—it acts as an elite personal placement coach guiding candidates from pre-interview preparation to real-time voice-interactive mock interviews, live behavioral telemetry, and post-interview diagnostic reports.

---

## 🚀 Key Specifications & Features

### 1. 💬 24/7 AI Placement Mentor Floating Chatbot
- **Always Accessible:** Slide-out glassmorphic drawer floating on all application views.
- **Quick-Start Guidance:** One-click recommendation chips for:
  - 🌟 **STAR Method Framework:** Structured behavioral response formula (*Situation, Task, Action, Result*).
  - 🎯 **"Tell Me About Yourself" Pitch:** Present → Past → Future 90-second formula.
  - 💻 **5-Step DSA Approach:** Clarify → Brute-force → Optimize Big-O → Modular code → Edge-case trace.
  - 📄 **ATS Resume Guidelines:** Google X-Y-Z formula for bullet points.
  - ⚖️ **Weakness / Strength Handling:** Authentic vulnerability + active remediation strategy.
- **Accessibility & UX:** Includes **Text-to-Speech voice readout (🔊 Listen)** and one-click answer copying (📋 Copy).
- **Resilient AI Pipeline:** Queries the backend `/api/chat/ask` backed by **Google Gemini 3.6 Flash**, with an intelligent deterministic placement guidance fallback for offline or zero-key environments.

### 2. 👨👩 In-Session Male & Female Animated Video Interviewers
- **Photorealistic Talking Avatars:** Real-time canvas mouth morphing, dynamic viseme movement, natural breathing curves, and periodic eye-blinking loops synchronized with Web Speech API synthesis.
- **Multi-Persona Panel:**
  - **👨 Vikram Malhotra (Male):** VP of Engineering & Tech Lead — Systems architecture & deep technical drills.
  - **👩 Priya Sharma (Female):** Director of Talent Acquisition — Behavioral STAR & culture fit.
  - **👩‍💼 Dr. Sarah Jenkins (Female):** Principal Architect & Bar-Raiser — Algorithmic edge cases & strict probing.
- **In-Session Switching:** Switch between male and female interviewers directly inside the live interview room with real-time adaptive voice pitch and tone synthesis.

### 3. 📄 ATS Resume Analyzer & PDF Parser
- **Robust PDF & Document Extraction:** Built-in PDF reader (`pypdf>=5.0.0`) with multi-engine fallback to handle single-page, multi-page, and text-based resume files without crashing.
- **ATS Compatibility Scoring (0–100):** Evaluates keyword density, measurable metrics, missing sections, and formatting.
- **Automatic Question Generation:** Deep-mines candidate projects and internships to generate real-world technical architecture and trade-off questions.

### 4. 🎙️ Realistic Voice & Video Mock Interview Room
- **Hardware Pre-Check:** Live webcam feed, microphone input meter, and environment diagnostics.
- **Candidate Video PIP:** Picture-in-Picture candidate webcam with real-time behavioral HUD badges.
- **Full-Screen Theater Studio Mode:** Immersive interview setting simulating high-stakes corporate hiring rounds.
- **Progressive Hint Engine:** "Need a Hint" system providing layered coaching hints without failing the student.

### 5. 🛠️ Branch-Specific Technical Drills
- Tailored question banks across 6 engineering disciplines:
  - **CSE:** DSA, OOP, DBMS Normalization, OS Concurrency, Computer Networks, SQL.
  - **IT:** Web Architecture, REST APIs, Microservices, Cloud Systems.
  - **ECE:** Digital Electronics, 8085/8086/ARM Microprocessors, Embedded C.
  - **EEE:** Circuit Theory, Electrical Machines, Transformers, Power Transmission.
  - **Mechanical:** Thermodynamics, 4-Stroke IC Engines, Fluid Dynamics, CAD/CAM.
  - **Civil:** Structural Analysis, Concrete Slump Tests, Surveying, RCC Design.

### 6. 📊 Diagnostic Report Card & Continuous Tracking
- Detailed scores across Technical, Communication, Confidence, and Structure.
- Question-by-question breakdown with ideal sample answers and actionable next steps.

---

## 🛠️ Architecture & Tech Stack

```
interviewready-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application & route aggregator
│   │   ├── config.py            # Environment settings & GEMINI_API_KEY loader
│   │   ├── database.py          # SQLite schema & session manager
│   │   ├── schemas.py           # Pydantic request & response models
│   │   ├── seed_data.py         # Demo profiles, sample resumes & question banks
│   │   ├── routers/             # Modular API endpoints
│   │   │   ├── chat.py          # /api/chat/ask endpoint (Gemini 3.6 Flash)
│   │   │   ├── resume.py        # /api/resume/upload & /api/resume/analyze
│   │   │   ├── interview.py     # /api/interview/start, /answer, /hint, /report
│   │   │   ├── communication.py # /api/communication/analyze-intro
│   │   │   ├── etiquette.py     # /api/etiquette/scenarios & /submit
│   │   │   ├── technical.py     # /api/technical/{branch}
│   │   │   ├── roadmap.py       # /api/roadmap/{user_id}
│   │   │   └── auth_profile.py  # /api/profile management
│   │   └── services/            # Business logic & LLM wrappers
│   │       ├── llm_service.py   # Gemini 3.6 Flash integration
│   │       ├── interview_engine.py # Adaptive interview question selector
│   │       └── resume_service.py   # ATS scoring heuristics
│   └── requirements.txt         # Backend Python dependencies
├── frontend/
│   ├── public/
│   │   └── interviewers/        # High-definition avatar images (Vikram, Priya, Sarah)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatBot.jsx    # 24/7 AI Placement Mentor Drawer Widget
│   │   │   ├── TalkingAvatar.jsx# Canvas lip-sync & eye-blinking renderer
│   │   │   ├── LiveInterviewRoom.jsx # Live video room with switcher
│   │   │   ├── ResumeAnalyzer.jsx    # Interactive PDF paper viewer & ATS audit
│   │   │   ├── TechnicalPrep.jsx     # Branch drills (CSE, IT, ECE, EEE, ME, CE)
│   │   │   ├── CommunicationTrainer.jsx # 90-sec pitch speech analyzer
│   │   │   ├── EtiquetteSimulator.jsx   # Situational behavioral rounds
│   │   │   └── Navbar.jsx            # Global navigation
│   │   ├── context/StudentContext.jsx# Application state management
│   │   ├── services/api.js      # Axios/Fetch client
│   │   └── App.jsx              # Main view switcher
│   ├── package.json
│   └── vite.config.js
└── render.yaml                  # Cloud deployment blueprint specification
```

---

## ☁️ Render Blueprint Specification (`render.yaml`)

```yaml
services:
  - type: web
    name: interviewready-ai
    env: python
    region: singapore
    plan: free
    buildCommand: "cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: NODE_VERSION
        value: 20.10.0
      - key: GEMINI_API_KEY
        sync: false
```

---

## ⚡ Local Development Setup

### 1. Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 2. Frontend Server
```bash
cd frontend
npm install
npm run dev
```
- Frontend Dev Server: `http://localhost:5173/`

---

## 🚀 How to Publish to GitHub

### Method 1: Using the 1-Click Desktop Launcher (Windows)
1. Go to your Desktop.
2. Double-click **`Push Updates to Live Render.bat`**.
3. If prompted by Windows Git Credential Manager, click **Authorize in Browser**. All commits will be pushed instantly!

### Method 2: Using the Git CLI
Open PowerShell or your terminal and run:
```powershell
cd C:\Users\sekha\.gemini\antigravity\scratch\repo_clone
git add .
git commit -m "Publish InterviewReady AI with all features and specifications"
git push origin main
```

### Method 3: Using GitHub Personal Access Token (PAT)
If you don't have Git credentials configured:
1. Generate a GitHub PAT with `repo` scope at: [GitHub Settings ➔ Tokens](https://github.com/settings/tokens).
2. Run:
```powershell
cd C:\Users\sekha\.gemini\antigravity\scratch\repo_clone
python push_to_github.py <YOUR_GITHUB_PAT>
```

---

## 📄 License
MIT License. Built for B.Tech students preparing for campus placements and technical interviews.

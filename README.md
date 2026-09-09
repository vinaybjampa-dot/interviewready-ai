# InterviewReady AI — AI Placement Interview Coach for B.Tech Students

> **Prepare. Practice. Improve. Get Interview Ready.**

**InterviewReady AI** is a complete, full-stack placement preparation platform engineered specifically for engineering students (CSE, IT, ECE, EEE, Mechanical, Civil). It is **not** a simple question-and-answer chatbot—it behaves like a comprehensive personal placement coach guiding the candidate from pre-interview preparation to live voice-interactive mock interviews and post-interview diagnostic reports.

---

## 🚀 Key Features

### 1. Student Profile & Step-by-Step Onboarding Wizard
- Collects academic credentials (Branch, Year, CGPA), skills, projects, internships, target companies, and self-identified weak areas without overwhelming forms.
- Pre-seeded **1-Click Demo Candidate (Rahul, 4th Year B.Tech CSE, 8.2 CGPA)** for immediate evaluation.

### 2. Personalized Preparation Roadmap & Readiness Score
- Generates a calculated **Placement Readiness Score (0–100%)** broken down into:
  - Technical Skills
  - Communication
  - Resume Quality
  - HR & Behavioral Preparation
  - Confidence
- Delivers a structured **3-Week Syllabus** tailored to the student's branch and skill gaps.

### 3. Pre-Interview Preparation & Company Research Desk
- Interactive company research checklist (Core business, products, industry, recent news, job description mapping, candidate questions).

### 4. Dress & Grooming Guidance
- Practical, professional attire and grooming guidelines for **Men and Women** (clothing, footwear, accessories, personal presentation).
- Strict non-judgmental, inclusive ethical design: focuses purely on professional workplace presentation without evaluating physical appearance or stereotypes.

### 5. Interview Etiquette Simulation Lab
- Interactive situational simulations:
  - Knocking on the interview door and entering smoothly
  - Sitting posture and thanking the panel
  - Handling interviewer disagreement with intellectual humility
  - Dealing with "I don't know" gracefully
  - Asking thoughtful candidate closing questions

### 6. Resume ATS Analyzer & Automatic Interview Question Generator
- Evaluates ATS compatibility, missing sections, and quantifiable metrics.
- **Deep-Dive Question Generation:** Automatically turns projects, internships, and tools into challenging interview questions (architecture walkthrough, latency bottlenecks, tech trade-offs, scalability).

### 7. Communication & "Tell Me About Yourself" Speech Lab
- Practice the 90-second elevator pitch using microphone voice input or text.
- Analyzes speaking clarity, estimated duration, structure score (Present → Education → Skills → Projects → Achievements → Career Goal).
- Detects and counts vocal filler words (`um`, `uh`, `like`, `you know`, `actually`, `basically`).
- Provides authentic, non-judgmental feedback and a personalized model answer.

### 8. Branch-Specific Technical Preparation
- Dynamically customizes subject drills across all 6 engineering disciplines:
  - **CSE:** DSA, OOP, DBMS, OS, Computer Networks, SQL
  - **IT:** Web & Cloud Architecture, REST APIs, Microservices, Databases
  - **ECE:** Digital Electronics, Microprocessors (8085/8086/ARM), Embedded Systems
  - **EEE:** Circuit Theory, Electrical Machines, Transformers, Power Systems
  - **Mechanical:** Thermodynamics, Four-Stroke IC Engines, Fluid Mechanics, CAD/CAM
  - **Civil:** Structural Slabs, Concrete Technology, Slump Tests, Surveying

### 9. Special Feature: Realistic AI Mock Interview Room
- **Pre-Flight Hardware Check:** Live webcam preview, microphone input level meter, and environment checklist.
- **Configurable Interviewer:**
  - Tone / Personality: *Friendly*, *Professional*, *Strict*, *Technical*, *HR*
  - Difficulty: *Beginner*, *Intermediate*, *Advanced*, *Company Simulation (TCS, Infosys, Amazon, etc.)*
- **Live Room Simulation:**
  - AI Interviewer animated avatar with speaking state indicators.
  - **Text-to-Speech (TTS):** The AI interviewer speaks questions aloud with mute/replay controls.
  - **Speech-to-Text (STT):** Candidate answers verbally using microphone with live captioning.
  - **Candidate Video PIP:** Picture-in-picture webcam feed.
  - **Adaptive Engine:** Asks dynamic follow-up questions tailored to the candidate's exact responses.
  - **"I Don't Know / Need a Hint" Feature:** Provides progressive hints without penalizing the candidate, turning tough moments into active learning opportunities.

### 10. Post-Interview Report Card & Continuous Tracking
- Comprehensive score out of 100 with category bars.
- Strengths and weaknesses diagnostic review.
- Detailed question-by-question review with ideal answer tips.
- **Actionable Daily Recommendation:** Specific next steps based on candidate performance.
- Multi-interview progress analytics with trajectory line charts and competency radar.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Tailwind CSS, Lucide React, Recharts, Web Speech API (SpeechRecognition & SpeechSynthesis), MediaStream API.
- **Backend:** Python 3.14, FastAPI, Uvicorn, SQLite, Pydantic, HTTPX.
- **AI Integration:** Google Gemini API integration (`GEMINI_API_KEY`) with an intelligent, heuristic NLP fallback engine for 100% offline and zero-config operation.

---

## ⚡ Quick Start

### 1. Launch the Backend Server
```bash
cd backend
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- API is running at: `http://127.0.0.1:8000/api`
- Interactive Swagger docs: `http://127.0.0.1:8000/docs`
- The backend automatically serves the built frontend at: `http://127.0.0.1:8000/`

### 2. (Optional) Run Frontend in Dev Mode with Hot Reload
```bash
cd frontend
npm run dev
```
- Accessible at: `http://localhost:5173` (with automatic proxy to backend on port 8000)

### 3. Run Automated Tests
```bash
cd backend
py -m pytest tests -v
```
All 9 automated unit and integration tests pass verifying profile creation, resume ATS question generation, etiquette scoring, speech analysis, and full interview lifecycles.

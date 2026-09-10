import os
import logging
import httpx
from pydantic import BaseModel
from fastapi import APIRouter
from ..config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["AI Placement Mentor"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

SYSTEM_PROMPT = """You are InterviewReady AI Placement Coach, an elite campus recruitment and technical placement mentor for B.Tech students.
Your mission is to clarify candidates' doubts about campus placements, technical rounds, HR/behavioral interviews, resume optimization, and coding challenges.
Always provide structured, encouraging, highly actionable advice with bullet points, examples, and frameworks (like STAR method, Google X-Y-Z resume formula, or 5-step DSA coding framework).
Keep responses clear, concise, professional, and visually easy to read using markdown."""

def get_offline_placement_guidance(query: str) -> str:
    text = query.lower()
    if any(k in text for k in ['star', 'behavioral', 'situation']):
        return (
            "### 🌟 The STAR Method Framework\n\n"
            "The **STAR method** is the gold standard for answering behavioral questions:\n\n"
            "* **S – Situation (15%):** Set the context. Where were you working? What was the challenge?\n"
            "* **T – Task (15%):** What was your specific responsibility?\n"
            "* **A – Action (50%):** Detail what *YOU* specifically did. Mention tools, algorithms, and trade-offs.\n"
            "* **R – Result (20%):** Conclude with quantifiable outcomes (*e.g., 'Reduced latency by 35%'*).\n\n"
            "💡 **Pro Tip:** Keep your total answer between **90 to 120 seconds**!"
        )
    if any(k in text for k in ['intro', 'yourself', 'tell me about']):
        return (
            "### 🎯 How to Ace 'Tell Me About Yourself'\n\n"
            "Use the **Present-Past-Future Formula** (60–90 seconds):\n\n"
            "1. **Present (30 sec):** Your current degree, college, and core technical stack.\n"
            "2. **Past (30 sec):** Highlight 1–2 notable projects or internships with concrete impact.\n"
            "3. **Future (20 sec):** Connect your goals directly to the target role and company.\n\n"
            "🚫 **Common Mistake:** Avoid reading your resume chronologically. Focus on the value you bring!"
        )
    if any(k in text for k in ['weakness', 'strength']):
        return (
            "### ⚖️ Answering 'What is Your Greatest Weakness?'\n\n"
            "The winning strategy is **genuine self-awareness + active remediation**:\n\n"
            "* **Formula:** Name a real technical or working habit + show the specific system you implemented to fix it + show positive progress.\n"
            "* **Example:** *'Earlier, I used to dive into coding without whiteboarding architecture first. To fix this, I adopted a rule to draft system diagrams and edge cases before writing code, which reduced bugs significantly.'*"
        )
    if any(k in text for k in ['dsa', 'coding', 'algorithm', 'leet']):
        return (
            "### 💻 5-Step Framework for Coding & DSA Rounds\n\n"
            "1. **Clarify (2 mins):** Ask about constraints, data ranges, and edge cases.\n"
            "2. **Brute Force First (2 mins):** State the naive approach and analyze its Big-O.\n"
            "3. **Optimize Before Coding (3-5 mins):** Discuss optimal data structures (Hash Maps, Two Pointers, Sliding Window).\n"
            "4. **Clean Implementation (10-15 mins):** Write modular, clean code with clear variable names.\n"
            "5. **Dry Run with Edge Cases (3 mins):** Trace through empty inputs, duplicates, and bounds."
        )
    if any(k in text for k in ['ats', 'resume', 'cv']):
        return (
            "### 📄 High-Impact Resume & ATS Guidelines\n\n"
            "* **Google X-Y-Z Formula:** Accomplished [X], as measured by [Y], by doing [Z].\n"
            "* **Single Column Format:** Avoid multi-column layouts, graphics, or text boxes that confuse ATS parsers.\n"
            "* **Section Headers:** Stick to *Education, Technical Skills, Projects, Experience, Certifications*.\n"
            "* **Keyword Density:** Align project keywords with the target Job Description."
        )
    return (
        f"### 💡 Placement Coach Guidance for: '{query}'\n\n"
        "Here are key recommendations for campus placements:\n\n"
        "1. **Structured Articulation:** Break your answers into 3 logical points to sound authoritative.\n"
        "2. **Quantify Results:** Mention numbers, percentages, and performance improvements in project answers.\n"
        "3. **Clarification Habit:** Take 30 seconds to ask clarifying questions before jumping into a complex problem.\n"
        "4. **STAR Method:** For situational questions, use Situation, Task, Action, and Result."
    )

@router.post("/ask", response_model=ChatResponse)
async def ask_chat_doubt(req: ChatRequest):
    api_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    if api_key:
        models_to_try = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"]
        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                payload = {
                    "contents": [
                        {"parts": [{"text": f"{SYSTEM_PROMPT}\n\nCandidate's Doubt: {req.message}"}]}
                    ],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": 800
                    }
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            if text:
                                return ChatResponse(reply=text.strip())
            except Exception as e:
                logger.warning(f"Error calling {model}: {e}")
                continue

    # Fallback to intelligent local counselor
    return ChatResponse(reply=get_offline_placement_guidance(req.message))

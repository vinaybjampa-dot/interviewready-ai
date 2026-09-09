from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter(prefix="/api/pre-interview", tags=["Pre-Interview & Grooming"])

@router.get("/company-checklist")
def get_company_checklist():
    return {
        "title": "Before You Enter the Interview — Research Desk",
        "description": "Thorough preparation transforms nervous candidates into confident professionals. Complete these essential checks before your placement drive.",
        "checklist_items": [
            {
                "id": "chk-1",
                "title": "Core Business & Offerings",
                "description": "Understand what products, services, and software platforms the company builds, who their primary clients are, and their revenue model.",
                "action_prompt": "Can you summarize what the company does in 2 concise sentences?"
            },
            {
                "id": "chk-2",
                "title": "Industry & Competitors",
                "description": "Know the market sector (FinTech, EdTech, SaaS, Semiconductor, Automotive, EPC) and at least 2 key competitors.",
                "action_prompt": "What differentiates this company from others in the same domain?"
            },
            {
                "id": "chk-3",
                "title": "Recent News & Developments",
                "description": "Review recent press releases, product launches, quarterly highlights, or engineering blog posts from the last 3 months.",
                "action_prompt": "Mentioning recent news in conversation demonstrates genuine proactive interest."
            },
            {
                "id": "chk-4",
                "title": "Job Description & Tech Stack Mapping",
                "description": "Carefully read the specific role JD. Map every required skill (e.g. Java, React, SQL, Verilog) to a project or coursework on your resume.",
                "action_prompt": "Be ready with a 1-minute example for each key requirement."
            },
            {
                "id": "chk-5",
                "title": "Culture & Core Values",
                "description": "Familiarize yourself with company leadership principles (e.g., Customer Obsession, Ownership, Integrity, Continuous Learning).",
                "action_prompt": "Prepare stories where your actions mirrored these values."
            },
            {
                "id": "chk-6",
                "title": "Candidate Questions Prepared",
                "description": "Prepare 2-3 thoughtful questions about the team's engineering practices, mentorship, or tech stack evolution.",
                "action_prompt": "Never say 'I have no questions' when invited at the close of an interview."
            }
        ],
        "readiness_affirmations": [
            "I know what the company does and why I want to work here.",
            "I understand the job description and required competencies.",
            "I know every line on my resume and can defend each project.",
            "I have prepared thoughtful questions to ask the interviewer.",
            "My hardware (webcam, mic) or physical documents are organized."
        ]
    }

@router.get("/grooming-guide")
def get_grooming_guide():
    return {
        "title": "How Should I Dress? — Professional Grooming & Attire",
        "philosophy": "Professional presentation communicates respect, preparation, and self-discipline. Our guidance focuses strictly on workplace professionalism and personal comfort—never on physical appearance, stereotypes, or subjective beauty standards.",
        "men_guidelines": {
            "title": "Professional Guidance for Men",
            "attire": [
                "Clean, well-pressed formal shirt (light colors like light blue, white, or subtle pastels work best).",
                "Dark, tailored formal trousers (navy, charcoal, black, or grey).",
                "Polished formal leather or matte dress shoes with matching dark socks.",
                "A clean leather belt matching your shoe color.",
                "Optional: A formal blazer or suit for consulting, banking, or tier-1 corporate interviews."
            ],
            "grooming": [
                "Neat, combed, and professional hairstyle keeping hair off the face.",
                "Clean-shaven or a neatly trimmed and edged beard/mustache.",
                "Clean, trimmed fingernails.",
                "Minimal accessories (a simple classic wrist watch is ideal).",
                "Mild or neutral deodorant; avoid strong or overpowering colognes."
            ]
        },
        "women_guidelines": {
            "title": "Professional Guidance for Women",
            "attire": [
                "Western formal attire: Well-fitted formal shirt/blouse paired with formal trousers or a formal knee-length skirt.",
                "Indian formal attire: Elegant, well-ironed formal Kurti or Salwar suit in solid or subtle patterns, or formal saree.",
                "Comfortable, professional closed-toe formal footwear or clean flats.",
                "Optional: A tailored blazer over your formal blouse for an executive finish."
            ],
            "grooming": [
                "Neat, professional hairstyle (tied back in a clean ponytail, bun, or neatly pinned).",
                "Minimal, subtle accessories (simple studs or delicate necklace; avoid dangling or noisy jewelry).",
                "Clean, neatly maintained fingernails (neutral or subtle polish if desired).",
                "Light, natural grooming; pleasant and comfortable presentation."
            ]
        },
        "universal_rules": [
            "Ensure clothes are washed, ironed, and free from loose threads or missing buttons.",
            "Choose breathable fabrics so you stay cool and calm under air-conditioned or warm interview halls.",
            "Turn your smartphone completely silent (not just vibrate) before entering the interview floor.",
            "Keep documents in a clean, professional folder (at least 2 physical resume copies, college ID, and a pen)."
        ]
    }

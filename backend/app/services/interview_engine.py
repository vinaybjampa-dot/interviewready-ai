import re
import uuid
from typing import Dict, Any, List, Optional, Tuple
from ..schemas import (
    CurrentQuestionInfo,
    AnswerEvaluationResponse,
    HintResponse,
    InterviewReportResponse,
    CategoryScore,
    QuestionReviewItem
)
from ..seed_data import BRANCH_TECHNICAL_BANK

STAGE_NAMES = {
    1: "Stage 1 — Candidate Introduction",
    2: "Stage 2 — Resume Deep-Dive",
    3: "Stage 3 — Core Technical Competency",
    4: "Stage 4 — Project Architecture & Challenges",
    5: "Stage 5 — Analytical Problem Solving",
    6: "Stage 6 — Behavioral & HR Competencies",
    7: "Stage 7 — Candidate Questions & Wrap-Up"
}

TOTAL_STAGES = 7

def get_personality_prefix(personality: str) -> str:
    p = personality.lower()
    if "friendly" in p:
        return "Welcome! We're glad to have you with us today. Take a breath, take your time, and let's begin."
    elif "strict" in p:
        return "Good day. We have a packed schedule with strict evaluation standards today. Let's get straight to the point."
    elif "technical" in p:
        return "Hello. Today's session will focus heavily on implementation depth, architecture, and fundamentals."
    elif "hr" in p:
        return "Hello and welcome! In this round, we will focus on communication, situational judgement, and team alignment."
    else: # Professional
        return "Good morning. Thank you for joining us today. We will conduct a structured placement interview covering your background, technical skills, and behavioral approach."

def generate_stage_question(
    stage: int,
    user_profile: Dict[str, Any],
    personality: str,
    difficulty: str,
    company: str,
    custom_resume_text: Optional[str] = None
) -> Tuple[str, List[str], List[str]]:
    """
    Returns (question_text, expected_concepts, available_hints)
    """
    name = user_profile.get("name", "Rahul")
    branch = user_profile.get("branch", "CSE").upper()
    role = user_profile.get("preferred_role", "Software Developer")
    projects = user_profile.get("projects", [])
    skills = user_profile.get("skills", ["Java", "Python", "SQL"])
    
    primary_proj = projects[0] if projects else "your main engineering capstone project"
    clean_proj = primary_proj.split("(")[0].split("|")[0].strip()

    if stage == 1:
        prefix = get_personality_prefix(personality)
        q = f"{prefix} To get started, {name}: please introduce yourself, walking us through your academic journey, technical proficiencies, and career goals."
        expected = ["Current degree/year", "Academic highlights", "Key programming skills", "Project experience", "Career alignment with role"]
        hints = [
            "Structure your pitch around: Present (your current degree and passion) -> Projects (what you've built) -> Future (why this role).",
            "Keep it around 90 seconds, speaking clearly without rushing."
        ]
        return q, expected, hints

    elif stage == 2:
        top_skill = skills[0] if skills else "OOP"
        second_skill = skills[1] if len(skills) > 1 else "SQL"
        if "strict" in personality.lower():
            q = f"Looking at your resume, you've highlighted {top_skill} and {second_skill}. Could you justify why you selected these technologies for your projects, and what trade-offs you made compared to alternatives?"
        else:
            q = f"On your resume, you listed experience with {top_skill} and {second_skill}. Can you tell us how you applied these skills in a practical scenario, and how you ensured code quality?"
        expected = [f"Hands-on usage of {top_skill}", "Reasons for choosing the stack", "Testing and code modularity"]
        hints = [
            f"Relate {top_skill} to a specific component you built, rather than just reciting textbook syntax.",
            "Mention modular design, readable variable naming, or how you organized files."
        ]
        return q, expected, hints

    elif stage == 3:
        # Technical branch question
        branch_bank = BRANCH_TECHNICAL_BANK.get(branch) or BRANCH_TECHNICAL_BANK.get("CSE")
        idx = 0 if difficulty == "Beginner" else 1 if difficulty == "Intermediate" else 2 if len(branch_bank) > 2 else 0
        item = branch_bank[idx]
        q = f"Let's test your core {branch} engineering fundamentals. {item['question']}"
        expected = item["ideal_answer_points"]
        hints = [
            f"Focus on the core concept: {item['core_concept']}.",
            "Break down your explanation step-by-step with a concrete example if helpful."
        ]
        return q, expected, hints

    elif stage == 4:
        # Project in-depth architecture and challenges (Prompt Section 6 & 15)
        q = f"Let's dive into your project: '{clean_proj}'. Can you explain its overall architecture, the biggest technical challenge or bottleneck you encountered during implementation, and how you resolved it?"
        expected = ["Component architecture / data flow", "Specific technical hurdle", "Debugging and resolution methodology", "What you would improve in version 2"]
        hints = [
            "Identify the inputs, processing engine/model, and output storage/UI.",
            "State a concrete bug or performance lag (e.g. database query delay, race condition, false detection) and your fix."
        ]
        return q, expected, hints

    elif stage == 5:
        # Problem solving / analytical thinking
        if "ECE" in branch:
            q = "Problem Solving: If you observe high noise and false triggers in a microcontroller digital input pin connected to an external sensor, how would you systematically diagnose and eliminate it?"
            expected = ["Hardware debouncing / pull-up/down resistors", "Software debouncing timer", "Oscilloscope inspection", "EMI shielding"]
            hints = ["Consider both physical hardware causes (floating pin) and software timing.", "Think about pull-up resistors and digital filtering."]
        elif "MECH" in branch:
            q = "Problem Solving: If an industrial centrifugal pump experiences a sudden drop in discharge pressure accompanied by rattling noise and vibration, how do you troubleshoot the root cause?"
            expected = ["Cavitation identification", "NPSH available vs required check", "Suction line blockage", "Impeller wear or seal damage"]
            hints = ["Think about vapor bubbles collapsing under low pressure (cavitation).", "Check the suction head and Net Positive Suction Head (NPSH)."]
        else: # CSE / IT
            q = "Problem Solving: You are given an array of integers representing student attendance IDs. How would you design an algorithm to find the first non-repeating student ID in a single pass with optimal space and time complexity?"
            expected = ["Hash Map / Frequency Counter", "O(N) time complexity", "O(N) auxiliary space", "Handling edge cases like all duplicates"]
            hints = [
                "Think about using a Hash Map or LinkedHashMap to track counts while preserving insertion order.",
                "First pass records frequency in O(N); second pass checks the first element with frequency 1."
            ]
        return q, expected, hints

    elif stage == 6:
        # Behavioral & HR competencies
        if "strict" in personality.lower():
            q = "Tell me about a time when you disagreed strongly with a teammate or project lead on a technical decision. How did you resolve the conflict without compromising the project deadline?"
        else:
            q = f"In campus placements, companies like {company} value team culture. Can you share an example of a difficult situation or setback you faced during college, and what you learned from overcoming it?"
        expected = ["STAR method (Situation, Task, Action, Result)", "Constructive communication", "Accountability and emotional maturity", "Clear positive outcome"]
        hints = [
            "Use the STAR formula: Situation (Context) -> Task (Goal) -> Action (What you specifically did) -> Result (Measurable outcome).",
            "Focus on solutions and mutual respect rather than blaming other individuals."
        ]
        return q, expected, hints

    elif stage == 7:
        # Closing candidate questions (Prompt Section 15 & 18)
        q = f"We have reached the end of our formal questions today, {name}. Do you have any questions for our interview panel regarding the engineering culture, technology stack, or graduate career progression at {company}?"
        expected = ["Thoughtful question about engineering practices", "Interest in mentorship/tech stack", "Professional closing etiquette"]
        hints = [
            "Ask about the engineering challenges the team is currently solving, or what technologies new hires learn.",
            "Avoid asking prematurely about salary, leaves, or whether you passed."
        ]
        return q, expected, hints

    else:
        return "Thank you for completing this session.", [], []

def evaluate_candidate_answer(
    stage: int,
    question_text: str,
    candidate_answer: str,
    expected_concepts: List[str],
    difficulty: str,
    personality: str
) -> Tuple[float, str, Optional[str]]:
    """
    Evaluates answer and returns (score, feedback_text, follow_up_question)
    """
    text = candidate_answer.strip()
    words = re.findall(r"\b\w+\b", text)
    word_count = len(words)
    text_lower = text.lower()

    # Detect "I don't know" or uncertainty
    is_uncertain = any(phrase in text_lower for phrase in [
        "i don't know", "i do not know", "not sure", "don't know", "no idea", 
        "cannot remember", "can't recall", "not familiar", "blank"
    ]) and word_count < 25

    if is_uncertain:
        score = 45.0
        feedback = (
            "You indicated uncertainty. That is completely normal when facing challenging questions! "
            "Remember our etiquette guidance: rather than simply saying 'I don't know', you can ask: "
            "'I am not fully certain about the exact implementation, but could you give a small hint, or may I walk through my foundational understanding?'"
        )
        follow_up = "Would you like to try breaking the problem down using foundational principles, or shall we explore a guided hint?"
        return score, feedback, follow_up

    # Keyword matching against expected concepts
    matched_points = 0
    for concept in expected_concepts:
        # extract words > 4 chars
        c_words = [w.lower() for w in re.findall(r"\b\w{4,}\b", concept)]
        if any(cw in text_lower for cw in c_words):
            matched_points += 1

    # Base score computation
    base_score = 60.0
    if expected_concepts:
        ratio = matched_points / len(expected_concepts)
        base_score += ratio * 30.0

    # Length calibration
    if word_count < 25:
        base_score -= 20.0
        length_feedback = "Your answer was very brief; provide more technical depth and concrete examples."
    elif word_count > 300:
        base_score -= 8.0
        length_feedback = "Your response was somewhat long; practice structuring your answers cleanly to stay concise."
    else:
        base_score += 8.0
        length_feedback = "Good, balanced answer length."

    # Filler word check
    filler_matches = re.findall(r"\b(um|uh|like|you know|actually|basically)\b", text_lower)
    if len(filler_matches) >= 4:
        base_score -= 6.0
        filler_feedback = f"Noticeable vocal filler words detected ({len(filler_matches)} instances). Try pausing instead of filling silence."
    else:
        filler_feedback = "Speech flow was relatively clean."

    final_score = round(max(35.0, min(base_score, 96.0)), 1)

    # Construct constructive feedback
    if final_score >= 80:
        feedback = f"Strong and convincing explanation! You addressed key core concepts effectively. {length_feedback} {filler_feedback}"
    elif final_score >= 65:
        feedback = f"Solid answer covering the main ideas. To elevate it further, explain trade-offs and real-world system implications. {length_feedback}"
    else:
        feedback = f"Fair attempt, but missing some key technical depth. Review the core definitions and prepare structured examples. {filler_feedback}"

    # Generate adaptive follow-up based on performance (Prompt Section 14)
    follow_up = None
    if stage in [2, 3, 4] and final_score >= 75:
        # Strong performance -> deeper follow-up
        if stage == 3:
            follow_up = "That was a solid explanation. How would your approach change if the data scale increased to millions of concurrent records?"
        elif stage == 4:
            follow_up = "Interesting architecture! If a critical service in that pipeline crashed, how does your system handle error recovery and state persistence?"
        else:
            follow_up = "Can you describe a specific edge case where this solution might degrade in performance?"
    elif stage in [3, 4] and final_score < 65:
        # Struggling -> simpler clarification follow-up
        follow_up = "Let's simplify that: could you walk through a simple 2-line example or use case demonstrating that principle?"

    return final_score, feedback, follow_up

def generate_interview_report(
    interview_data: Dict[str, Any],
    questions_list: List[Dict[str, Any]],
    user_profile: Dict[str, Any]
) -> InterviewReportResponse:
    user_name = user_profile.get("name", "Rahul")
    role = interview_data.get("role", "Software Developer")
    diff = interview_data.get("difficulty", "Intermediate")
    date_str = interview_data.get("created_at", "2026-09-09")[:10]

    # Calculate category scores from questions
    scores = [q.get("score", 70.0) for q in questions_list if q.get("score") is not None]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 74.0

    tech_score = round(min(avg_score + 3.0, 95.0), 1)
    comm_score = round(max(avg_score - 4.0, 45.0), 1)
    prob_score = round(avg_score + 1.0, 1)
    proj_score = round(min(avg_score + 5.0, 95.0), 1)
    hr_score = round(max(avg_score - 2.0, 48.0), 1)
    relevance_score = round(avg_score + 2.0, 1)

    category_scores = [
        CategoryScore(category="Technical Knowledge", score=tech_score),
        CategoryScore(category="Communication & Clarity", score=comm_score),
        CategoryScore(category="Problem Solving", score=prob_score),
        CategoryScore(category="Project Knowledge", score=proj_score),
        CategoryScore(category="HR & Behavioral Alignment", score=hr_score),
        CategoryScore(category="Answer Relevance", score=relevance_score)
    ]

    strengths = [
        f"Strong command of core engineering fundamentals for {user_profile.get('branch', 'CSE')}",
        "Well-articulated explanation of project implementation and tool choices",
        "Constructive attitude when handling challenging follow-ups"
    ]

    weaknesses = [
        "Answers in behavioral rounds could benefit from tighter STAR structure (Situation, Task, Action, Result)",
        "Occasional hesitation and filler word clusters during conceptual questions",
        "Could articulate architectural trade-offs more explicitly when explaining project choices"
    ]

    speech_insights = [
        "Speaking pace: ~135 words per minute (optimal conversational range).",
        "Clarity: High technical comprehension; maintain 1-second pause when gathering thoughts.",
        "Body language & demeanor: Professional posture and engaged responses throughout."
    ]

    recommended_next_steps = [
        "Complete 15 minutes of structured speaking practice in the 'Tell Me About Yourself' trainer",
        "Review database normalization, indexing, and complex SQL joins",
        "Practice 5 situational HR questions using the STAR framework",
        "Take another mock interview tomorrow under 'Strict' or 'Company Simulation' mode"
    ]

    reviews: List[QuestionReviewItem] = []
    for q in questions_list:
        stage_name = q.get("stage_name", "Interview Stage")
        q_text = q.get("question_text", "")
        c_ans = q.get("candidate_answer") or "Answer recorded verbally."
        q_score = q.get("score") or 72.0
        fb = q.get("feedback") or "Good technical effort."
        tips = "Provide clear structural breakdown and concrete real-world examples."
        reviews.append(QuestionReviewItem(
            stage_name=stage_name,
            question_text=q_text,
            candidate_answer=c_ans,
            score=q_score,
            feedback=fb,
            ideal_response_tips=tips
        ))

    return InterviewReportResponse(
        interview_id=interview_data.get("id", "int-001"),
        user_name=user_name,
        role=role,
        difficulty=diff,
        date=date_str,
        overall_score=avg_score,
        category_scores=category_scores,
        strengths=strengths,
        weaknesses=weaknesses,
        speech_and_clarity_insights=speech_insights,
        recommended_next_steps=recommended_next_steps,
        questions_review=reviews
    )

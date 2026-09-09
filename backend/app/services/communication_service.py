import re
from typing import Dict, Any, List
from ..schemas import CommunicationIntroResponse

FILLER_WORDS = [
    "um", "uh", "like", "you know", "actually", "basically", 
    "sort of", "kind of", "i mean", "right", "literally", "honestly"
]

def analyze_introduction(transcript: str, user_profile: Dict[str, Any] = None) -> CommunicationIntroResponse:
    text = transcript.strip()
    words = re.findall(r"\b\w+\b", text)
    word_count = len(words)
    
    # Duration estimate at average 135 words/min
    duration_estimate_sec = int((word_count / 135.0) * 60) if word_count > 0 else 0
    
    # Filler word detection
    text_lower = text.lower()
    filler_matches = []
    for filler in FILLER_WORDS:
        # Match standalone occurrences
        pattern = r"\b" + re.escape(filler) + r"\b"
        found = re.findall(pattern, text_lower)
        if found:
            filler_matches.extend(found)
            
    filler_count = len(filler_matches)
    
    # Structural milestones detection
    structure = {
        "present": any(w in text_lower for w in ["i am", "currently", "pursuing", "final year", "4th year", "student"]),
        "education": any(w in text_lower for w in ["b.tech", "engineering", "college", "cgpa", "degree", "computer science", "ece", "mechanical"]),
        "skills": any(w in text_lower for w in ["java", "python", "sql", "c++", "programming", "react", "skills", "proficient", "stack"]),
        "projects": any(w in text_lower for w in ["project", "built", "developed", "system", "attendance", "portal", "application"]),
        "achievements": any(w in text_lower for w in ["hackathon", "certified", "certifications", "internship", "lead", "award", "rank", "coordinator"]),
        "career_goal": any(w in text_lower for w in ["looking forward", "career", "role", "software developer", "engineer", "aspire", "goal", "opportunity"])
    }
    
    # Calculate structure score (0-100)
    structure_hits = sum(1 for v in structure.values() if v)
    answer_structure_score = int((structure_hits / 6.0) * 100)
    
    # Clarity score based on length, filler density, and coherent structure
    clarity_base = 85
    # Penalize excessive filler density
    if word_count > 0:
        filler_density = (filler_count / word_count) * 100
        if filler_density > 10:
            clarity_base -= 25
        elif filler_density > 5:
            clarity_base -= 15
        elif filler_density > 2:
            clarity_base -= 8
    else:
        clarity_base = 20
        
    # Ideal word count for 90-second intro is 120-220 words
    if word_count < 30:
        clarity_base -= 25
    elif word_count < 60:
        clarity_base -= 10
    elif word_count < 90:
        clarity_base -= 5
    elif word_count > 300:
        clarity_base -= 10 # Too rambling
        
    speaking_clarity_score = max(25, min(clarity_base, 95))
    
    # Construct actionable feedback
    what_you_did_well = []
    what_to_improve = []
    
    if structure["present"] and structure["education"]:
        what_you_did_well.append("Clear opening stating your current academic status and background.")
    if structure["skills"]:
        what_you_did_well.append("Identified specific technical competencies rather than vague generalities.")
    if structure["projects"]:
        what_you_did_well.append("Mentioned tangible project work highlighting practical implementation.")
    if filler_count <= 2 and word_count >= 60:
        what_you_did_well.append("Maintained composed phrasing with minimal filler word interjections.")
        
    if not what_you_did_well:
        what_you_did_well.append("Courageous start and willingness to practice out loud.")

    # Improvements
    if word_count < 80:
        what_to_improve.append(f"Your introduction was quite brief ({word_count} words). Aim for a 90-second elevator pitch (~140–180 words) to highlight your full background.")
    elif word_count > 250:
        what_to_improve.append(f"Your answer was a bit long ({word_count} words). Streamline historical details and focus on the most impactful projects to prevent interviewer fatigue.")
        
    if filler_count >= 3:
        what_to_improve.append(f"Your response contained {filler_count} filler words (e.g. {', '.join(set(filler_matches[:3]))}). Try pausing silently for 1 second instead of filling pauses with vocal hesitations.")
        
    if not structure["career_goal"]:
        what_to_improve.append("Add a closing forward-looking hook tying your skills back to why you are excited for this specific engineering role.")
    if not structure["achievements"]:
        what_to_improve.append("Briefly weave in one standout achievement (e.g., hackathon result, certification, or internship deliverable).")

    # Name and context for model sample
    name = (user_profile or {}).get("name", "Rahul")
    branch = (user_profile or {}).get("branch", "Computer Science")
    skills = ", ".join((user_profile or {}).get("skills", ["Java", "Python", "SQL"])[:3])
    role = (user_profile or {}).get("preferred_role", "Software Developer")
    
    model_improved_sample = (
        f"\"Good morning! My name is {name}, and I am currently in my final year of B.Tech in {branch} at National Institute of Technology. "
        f"Over the course of my degree, I have developed a solid foundation in core computer science, particularly Object-Oriented Programming, "
        f"DBMS, and full-stack development using {skills}. "
        f"One of my key accomplishments was designing and developing a Face Recognition Attendance System using Python and OpenCV, which automated attendance "
        f"for over 50 students with 92% accuracy. I also gained practical industry experience as a Software Development Intern at Infotech Labs, where I optimized "
        f"FastAPI microservices and improved API latency by 25%. "
        f"I am passionate about building scalable, high-quality software, and I am thrilled about this opportunity to contribute as a {role} on your engineering team.\""
    )

    suggested_authenticity_tip = (
        "Do not recite this word-for-word. Anchor your pitch around three mental milestones: "
        "1. Where you stand today (Degree & Core Passion) → 2. What you've built (Standout Project/Internship) → 3. Where you want to go (Why this role)."
    )

    return CommunicationIntroResponse(
        word_count=word_count,
        duration_estimate_sec=duration_estimate_sec,
        filler_words_count=filler_count,
        filler_words_detected=list(set(filler_matches)),
        speaking_clarity_score=speaking_clarity_score,
        answer_structure_score=answer_structure_score,
        structure_feedback=structure,
        what_you_did_well=what_you_did_well,
        what_to_improve=what_to_improve,
        suggested_authenticity_tip=suggested_authenticity_tip,
        model_improved_sample=model_improved_sample
    )

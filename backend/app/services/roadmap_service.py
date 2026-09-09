from typing import Dict, Any, List
from ..schemas import ReadinessScoreBreakdown, WeeklyPlanItem, RoadmapResponse

def calculate_readiness_score(profile: Dict[str, Any]) -> ReadinessScoreBreakdown:
    # 1. Technical Score
    tech_base = 50.0
    cgpa = float(profile.get("cgpa", 7.0))
    tech_base += min(cgpa * 3.0, 25.0)
    skills_count = len(profile.get("skills", []))
    tech_base += min(skills_count * 2.5, 15.0)
    if any(w.lower() in ["sql", "dsa", "coding"] for w in profile.get("weak_areas", [])):
        tech_base -= 8.0
    tech_score = round(max(35.0, min(tech_base, 95.0)), 1)

    # 2. Communication Score
    comm_base = 55.0
    exp = profile.get("interview_experience", "Beginner").lower()
    if "experienced" in exp:
        comm_base += 20.0
    elif "intermediate" in exp:
        comm_base += 10.0
    if any("speak" in w.lower() or "nervous" in w.lower() or "comm" in w.lower() for w in profile.get("weak_areas", [])):
        comm_base -= 10.0
    comm_score = round(max(30.0, min(comm_base, 95.0)), 1)

    # 3. Resume Score
    resume_base = 45.0
    projects_count = len(profile.get("projects", []))
    internships_count = len(profile.get("internships", []))
    certs_count = len(profile.get("certifications", []))
    resume_base += min(projects_count * 10.0, 25.0)
    resume_base += min(internships_count * 12.0, 20.0)
    resume_base += min(certs_count * 5.0, 10.0)
    resume_score = round(max(40.0, min(resume_base, 95.0)), 1)

    # 4. HR Preparation Score
    hr_base = 42.0
    if "experienced" in exp:
        hr_base += 25.0
    elif "intermediate" in exp:
        hr_base += 12.0
    if any("hr" in w.lower() or "behavioral" in w.lower() for w in profile.get("weak_areas", [])):
        hr_base -= 10.0
    hr_score = round(max(30.0, min(hr_base, 90.0)), 1)

    # 5. Confidence Score
    conf_score = round((comm_score * 0.4 + tech_score * 0.3 + resume_score * 0.3) - 5.0, 1)
    conf_score = max(35.0, min(conf_score, 92.0))

    # Overall weighted average
    overall = round(
        (tech_score * 0.30) +
        (comm_score * 0.25) +
        (resume_score * 0.20) +
        (hr_score * 0.15) +
        (conf_score * 0.10),
        1
    )

    if overall >= 75:
        label = "Interview Ready (Placement Ready)"
        summary = "Strong profile! Focus on simulated company rounds and edge-case follow-ups."
    elif overall >= 55:
        label = "Good Foundation (Targeted Practice Needed)"
        summary = "Solid fundamental knowledge. Sharpen communication delivery, HR responses, and project trade-offs."
    else:
        label = "Beginner (Comprehensive Roadmap Active)"
        summary = "Focus on core subject fundamentals, resume structuring, and initial etiquette practice."

    return ReadinessScoreBreakdown(
        overall_readiness=overall,
        technical=tech_score,
        communication=comm_score,
        resume=resume_score,
        hr=hr_score,
        confidence=conf_score,
        status_label=label,
        summary=summary
    )

def generate_personalized_roadmap(profile: Dict[str, Any]) -> RoadmapResponse:
    branch = profile.get("branch", "CSE").upper()
    role = profile.get("preferred_role", "Software Developer")
    user_id = profile.get("id", "demo-user")
    readiness = calculate_readiness_score(profile)

    # Tailor syllabus based on branch
    if "ECE" in branch:
        w1_tech = "Digital Electronics & Boolean Logic Fundamentals"
        w2_tech = "Microprocessors (8085/8086/ARM), Embedded C & Communication Systems"
        w3_tech = "Hardware circuit simulation projects & Signal analysis"
    elif "EEE" in branch:
        w1_tech = "Circuit Theory, Network Theorems & Basic Machines"
        w2_tech = "Power Systems, Transformers & Induction Motors"
        w3_tech = "Power Electronics, Inverters & Industrial Automation"
    elif "MECH" in branch:
        w1_tech = "Thermodynamics & IC Engine 4-Stroke Cycles"
        w2_tech = "Fluid Mechanics, Strength of Materials & Manufacturing"
        w3_tech = "CAD/CAM modeling projects & Machine Design tolerances"
    elif "CIVIL" in branch:
        w1_tech = "Structural Engineering & Concrete Technology (Mix Design)"
        w2_tech = "Surveying, Geotechnical Soil Mechanics & Transportation"
        w3_tech = "AutoCAD/ETABS projects & On-site quality inspection"
    else: # CSE / IT
        w1_tech = "OOP Pillars (Polymorphism, Encapsulation) & SQL Query Basics"
        w2_tech = "DSA Core (Arrays, Linked Lists, Trees) & DBMS/OS Concepts"
        w3_tech = "Project Architecture Drill, API Design & Scalability Basics"

    weeks = [
        WeeklyPlanItem(
            week_number=1,
            title="Foundation, Resume & Elevator Pitch",
            focus="Resume optimization, Professional self-introduction, Core branch fundamentals",
            tasks=[
                "Review resume against ATS standards and quantify project impact",
                "Practice the 90-second 'Tell Me About Yourself' structured framework",
                f"Master key conceptual foundations: {w1_tech}",
                "Complete the Interview Etiquette simulation lab (knocking, posture, disagreements)",
                "Review grooming & dress checklist for campus placement day"
            ],
            estimated_hours=12
        ),
        WeeklyPlanItem(
            week_number=2,
            title="Technical Core & Behavioral Scenarios",
            focus="Deep technical topics, STAR method for HR questions, First mock interview",
            tasks=[
                f"Intensive technical revision: {w2_tech}",
                "Prepare 5 common HR scenarios (Strengths, Weaknesses, Team conflict) using STAR method",
                "Practice answering with the 'I Don't Know' framework (asking for hints without panic)",
                "Take a full 20-minute Beginner/Intermediate AI Mock Interview",
                "Review the Post-Interview Report Card and identify filler word patterns"
            ],
            estimated_hours=14
        ),
        WeeklyPlanItem(
            week_number=3,
            title="Project Deep-Dive, Problem Solving & Company Simulations",
            focus="End-to-end project defense, live problem explanation, company-specific drills",
            tasks=[
                f"Deep-dive into your major academic/internship project: {w3_tech}",
                "Defend architectural choices: 'Why this tech?', 'What were the bottlenecks?', 'Future improvements'",
                "Practice thinking aloud while explaining coding/technical problems",
                "Take an Advanced / Company Simulation Mock Interview (Strict & Technical panel)",
                "Conduct a final pre-interview checklist audit 24 hours prior to placement drive"
            ],
            estimated_hours=16
        )
    ]

    return RoadmapResponse(
        user_id=user_id,
        readiness=readiness,
        weeks=weeks,
        target_role=role,
        branch=branch
    )

import json
import uuid
from fastapi import APIRouter, HTTPException
from ..schemas import UserProfileCreate, UserProfileResponse
from ..database import get_db
from ..seed_data import RAHUL_PROFILE, DEMO_USER_ID, RAHUL_HISTORICAL_PROGRESS
from ..services.roadmap_service import calculate_readiness_score

router = APIRouter(prefix="/api/profile", tags=["Profile & Onboarding"])

def row_to_profile(row: dict) -> UserProfileResponse:
    return UserProfileResponse(
        id=row["id"],
        name=row["name"],
        degree=row["degree"],
        branch=row["branch"],
        year=row["year"],
        cgpa=row["cgpa"],
        skills=json.loads(row["skills"]) if isinstance(row["skills"], str) else (row["skills"] or []),
        programming_languages=json.loads(row["programming_languages"]) if isinstance(row["programming_languages"], str) else (row["programming_languages"] or []),
        projects=json.loads(row["projects"]) if isinstance(row["projects"], str) else (row["projects"] or []),
        internships=json.loads(row["internships"]) if isinstance(row["internships"], str) else (row["internships"] or []),
        certifications=json.loads(row["certifications"]) if isinstance(row["certifications"], str) else (row["certifications"] or []),
        preferred_role=row["preferred_role"],
        target_companies=json.loads(row["target_companies"]) if isinstance(row["target_companies"], str) else (row["target_companies"] or []),
        interview_experience=row["interview_experience"],
        weak_areas=json.loads(row["weak_areas"]) if isinstance(row["weak_areas"], str) else (row["weak_areas"] or []),
        readiness_score=row["readiness_score"],
        technical_score=row["technical_score"],
        communication_score=row["communication_score"],
        resume_score=row["resume_score"],
        hr_score=row["hr_score"],
        confidence_score=row["confidence_score"],
        created_at=row.get("created_at")
    )

@router.get("/demo", response_model=UserProfileResponse)
def get_demo_profile():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (DEMO_USER_ID,))
        row = cursor.fetchone()
        if not row:
            # Seed demo user
            reset_demo_data()
            cursor.execute("SELECT * FROM users WHERE id = ?", (DEMO_USER_ID,))
            row = cursor.fetchone()
        return row_to_profile(row)

@router.post("/reset-demo", response_model=UserProfileResponse)
def reset_demo_data():
    with get_db() as conn:
        cursor = conn.cursor()
        # Delete existing demo data
        cursor.execute("DELETE FROM users WHERE id = ?", (DEMO_USER_ID,))
        cursor.execute("DELETE FROM progress WHERE user_id = ?", (DEMO_USER_ID,))
        
        # Insert Rahul demo profile
        p = RAHUL_PROFILE
        cursor.execute("""
            INSERT INTO users (
                id, name, degree, branch, year, cgpa, skills, programming_languages,
                projects, internships, certifications, preferred_role, target_companies,
                interview_experience, weak_areas, readiness_score, technical_score,
                communication_score, resume_score, hr_score, confidence_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["id"], p["name"], p["degree"], p["branch"], p["year"], p["cgpa"],
            json.dumps(p["skills"]), json.dumps(p["programming_languages"]),
            json.dumps(p["projects"]), json.dumps(p["internships"]),
            json.dumps(p["certifications"]), p["preferred_role"],
            json.dumps(p["target_companies"]), p["interview_experience"],
            json.dumps(p["weak_areas"]), p["readiness_score"],
            p["technical_score"], p["communication_score"],
            p["resume_score"], p["hr_score"], p["confidence_score"]
        ))
        
        # Seed progress
        for item in RAHUL_HISTORICAL_PROGRESS:
            prog_id = f"prog-demo-{item['interview_number']}"
            cursor.execute("""
                INSERT INTO progress (
                    id, user_id, interview_id, interview_number, technical_score,
                    communication_score, problem_solving_score, hr_score,
                    project_score, overall_score, notes, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                prog_id, DEMO_USER_ID, f"int-demo-{item['interview_number']}",
                item["interview_number"], item["technical_score"],
                item["communication_score"], item["problem_solving_score"],
                item["hr_score"], item["project_score"], item["overall_score"],
                item["notes"], f"{item['date']} 10:00:00"
            ))

        cursor.execute("SELECT * FROM users WHERE id = ?", (DEMO_USER_ID,))
        row = cursor.fetchone()
        return row_to_profile(row)

@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_profile(user_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User profile not found")
        return row_to_profile(row)

@router.post("", response_model=UserProfileResponse)
def create_or_update_profile(profile: UserProfileCreate):
    user_id = profile.id or f"user-{uuid.uuid4().hex[:8]}"
    
    # Calculate readiness scores
    readiness = calculate_readiness_score(profile.model_dump())
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (
                id, name, degree, branch, year, cgpa, skills, programming_languages,
                projects, internships, certifications, preferred_role, target_companies,
                interview_experience, weak_areas, readiness_score, technical_score,
                communication_score, resume_score, hr_score, confidence_score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name, degree=excluded.degree, branch=excluded.branch,
                year=excluded.year, cgpa=excluded.cgpa, skills=excluded.skills,
                programming_languages=excluded.programming_languages,
                projects=excluded.projects, internships=excluded.internships,
                certifications=excluded.certifications, preferred_role=excluded.preferred_role,
                target_companies=excluded.target_companies,
                interview_experience=excluded.interview_experience,
                weak_areas=excluded.weak_areas, readiness_score=excluded.readiness_score,
                technical_score=excluded.technical_score,
                communication_score=excluded.communication_score,
                resume_score=excluded.resume_score, hr_score=excluded.hr_score,
                confidence_score=excluded.confidence_score
        """, (
            user_id, profile.name, profile.degree, profile.branch, profile.year, profile.cgpa,
            json.dumps(profile.skills), json.dumps(profile.programming_languages),
            json.dumps(profile.projects), json.dumps(profile.internships),
            json.dumps(profile.certifications), profile.preferred_role,
            json.dumps(profile.target_companies), profile.interview_experience,
            json.dumps(profile.weak_areas), readiness.overall_readiness,
            readiness.technical, readiness.communication,
            readiness.resume, readiness.hr, readiness.confidence
        ))

        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return row_to_profile(row)

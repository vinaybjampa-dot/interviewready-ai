import json
from fastapi import APIRouter, HTTPException
from ..schemas import RoadmapResponse
from ..database import get_db
from ..services.roadmap_service import generate_personalized_roadmap
from ..seed_data import DEMO_USER_ID, RAHUL_PROFILE

router = APIRouter(prefix="/api/roadmap", tags=["Personalized Roadmap"])

@router.get("/{user_id}", response_model=RoadmapResponse)
def get_roadmap(user_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        
        if not row:
            if user_id == DEMO_USER_ID or user_id == "demo":
                profile = RAHUL_PROFILE
            else:
                raise HTTPException(status_code=404, detail="User profile not found")
        else:
            profile = {
                "id": row["id"],
                "name": row["name"],
                "degree": row["degree"],
                "branch": row["branch"],
                "year": row["year"],
                "cgpa": row["cgpa"],
                "skills": json.loads(row["skills"]) if isinstance(row["skills"], str) else (row["skills"] or []),
                "programming_languages": json.loads(row["programming_languages"]) if isinstance(row["programming_languages"], str) else (row["programming_languages"] or []),
                "projects": json.loads(row["projects"]) if isinstance(row["projects"], str) else (row["projects"] or []),
                "internships": json.loads(row["internships"]) if isinstance(row["internships"], str) else (row["internships"] or []),
                "certifications": json.loads(row["certifications"]) if isinstance(row["certifications"], str) else (row["certifications"] or []),
                "preferred_role": row["preferred_role"],
                "target_companies": json.loads(row["target_companies"]) if isinstance(row["target_companies"], str) else (row["target_companies"] or []),
                "interview_experience": row["interview_experience"],
                "weak_areas": json.loads(row["weak_areas"]) if isinstance(row["weak_areas"], str) else (row["weak_areas"] or [])
            }

        return generate_personalized_roadmap(profile)

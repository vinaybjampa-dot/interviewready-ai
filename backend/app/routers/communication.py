import json
from fastapi import APIRouter
from ..schemas import CommunicationIntroRequest, CommunicationIntroResponse
from ..services.communication_service import analyze_introduction
from ..database import get_db

router = APIRouter(prefix="/api/communication", tags=["Communication Training"])

@router.post("/analyze-intro", response_model=CommunicationIntroResponse)
def analyze_self_introduction(payload: CommunicationIntroRequest):
    user_profile = None
    if payload.user_id:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (payload.user_id,))
            row = cursor.fetchone()
            if row:
                user_profile = {
                    "name": row["name"],
                    "branch": row["branch"],
                    "skills": json.loads(row["skills"]) if isinstance(row["skills"], str) else (row["skills"] or []),
                    "preferred_role": row["preferred_role"]
                }
                
    response = analyze_introduction(payload.transcript, user_profile)
    
    if payload.user_id:
        with get_db() as conn:
            cursor = conn.cursor()
            new_comm_score = float(response.speaking_clarity_score)
            cursor.execute("""
                UPDATE users SET communication_score = ? WHERE id = ?
            """, (new_comm_score, payload.user_id))

    return response

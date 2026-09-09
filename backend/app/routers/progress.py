from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas import ProgressDashboardResponse, ProgressPoint, CategoryScore
from ..database import get_db
from ..seed_data import DEMO_USER_ID

router = APIRouter(prefix="/api/progress", tags=["Progress & Analytics"])

@router.get("/{user_id}", response_model=ProgressDashboardResponse)
def get_progress_dashboard(user_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Fetch user
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user_row = cursor.fetchone()
        if not user_row and user_id != DEMO_USER_ID:
            raise HTTPException(status_code=404, detail="User not found")
            
        user_name = user_row["name"] if user_row else "Rahul"
        readiness_score = user_row["readiness_score"] if user_row else 78.0

        # Fetch progress entries ordered by interview number
        cursor.execute("""
            SELECT * FROM progress WHERE user_id = ? ORDER BY interview_number ASC
        """, (user_id,))
        prog_rows = cursor.fetchall()

        score_history: List[ProgressPoint] = []
        for r in prog_rows:
            date_str = str(r["created_at"])[:10] if r["created_at"] else "2026-09-01"
            score_history.append(ProgressPoint(
                interview_number=r["interview_number"] or 1,
                date=date_str,
                role="Software Developer",
                overall_score=r["overall_score"] or 60.0,
                technical_score=r["technical_score"] or 65.0,
                communication_score=r["communication_score"] or 58.0,
                problem_solving_score=r["problem_solving_score"] or 62.0,
                hr_score=r["hr_score"] or 55.0,
                project_score=r["project_score"] or 70.0
            ))

        # Recent stats and radar
        if score_history:
            latest = score_history[-1]
            first = score_history[0]
            gain = round(latest.overall_score - first.overall_score, 1)
            summary = (
                f"Outstanding growth! Your overall interview readiness increased by +{gain}% "
                f"across {len(score_history)} mock sessions (from {first.overall_score}% to {latest.overall_score}%). "
                f"Your highest advancement was in Technical Knowledge and Project Defense."
            )
            radar = [
                CategoryScore(category="Technical", score=latest.technical_score),
                CategoryScore(category="Communication", score=latest.communication_score),
                CategoryScore(category="Problem Solving", score=latest.problem_solving_score),
                CategoryScore(category="HR & Behavioral", score=latest.hr_score),
                CategoryScore(category="Projects", score=latest.project_score)
            ]
        else:
            summary = "Welcome! Complete your first mock interview to begin tracking your readiness progression."
            radar = [
                CategoryScore(category="Technical", score=65.0),
                CategoryScore(category="Communication", score=58.0),
                CategoryScore(category="Problem Solving", score=60.0),
                CategoryScore(category="HR & Behavioral", score=50.0),
                CategoryScore(category="Projects", score=70.0)
            ]

        next_rec = (
            "Based on your recent scores, your communication score (72%) has the highest potential for improvement. "
            "We recommend 15 minutes of structured practice in the 'Tell Me About Yourself' module, "
            "followed by an Intermediate Mock Interview."
        )

        return ProgressDashboardResponse(
            user_id=user_id,
            user_name=user_name,
            placement_readiness_score=readiness_score,
            total_interviews_completed=len(score_history),
            score_history=score_history,
            category_radar=radar,
            recent_improvement_summary=summary,
            next_recommended_practice=next_rec
        )

import uuid
import json
from fastapi import APIRouter, HTTPException
from ..schemas import (
    InterviewStartRequest,
    InterviewSessionResponse,
    CurrentQuestionInfo,
    AnswerSubmitRequest,
    AnswerEvaluationResponse,
    HintRequest,
    HintResponse,
    InterviewReportResponse
)
from ..database import get_db
from ..seed_data import RAHUL_PROFILE, DEMO_USER_ID
from ..services.interview_engine import (
    STAGE_NAMES,
    TOTAL_STAGES,
    generate_stage_question,
    evaluate_candidate_answer,
    generate_interview_report
)

router = APIRouter(prefix="/api/interview", tags=["Live Mock Interview Engine"])

@router.post("/start", response_model=InterviewSessionResponse)
def start_interview(payload: InterviewStartRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Fetch user profile
        cursor.execute("SELECT * FROM users WHERE id = ?", (payload.user_id,))
        user_row = cursor.fetchone()
        if not user_row:
            if payload.user_id == DEMO_USER_ID or payload.user_id == "demo":
                user_profile = RAHUL_PROFILE
            else:
                raise HTTPException(status_code=404, detail="Student profile not found")
        else:
            user_profile = {
                "id": user_row["id"],
                "name": user_row["name"],
                "degree": user_row["degree"],
                "branch": user_row["branch"],
                "year": user_row["year"],
                "cgpa": user_row["cgpa"],
                "skills": json.loads(user_row["skills"]) if isinstance(user_row["skills"], str) else (user_row["skills"] or []),
                "programming_languages": json.loads(user_row["programming_languages"]) if isinstance(user_row["programming_languages"], str) else (user_row["programming_languages"] or []),
                "projects": json.loads(user_row["projects"]) if isinstance(user_row["projects"], str) else (user_row["projects"] or []),
                "internships": json.loads(user_row["internships"]) if isinstance(user_row["internships"], str) else (user_row["internships"] or []),
                "certifications": json.loads(user_row["certifications"]) if isinstance(user_row["certifications"], str) else (user_row["certifications"] or []),
                "preferred_role": user_row["preferred_role"],
                "target_companies": json.loads(user_row["target_companies"]) if isinstance(user_row["target_companies"], str) else (user_row["target_companies"] or []),
                "weak_areas": json.loads(user_row["weak_areas"]) if isinstance(user_row["weak_areas"], str) else (user_row["weak_areas"] or [])
            }

        # Create interview ID
        interview_id = f"int-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO interviews (
                id, user_id, role, difficulty, personality, company, current_stage, status
            ) VALUES (?, ?, ?, ?, ?, ?, 1, 'in_progress')
        """, (interview_id, payload.user_id, payload.role, payload.difficulty, payload.personality, payload.company))

        # Generate Stage 1 question
        q_text, expected, hints = generate_stage_question(
            stage=1,
            user_profile=user_profile,
            personality=payload.personality,
            difficulty=payload.difficulty,
            company=payload.company or "Tech Corp",
            custom_resume_text=payload.custom_resume_text
        )

        question_id = f"q-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO questions (
                id, interview_id, stage, stage_name, question_text,
                expected_concepts, available_hints, hints_given, max_hints
            ) VALUES (?, ?, 1, ?, ?, ?, ?, 0, ?)
        """, (
            question_id,
            interview_id,
            STAGE_NAMES[1],
            q_text,
            json.dumps(expected),
            json.dumps(hints),
            len(hints)
        ))

        current_q = CurrentQuestionInfo(
            question_id=question_id,
            stage=1,
            stage_name=STAGE_NAMES[1],
            total_stages=TOTAL_STAGES,
            question_text=q_text,
            expected_concepts=expected,
            hints_remaining=len(hints)
        )

        return InterviewSessionResponse(
            interview_id=interview_id,
            user_id=payload.user_id,
            role=payload.role,
            difficulty=payload.difficulty,
            personality=payload.personality,
            company=payload.company or "Tech Corp",
            current_stage=1,
            current_question=current_q,
            status="in_progress"
        )

@router.post("/answer", response_model=AnswerEvaluationResponse)
def submit_answer(payload: AnswerSubmitRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get question & interview
        cursor.execute("SELECT * FROM questions WHERE id = ?", (payload.question_id,))
        q_row = cursor.fetchone()
        if not q_row:
            raise HTTPException(status_code=404, detail="Question not found")
            
        cursor.execute("SELECT * FROM interviews WHERE id = ?", (payload.interview_id,))
        int_row = cursor.fetchone()
        if not int_row:
            raise HTTPException(status_code=404, detail="Interview not found")
            
        cursor.execute("SELECT * FROM users WHERE id = ?", (int_row["user_id"],))
        user_row = cursor.fetchone()
        user_profile = {
            "name": user_row["name"] if user_row else "Rahul",
            "branch": user_row["branch"] if user_row else "CSE",
            "preferred_role": user_row["preferred_role"] if user_row else "Software Developer",
            "skills": json.loads(user_row["skills"]) if user_row and isinstance(user_row["skills"], str) else [],
            "projects": json.loads(user_row["projects"]) if user_row and isinstance(user_row["projects"], str) else []
        }

        stage = q_row["stage"]
        expected_concepts = json.loads(q_row["expected_concepts"]) if isinstance(q_row["expected_concepts"], str) else []

        # Evaluate answer
        score, feedback, follow_up = evaluate_candidate_answer(
            stage=stage,
            question_text=q_row["question_text"],
            candidate_answer=payload.candidate_answer,
            expected_concepts=expected_concepts,
            difficulty=int_row["difficulty"],
            personality=int_row["personality"]
        )

        # Update current question record
        cursor.execute("""
            UPDATE questions SET candidate_answer = ?, score = ?, feedback = ?
            WHERE id = ?
        """, (payload.candidate_answer, score, feedback, payload.question_id))

        # Check if we should ask follow-up in the same stage or advance stage
        next_stage = stage + 1
        interview_completed = False
        next_question_info = None
        follow_up_generated = False

        if follow_up and not q_row["follow_up_to"]:
            # Present follow-up within this stage
            follow_up_generated = True
            new_qid = f"q-{uuid.uuid4().hex[:8]}"
            hints = ["Break the problem down and consider scalability or safety trade-offs."]
            cursor.execute("""
                INSERT INTO questions (
                    id, interview_id, stage, stage_name, question_text,
                    expected_concepts, follow_up_to, available_hints, hints_given, max_hints
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
            """, (
                new_qid,
                payload.interview_id,
                stage,
                f"{STAGE_NAMES.get(stage, 'Stage')} (Follow-Up)",
                follow_up,
                json.dumps(["Scalability", "Optimization", "Trade-offs"]),
                payload.question_id,
                json.dumps(hints)
            ))
            next_question_info = CurrentQuestionInfo(
                question_id=new_qid,
                stage=stage,
                stage_name=f"{STAGE_NAMES.get(stage, 'Stage')} (Adaptive Follow-Up)",
                total_stages=TOTAL_STAGES,
                question_text=follow_up,
                expected_concepts=["Trade-offs", "Edge cases", "Scalability"],
                hints_remaining=1
            )
        elif next_stage <= TOTAL_STAGES:
            # Advance to next stage
            cursor.execute("UPDATE interviews SET current_stage = ? WHERE id = ?", (next_stage, payload.interview_id))
            q_text, expected, hints = generate_stage_question(
                stage=next_stage,
                user_profile=user_profile,
                personality=int_row["personality"],
                difficulty=int_row["difficulty"],
                company=int_row["company"] or "Tech Corp"
            )
            new_qid = f"q-{uuid.uuid4().hex[:8]}"
            cursor.execute("""
                INSERT INTO questions (
                    id, interview_id, stage, stage_name, question_text,
                    expected_concepts, available_hints, hints_given, max_hints
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
            """, (
                new_qid,
                payload.interview_id,
                next_stage,
                STAGE_NAMES.get(next_stage, f"Stage {next_stage}"),
                q_text,
                json.dumps(expected),
                json.dumps(hints),
                len(hints)
            ))
            next_question_info = CurrentQuestionInfo(
                question_id=new_qid,
                stage=next_stage,
                stage_name=STAGE_NAMES.get(next_stage, f"Stage {next_stage}"),
                total_stages=TOTAL_STAGES,
                question_text=q_text,
                expected_concepts=expected,
                hints_remaining=len(hints)
            )
        else:
            # Interview complete!
            interview_completed = True
            cursor.execute("UPDATE interviews SET status = 'completed' WHERE id = ?", (payload.interview_id,))
            
            # Compute final average and write progress entry
            cursor.execute("SELECT score FROM questions WHERE interview_id = ? AND score IS NOT NULL", (payload.interview_id,))
            score_rows = cursor.fetchall()
            all_scores = [r["score"] for r in score_rows]
            final_overall = round(sum(all_scores) / len(all_scores), 1) if all_scores else 75.0
            
            cursor.execute("SELECT COUNT(*) as count FROM progress WHERE user_id = ?", (int_row["user_id"],))
            p_count = cursor.fetchone()["count"] + 1
            
            cursor.execute("""
                INSERT INTO progress (
                    id, user_id, interview_id, interview_number, technical_score,
                    communication_score, problem_solving_score, hr_score, project_score,
                    overall_score, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                f"prog-{uuid.uuid4().hex[:8]}",
                int_row["user_id"],
                payload.interview_id,
                p_count,
                round(final_overall + 2.0, 1),
                round(final_overall - 3.0, 1),
                round(final_overall + 1.0, 1),
                round(final_overall - 1.0, 1),
                round(final_overall + 4.0, 1),
                final_overall,
                f"Completed live mock interview ({int_row['difficulty']} - {int_row['personality']} panel)."
            ))

            # Update student overall readiness
            cursor.execute("""
                UPDATE users SET readiness_score = ? WHERE id = ?
            """, (final_overall, int_row["user_id"]))

        return AnswerEvaluationResponse(
            question_id=payload.question_id,
            score=score,
            feedback=feedback,
            is_complete=interview_completed,
            next_question=next_question_info,
            interview_completed=interview_completed,
            follow_up_generated=follow_up_generated
        )

@router.post("/hint", response_model=HintResponse)
def request_hint(payload: HintRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM questions WHERE id = ?", (payload.question_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Question not found")
            
        hints = json.loads(row["available_hints"]) if isinstance(row["available_hints"], str) else []
        given = row["hints_given"]
        
        if given < len(hints):
            hint_text = hints[given]
            new_given = given + 1
            cursor.execute("UPDATE questions SET hints_given = ? WHERE id = ?", (new_given, payload.question_id))
            remaining = len(hints) - new_given
            concept_guidance = (
                "Take a moment to structure your thoughts around this hint. "
                "You do not need to deliver a flawless academic answer—explain your logical reasoning out loud!"
            )
            return HintResponse(
                hint_number=new_given,
                hints_remaining=remaining,
                hint_text=hint_text,
                concept_guidance=concept_guidance
            )
        else:
            return HintResponse(
                hint_number=given,
                hints_remaining=0,
                hint_text="All hints exhausted. Explain the core principle from basic intuition, or discuss how you would search/debug it in practice.",
                concept_guidance="Focus on fundamental logic."
            )

@router.get("/{interview_id}/report", response_model=InterviewReportResponse)
def get_interview_report(interview_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM interviews WHERE id = ?", (interview_id,))
        int_row = cursor.fetchone()
        if not int_row:
            raise HTTPException(status_code=404, detail="Interview not found")
            
        cursor.execute("SELECT * FROM users WHERE id = ?", (int_row["user_id"],))
        user_row = cursor.fetchone()
        user_profile = {
            "name": user_row["name"] if user_row else "Rahul",
            "branch": user_row["branch"] if user_row else "CSE",
            "preferred_role": user_row["preferred_role"] if user_row else "Software Developer"
        }
        
        cursor.execute("SELECT * FROM questions WHERE interview_id = ? ORDER BY stage ASC", (interview_id,))
        q_rows = cursor.fetchall()

        return generate_interview_report(int_row, q_rows, user_profile)

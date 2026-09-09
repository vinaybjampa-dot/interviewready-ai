from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas import EtiquetteScenario, EtiquetteSubmitRequest, EtiquetteResultResponse
from ..seed_data import ETIQUETTE_SCENARIOS

router = APIRouter(prefix="/api/etiquette", tags=["Interview Etiquette & Behavior"])

@router.get("/scenarios", response_model=List[EtiquetteScenario])
def get_scenarios():
    return [EtiquetteScenario(**s) for s in ETIQUETTE_SCENARIOS]

@router.post("/submit", response_model=EtiquetteResultResponse)
def submit_scenario_answer(submission: EtiquetteSubmitRequest):
    scenario = next((s for s in ETIQUETTE_SCENARIOS if s["id"] == submission.scenario_id), None)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
        
    is_correct = submission.selected_option.upper() == scenario["correct_option"].upper()
    score = 100 if is_correct else 35
    
    if is_correct:
        feedback = "Outstanding decision! You demonstrated the exact blend of professional poise, humility, and workplace etiquette that placement recruiters look for."
    else:
        feedback = "Good learning opportunity! Review the explanation below to understand why this behavior is critical in professional campus hiring environments."

    return EtiquetteResultResponse(
        scenario_id=scenario["id"],
        is_correct=is_correct,
        selected_option=submission.selected_option.upper(),
        correct_option=scenario["correct_option"].upper(),
        explanation=scenario["explanation"],
        score=score,
        feedback=feedback
    )

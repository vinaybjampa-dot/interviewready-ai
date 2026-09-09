from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserProfileCreate(BaseModel):
    id: Optional[str] = None
    name: str
    degree: str = "B.Tech"
    branch: str  # CSE, IT, ECE, EEE, Mechanical, Civil, etc.
    year: str    # 1st Year, 2nd Year, 3rd Year, 4th Year
    cgpa: float
    skills: List[str] = []
    programming_languages: List[str] = []
    projects: List[str] = []
    internships: List[str] = []
    certifications: List[str] = []
    preferred_role: str
    target_companies: List[str] = []
    interview_experience: str = "Beginner" # Beginner, Intermediate, Experienced
    weak_areas: List[str] = []

class UserProfileResponse(UserProfileCreate):
    readiness_score: float
    technical_score: float
    communication_score: float
    resume_score: float
    hr_score: float
    confidence_score: float
    created_at: Optional[str] = None

class ReadinessScoreBreakdown(BaseModel):
    overall_readiness: float
    technical: float
    communication: float
    resume: float
    hr: float
    confidence: float
    status_label: str
    summary: str

class WeeklyPlanItem(BaseModel):
    week_number: int
    title: str
    focus: str
    tasks: List[str]
    estimated_hours: int

class RoadmapResponse(BaseModel):
    user_id: str
    readiness: ReadinessScoreBreakdown
    weeks: List[WeeklyPlanItem]
    target_role: str
    branch: str

class ResumeAnalyzeRequest(BaseModel):
    user_id: Optional[str] = None
    resume_text: str

class ResumeQuestionItem(BaseModel):
    source_item: str
    question: str
    reason: str
    sample_answer_hint: str

class ResumeAnalyzeResponse(BaseModel):
    ats_score: int
    formatting_score: int
    strengths: List[str]
    improvements: List[str]
    missing_sections: List[str]
    extracted_projects: List[str]
    extracted_skills: List[str]
    generated_questions: List[ResumeQuestionItem]
    ats_tips: List[str]

class EtiquetteScenario(BaseModel):
    id: str
    title: str
    context: str
    interviewer_prompt: str
    options: List[Dict[str, str]]
    correct_option: str
    explanation: str
    category: str # Entering, Sitting, Disagreement, Phone, Closing

class EtiquetteSubmitRequest(BaseModel):
    scenario_id: str
    selected_option: str

class EtiquetteResultResponse(BaseModel):
    scenario_id: str
    is_correct: bool
    selected_option: str
    correct_option: str
    explanation: str
    score: int
    feedback: str

class CommunicationIntroRequest(BaseModel):
    transcript: str
    user_id: Optional[str] = None

class CommunicationIntroResponse(BaseModel):
    word_count: int
    duration_estimate_sec: int
    filler_words_count: int
    filler_words_detected: List[str]
    speaking_clarity_score: int
    answer_structure_score: int
    structure_feedback: Dict[str, bool] # present, education, skills, projects, achievements, career_goal
    what_you_did_well: List[str]
    what_to_improve: List[str]
    suggested_authenticity_tip: str
    model_improved_sample: str

class TechnicalTopicDrill(BaseModel):
    branch: str
    category: str
    question: str
    difficulty: str
    core_concept: str
    ideal_answer_points: List[str]
    common_mistakes: List[str]

class InterviewStartRequest(BaseModel):
    user_id: str
    role: str
    difficulty: str = "Beginner" # Beginner, Intermediate, Advanced, Company Simulation
    personality: str = "Professional" # Friendly, Professional, Strict, Technical, HR
    company: Optional[str] = "General Tech"
    custom_resume_text: Optional[str] = None

class CurrentQuestionInfo(BaseModel):
    question_id: str
    stage: int
    stage_name: str
    total_stages: int = 7
    question_text: str
    expected_concepts: List[str]
    hints_remaining: int

class InterviewSessionResponse(BaseModel):
    interview_id: str
    user_id: str
    role: str
    difficulty: str
    personality: str
    company: str
    current_stage: int
    current_question: CurrentQuestionInfo
    status: str

class AnswerSubmitRequest(BaseModel):
    interview_id: str
    question_id: str
    candidate_answer: str

class AnswerEvaluationResponse(BaseModel):
    question_id: str
    score: float
    feedback: str
    is_complete: bool
    next_question: Optional[CurrentQuestionInfo] = None
    interview_completed: bool = False
    follow_up_generated: bool = False

class HintRequest(BaseModel):
    interview_id: str
    question_id: str

class HintResponse(BaseModel):
    hint_number: int
    hints_remaining: int
    hint_text: str
    concept_guidance: str

class CategoryScore(BaseModel):
    category: str
    score: float
    max_score: float = 100

class QuestionReviewItem(BaseModel):
    stage_name: str
    question_text: str
    candidate_answer: str
    score: float
    feedback: str
    ideal_response_tips: str

class InterviewReportResponse(BaseModel):
    interview_id: str
    user_name: str
    role: str
    difficulty: str
    date: str
    overall_score: float
    category_scores: List[CategoryScore]
    strengths: List[str]
    weaknesses: List[str]
    speech_and_clarity_insights: List[str]
    recommended_next_steps: List[str]
    questions_review: List[QuestionReviewItem]

class ProgressPoint(BaseModel):
    interview_number: int
    date: str
    role: str
    overall_score: float
    technical_score: float
    communication_score: float
    problem_solving_score: float
    hr_score: float
    project_score: float

class ProgressDashboardResponse(BaseModel):
    user_id: str
    user_name: str
    placement_readiness_score: float
    total_interviews_completed: int
    score_history: List[ProgressPoint]
    category_radar: List[CategoryScore]
    recent_improvement_summary: str
    next_recommended_practice: str

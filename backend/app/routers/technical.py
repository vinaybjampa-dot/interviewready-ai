from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..schemas import TechnicalTopicDrill
from ..seed_data import BRANCH_TECHNICAL_BANK

router = APIRouter(prefix="/api/technical", tags=["Technical Preparation"])

@router.get("/branches")
def get_supported_branches():
    return [
        {"code": "CSE", "name": "Computer Science and Engineering", "topics": ["OOP", "DBMS", "Operating Systems", "DSA", "Computer Networks", "SQL"]},
        {"code": "IT", "name": "Information Technology", "topics": ["Web & Cloud Architecture", "RESTful APIs", "Databases", "Distributed Systems"]},
        {"code": "ECE", "name": "Electronics & Communication", "topics": ["Digital Electronics", "Microprocessors (8085/8086/ARM)", "Embedded Systems", "Signals"]},
        {"code": "EEE", "name": "Electrical & Electronics", "topics": ["Circuit Theory", "Electrical Machines", "Power Systems", "Control Systems"]},
        {"code": "Mechanical", "name": "Mechanical Engineering", "topics": ["Thermodynamics", "IC Engines", "Fluid Mechanics", "Strength of Materials", "CAD/CAM"]},
        {"code": "Civil", "name": "Civil Engineering", "topics": ["Structural Analysis", "Concrete Technology", "Geotechnical Engineering", "Surveying"]}
    ]

@router.get("/{branch}", response_model=List[TechnicalTopicDrill])
def get_branch_drills(branch: str):
    b_upper = branch.upper()
    bank = BRANCH_TECHNICAL_BANK.get(b_upper)
    if not bank:
        # Match case-insensitively
        for k, v in BRANCH_TECHNICAL_BANK.items():
            if k.upper() == b_upper or b_upper in k.upper():
                bank = v
                break
    if not bank:
        bank = BRANCH_TECHNICAL_BANK.get("CSE")
        
    return [
        TechnicalTopicDrill(
            branch=branch,
            category=item["category"],
            question=item["question"],
            difficulty=item["difficulty"],
            core_concept=item["core_concept"],
            ideal_answer_points=item["ideal_answer_points"],
            common_mistakes=item["common_mistakes"]
        ) for item in bank
    ]

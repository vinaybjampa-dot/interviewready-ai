import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db
from app.seed_data import DEMO_USER_ID, RAHUL_PROFILE

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    init_db()

@pytest.fixture
def client():
    return TestClient(app)

def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}

def test_demo_profile(client):
    res = client.get("/api/profile/demo")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Rahul"
    assert data["branch"] == "CSE"
    assert "Java" in data["skills"]
    assert data["readiness_score"] > 0

def test_personalized_roadmap(client):
    res = client.get(f"/api/roadmap/{DEMO_USER_ID}")
    assert res.status_code == 200
    data = res.json()
    assert "readiness" in data
    assert len(data["weeks"]) == 3
    assert data["weeks"][0]["week_number"] == 1
    assert "tasks" in data["weeks"][0]

def test_resume_analyzer(client):
    payload = {
        "user_id": DEMO_USER_ID,
        "resume_text": "RAHUL SHARMA. B.Tech CSE CGPA 8.2. Skills: Java, Python, SQL, React. Projects: Face Recognition Attendance System using OpenCV and Python. Developed automated student logging with 92% accuracy."
    }
    res = client.post("/api/resume/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["ats_score"] >= 60
    assert len(data["generated_questions"]) > 0
    # Verify that project question was generated
    assert any("architecture" in q["question"].lower() or "attendance" in q["question"].lower() for q in data["generated_questions"])

def test_etiquette_scenarios(client):
    res = client.get("/api/etiquette/scenarios")
    assert res.status_code == 200
    scenarios = res.json()
    assert len(scenarios) >= 5
    
    # Test submitting a correct option for the first scenario
    first = scenarios[0]
    sub_res = client.post("/api/etiquette/submit", json={
        "scenario_id": first["id"],
        "selected_option": first["correct_option"]
    })
    assert sub_res.status_code == 200
    result = sub_res.json()
    assert result["is_correct"] is True
    assert result["score"] == 100

def test_communication_intro_analysis(client):
    intro_text = (
        "Good morning, I am Rahul. Currently in my 4th year B.Tech Computer Science at NIT. "
        "I am proficient in Java, Python, and SQL. I developed a Face Recognition Attendance System "
        "and completed an internship at Infotech Labs. I aspire to work as a Software Developer."
    )
    res = client.post("/api/communication/analyze-intro", json={
        "user_id": DEMO_USER_ID,
        "transcript": intro_text
    })
    assert res.status_code == 200
    data = res.json()
    assert data["word_count"] > 30
    assert data["speaking_clarity_score"] > 60
    assert data["structure_feedback"]["present"] is True
    assert data["structure_feedback"]["skills"] is True
    assert "model_improved_sample" in data

def test_technical_drills(client):
    res = client.get("/api/technical/CSE")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    assert any("OOP" in d["category"] or "DBMS" in d["category"] for d in data)

def test_interview_lifecycle(client):
    # 1. Start interview
    start_payload = {
        "user_id": DEMO_USER_ID,
        "role": "Software Developer",
        "difficulty": "Beginner",
        "personality": "Friendly",
        "company": "TCS Digital"
    }
    start_res = client.post("/api/interview/start", json=start_payload)
    assert start_res.status_code == 200
    session = start_res.json()
    int_id = session["interview_id"]
    q1 = session["current_question"]
    assert session["current_stage"] == 1
    assert "question_text" in q1

    # 2. Test Hint
    hint_res = client.post("/api/interview/hint", json={
        "interview_id": int_id,
        "question_id": q1["question_id"]
    })
    assert hint_res.status_code == 200
    assert "hint_text" in hint_res.json()

    # 3. Answer Stage 1
    ans_payload = {
        "interview_id": int_id,
        "question_id": q1["question_id"],
        "candidate_answer": "I am Rahul, final year CSE student. I built face recognition attendance system with OpenCV and worked on Spring Boot and SQL."
    }
    ans_res = client.post("/api/interview/answer", json=ans_payload)
    assert ans_res.status_code == 200
    ans_data = ans_res.json()
    assert ans_data["score"] > 50
    assert ans_data["next_question"] is not None

def test_progress_dashboard(client):
    res = client.get(f"/api/progress/{DEMO_USER_ID}")
    assert res.status_code == 200
    data = res.json()
    assert data["user_name"] == "Rahul"
    assert len(data["score_history"]) >= 4
    assert len(data["category_radar"]) >= 5

def test_resume_file_upload(client):
    file_content = b"RAHUL SHARMA. B.Tech Computer Science 2027. Skills: Java, Python, SQL, React. Projects: Face Recognition Attendance System using OpenCV."
    files = {"file": ("rahul_resume.txt", file_content, "text/plain")}
    data = {"user_id": DEMO_USER_ID}
    res = client.post("/api/resume/upload", files=files, data=data)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["filename"] == "rahul_resume.txt"
    assert "analysis" in res_data
    assert res_data["analysis"]["ats_score"] >= 50

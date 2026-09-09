import sqlite3
import json
from contextlib import contextmanager
from .config import DB_PATH

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            degree TEXT DEFAULT 'B.Tech',
            branch TEXT NOT NULL,
            year TEXT NOT NULL,
            cgpa REAL NOT NULL,
            skills TEXT,
            programming_languages TEXT,
            projects TEXT,
            internships TEXT,
            certifications TEXT,
            preferred_role TEXT,
            target_companies TEXT,
            interview_experience TEXT,
            weak_areas TEXT,
            readiness_score REAL DEFAULT 60.0,
            technical_score REAL DEFAULT 65.0,
            communication_score REAL DEFAULT 58.0,
            resume_score REAL DEFAULT 72.0,
            hr_score REAL DEFAULT 45.0,
            confidence_score REAL DEFAULT 55.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS resumes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            resume_text TEXT NOT NULL,
            ats_score INTEGER,
            formatting_score INTEGER,
            strengths TEXT,
            improvements TEXT,
            missing_sections TEXT,
            extracted_projects TEXT,
            generated_questions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS interviews (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            role TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            personality TEXT NOT NULL,
            company TEXT,
            current_stage INTEGER DEFAULT 1,
            overall_score REAL DEFAULT 0,
            technical_score REAL DEFAULT 0,
            communication_score REAL DEFAULT 0,
            problem_solving_score REAL DEFAULT 0,
            project_score REAL DEFAULT 0,
            hr_score REAL DEFAULT 0,
            answer_relevance_score REAL DEFAULT 0,
            feedback_summary TEXT,
            strengths TEXT,
            weaknesses TEXT,
            recommended_actions TEXT,
            status TEXT DEFAULT 'in_progress',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            interview_id TEXT NOT NULL,
            stage INTEGER NOT NULL,
            stage_name TEXT NOT NULL,
            question_text TEXT NOT NULL,
            expected_concepts TEXT,
            candidate_answer TEXT,
            score REAL,
            feedback TEXT,
            follow_up_to TEXT,
            hints_given INTEGER DEFAULT 0,
            max_hints INTEGER DEFAULT 2,
            available_hints TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS progress (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            interview_id TEXT,
            interview_number INTEGER,
            technical_score REAL,
            communication_score REAL,
            problem_solving_score REAL,
            hr_score REAL,
            project_score REAL,
            overall_score REAL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)

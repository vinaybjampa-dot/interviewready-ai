import uuid
import json
import io
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..schemas import ResumeAnalyzeRequest, ResumeAnalyzeResponse
from ..services.resume_service import analyze_resume_text
from ..seed_data import RAHUL_RESUME_TEXT
from ..database import get_db

router = APIRouter(prefix="/api/resume", tags=["Resume Analyzer"])

@router.get("/sample")
def get_sample_resume():
    return {
        "sample_text": RAHUL_RESUME_TEXT,
        "description": "Sample 4th Year B.Tech CSE resume for Rahul Sharma, targeting Software Developer roles."
    }

@router.post("/analyze", response_model=ResumeAnalyzeResponse)
def analyze_resume(payload: ResumeAnalyzeRequest):
    analysis = analyze_resume_text(payload.resume_text)
    
    if payload.user_id:
        with get_db() as conn:
            cursor = conn.cursor()
            res_id = f"res-{uuid.uuid4().hex[:8]}"
            cursor.execute("""
                INSERT INTO resumes (
                    id, user_id, resume_text, ats_score, formatting_score,
                    strengths, improvements, missing_sections, extracted_projects,
                    generated_questions
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                res_id, payload.user_id, payload.resume_text,
                analysis.ats_score, analysis.formatting_score,
                json.dumps(analysis.strengths),
                json.dumps(analysis.improvements),
                json.dumps(analysis.missing_sections),
                json.dumps(analysis.extracted_projects),
                json.dumps([q.model_dump() for q in analysis.generated_questions])
            ))
            
            # Update user's resume score
            cursor.execute("""
                UPDATE users SET resume_score = ? WHERE id = ?
            """, (float(analysis.ats_score), payload.user_id))

    return analysis

@router.post("/upload")
async def upload_and_analyze_resume(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    filename = file.filename or "resume"
    ext = filename.lower().split(".")[-1]
    contents = await file.read()
    extracted_text = ""

    if ext == "pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(contents))
            pages_text = []
            for page in reader.pages:
                txt = page.extract_text() or ""
                if txt.strip():
                    pages_text.append(txt)
            extracted_text = "\n\n--- Page Break ---\n\n".join(pages_text) if pages_text else ""
        except Exception as e:
            try:
                import fitz
                doc = fitz.open(stream=contents, filetype="pdf")
                pages_text = [page.get_text() for page in doc if page.get_text().strip()]
                extracted_text = "\n\n--- Page Break ---\n\n".join(pages_text) if pages_text else ""
            except Exception:
                # Raw text string extraction fallback
                import re
                ascii_text = re.sub(r'[^\x20-\x7E\n]', ' ', contents.decode('latin-1', errors='ignore'))
                extracted_text = re.sub(r'\s+', ' ', ascii_text).strip()[:3000]

        if not extracted_text or len(extracted_text.strip()) < 20:
            extracted_text = f"Uploaded PDF Resume: {filename}\nAuto-extracted candidate profile. Ready for ATS scoring and mock interview question generation."
    elif ext in ["txt", "md", "csv", "rtf"]:
        try:
            extracted_text = contents.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = contents.decode("latin-1", errors="ignore")
    elif ext in ["docx", "doc"]:
        # Basic text extraction from docx/binary
        try:
            # Check for utf-8 or extract strings
            extracted_text = contents.decode("utf-8", errors="ignore")
            # If docx xml
            import zipfile
            try:
                with zipfile.ZipFile(io.BytesIO(contents)) as docx_zip:
                    xml_content = docx_zip.read("word/document.xml").decode("utf-8")
                    import xml.etree.ElementTree as ET
                    tree = ET.fromstring(xml_content)
                    extracted_text = "".join(tree.itertext())
            except Exception:
                pass
        except Exception:
            extracted_text = "Failed to parse document format. Please upload PDF or TXT."
    else:
        try:
            extracted_text = contents.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file.")

    if not extracted_text or len(extracted_text.strip()) < 20:
        extracted_text = f"Uploaded file: {filename}\nNo textual content could be extracted. Please paste your resume text."

    analysis = analyze_resume_text(extracted_text)

    if user_id:
        with get_db() as conn:
            cursor = conn.cursor()
            res_id = f"res-{uuid.uuid4().hex[:8]}"
            cursor.execute("""
                INSERT INTO resumes (
                    id, user_id, resume_text, ats_score, formatting_score,
                    strengths, improvements, missing_sections, extracted_projects,
                    generated_questions
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                res_id, user_id, extracted_text,
                analysis.ats_score, analysis.formatting_score,
                json.dumps(analysis.strengths),
                json.dumps(analysis.improvements),
                json.dumps(analysis.missing_sections),
                json.dumps(analysis.extracted_projects),
                json.dumps([q.model_dump() for q in analysis.generated_questions])
            ))
            cursor.execute("UPDATE users SET resume_score = ? WHERE id = ?", (float(analysis.ats_score), user_id))

    return {
        "filename": filename,
        "file_size": len(contents),
        "file_type": ext,
        "extracted_text": extracted_text,
        "analysis": analysis,
        "ats_score": analysis.ats_score,
        "formatting_score": analysis.formatting_score,
        "strengths": analysis.strengths,
        "improvements": analysis.improvements,
        "missing_sections": analysis.missing_sections,
        "extracted_projects": analysis.extracted_projects,
        "generated_questions": analysis.generated_questions
    }

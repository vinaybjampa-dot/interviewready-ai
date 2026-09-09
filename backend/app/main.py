import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from .database import init_db
from .routers import (
    auth_profile,
    roadmap,
    pre_interview,
    resume,
    etiquette,
    communication,
    technical,
    interview,
    progress
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    # Seed demo user on startup
    auth_profile.reset_demo_data()
    yield

app = FastAPI(
    title="InterviewReady AI — Placement Coach API",
    description="Full-stack AI Placement Interview Coach for B.Tech students from pre-interview preparation to mock interview simulation and analytics.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth_profile.router)
app.include_router(roadmap.router)
app.include_router(pre_interview.router)
app.include_router(resume.router)
app.include_router(etiquette.router)
app.include_router(communication.router)
app.include_router(technical.router)
app.include_router(interview.router)
app.include_router(progress.router)

@app.get("/api/health")
def health():
    return {"status": "healthy"}

# Mount frontend build if available
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "app": "InterviewReady AI",
            "tagline": "AI Placement Interview Coach for B.Tech Students",
            "status": "online",
            "docs_url": "/docs"
        }

import io
from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Lesson
from app.schemas.payloads import LessonRequest
from app.security import get_current_user
from app.services.lesson_generator import generate_lesson
from app.utils import dumps, log_activity

router = APIRouter(prefix="/api/learning", tags=["learning"])


def persist_lesson(db: Session, user, data: dict):
    lesson = Lesson(
        user_id=user.id if user else None,
        topic=data["topic"],
        subject=data["subject"],
        difficulty=data["difficulty"],
        mode=data["mode"],
        summary=data["summary"],
        concepts=dumps(data["concepts"]),
        key_points=dumps(data["key_points"]),
        examples=dumps(data["examples"]),
        explanation=data["explanation"],
        source_text=data["source_text"],
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    if user:
        log_activity(db, user.id, "lesson", f"Generated lesson on {lesson.topic}")
    data["id"] = lesson.id
    return data


@router.post("/lesson")
def create_lesson(payload: LessonRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    data = generate_lesson(payload.topic, payload.subject, payload.difficulty, payload.mode, payload.content)
    saved = persist_lesson(db, user, data)
    return {"success": True, "data": saved}


@router.post("/upload")
async def upload_learning_file(
    topic: str = Form("Uploaded content"),
    subject: str = Form("General"),
    difficulty: str = Form("Beginner"),
    mode: str = Form("Visual"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    raw = await file.read()
    name = (file.filename or "").lower()
    extracted = ""
    if name.endswith(".pdf"):
        from pypdf import PdfReader

        reader = PdfReader(io.BytesIO(raw))
        extracted = "\n".join((page.extract_text() or "") for page in reader.pages)
    elif name.endswith((".png", ".jpg", ".jpeg", ".webp")):
        extracted = f"An educational image named {file.filename} was uploaded as visual learning material for {topic}."
    else:
        try:
            extracted = raw.decode("utf-8", errors="ignore")
        except Exception:
            extracted = topic
    data = generate_lesson(topic, subject, difficulty, mode, extracted)
    saved = persist_lesson(db, user, data)
    return {"success": True, "data": saved, "extracted_preview": extracted[:500]}

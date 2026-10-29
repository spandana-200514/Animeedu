from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import QuizAttempt
from app.schemas.payloads import QuizAnswerRequest, QuizGenerateRequest
from app.security import get_current_user
from app.services.quiz_generator import evaluate_quiz, generate_quiz
from app.utils import dumps, log_activity

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


@router.post("/generate")
def create_quiz(payload: QuizGenerateRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    questions = generate_quiz(payload.topic, payload.difficulty, payload.content, payload.count)
    if user:
        log_activity(db, user.id, "quiz", f"Started a quiz on {payload.topic}")
    return {"success": True, "data": {"topic": payload.topic, "questions": questions}}


@router.post("/answer")
def submit_quiz(payload: QuizAnswerRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    result = evaluate_quiz(payload.topic, payload.answers, payload.questions)
    attempt = QuizAttempt(
        user_id=user.id if user else None,
        topic=payload.topic,
        score=result["score"],
        total=result["total"],
        percentage=result["percentage"],
        strengths=dumps(result["strengths"]),
        weak_areas=dumps(result["weak_areas"]),
        recommendation=result["recommendation"],
    )
    db.add(attempt)
    db.commit()
    if user:
        log_activity(db, user.id, "quiz", f"Scored {result['percentage']}% on {payload.topic}")
    return {"success": True, "data": result}

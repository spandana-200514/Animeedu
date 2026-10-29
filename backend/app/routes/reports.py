from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Activity, Lesson, QuizAttempt, VideoRecord
from app.security import get_current_user
from app.utils import loads

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/demo")
def demo_report(db: Session = Depends(get_db), user=Depends(get_current_user)):
    user_id = user.id if user else None
    lesson_q = db.query(Lesson)
    quiz_q = db.query(QuizAttempt)
    video_q = db.query(VideoRecord)
    activity_q = db.query(Activity)
    if user_id:
        lesson_q = lesson_q.filter(Lesson.user_id == user_id)
        quiz_q = quiz_q.filter(QuizAttempt.user_id == user_id)
        video_q = video_q.filter(VideoRecord.user_id == user_id)
        activity_q = activity_q.filter(Activity.user_id == user_id)

    lessons = lesson_q.count()
    videos = video_q.count()
    quizzes = quiz_q.all()
    avg = round(sum(q.percentage for q in quizzes) / len(quizzes), 1) if quizzes else 0
    progress = min(100, lessons * 12 + videos * 8 + int(avg * 0.3))
    weak = []
    strong = []
    for q in quizzes:
        weak.extend(loads(q.weak_areas))
        strong.extend(loads(q.strengths))
    activities = [
        {"type": a.type, "description": a.description, "created_at": a.created_at.isoformat()}
        for a in activity_q.order_by(Activity.created_at.desc()).limit(8).all()
    ]
    trend = [max(20, min(100, int(q.percentage))) for q in quizzes[-6:]] or [35, 48, 55, 62]
    return {
        "success": True,
        "data": {
            "student": user.full_name if user else "Guest Learner",
            "lessons_completed": lessons,
            "videos_watched": videos,
            "quiz_count": len(quizzes),
            "quiz_average": avg,
            "learning_progress": progress,
            "streak": user.streak if user else 1,
            "weak_topics": list(dict.fromkeys(weak))[:5] or ["Need more quiz data"],
            "strong_topics": list(dict.fromkeys(strong))[:5] or ["Getting started"],
            "recommended_next_steps": [
                "Generate an animated lesson for your weakest topic",
                "Take one quiz after every video",
                "Ask the AI tutor to explain mistakes",
            ],
            "activities": activities,
            "score_trend": trend,
        },
    }

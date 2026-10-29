from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.payloads import RoadmapRequest
from app.security import get_current_user
from app.utils import log_activity

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("/generate")
def generate_roadmap(payload: RoadmapRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    dept = payload.department or "Computer Science"
    interest = payload.interests or "Artificial Intelligence"
    weak = payload.weak_areas or "Fundamentals"
    daily = [
        {"day": "Monday", "focus": f"Revise core {dept} basics related to {interest}"},
        {"day": "Tuesday", "focus": "Watch one animated lesson and write 5 key points"},
        {"day": "Wednesday", "focus": f"Practice problems in {weak}"},
        {"day": "Thursday", "focus": "Build a tiny example or code snippet"},
        {"day": "Friday", "focus": "Take a quiz and review mistakes"},
        {"day": "Saturday", "focus": "Ask the AI tutor your remaining doubts"},
        {"day": "Sunday", "focus": "Summarize the week and plan next milestones"},
    ]
    weekly = [
        {"week": 1, "title": "Foundations", "goal": f"Strengthen {payload.education_level} fundamentals"},
        {"week": 2, "title": "Core topic", "goal": f"Complete animated lessons on {interest}"},
        {"week": 3, "title": "Practice", "goal": f"Improve {weak} with quizzes and code analysis"},
        {"week": 4, "title": "Project", "goal": "Ship a small demo project and present it"},
    ]
    topics = [interest, weak, "Problem solving", "Revision and recall", "Mini project planning"]
    projects = [
        f"{interest} explainer animation for classmates",
        f"Quiz app for a {dept} subject",
        "Personal learning dashboard using your reports",
    ]
    skills = [s.strip() for s in (payload.skills or "Python, Communication").split(",") if s.strip()]
    if payload.quiz_performance < 70:
        skills.append("Concept revision")
    data = {
        "daily": daily,
        "weekly": weekly,
        "recommended_topics": topics,
        "recommended_projects": projects,
        "skills_to_improve": skills or ["Consistency", "Concept clarity"],
        "milestones": [
            "Finish 5 animated lessons",
            "Score above 80% in two quizzes",
            "Complete one mini project",
        ],
    }
    if user:
        log_activity(db, user.id, "roadmap", "Generated a personalized learning roadmap")
    return {"success": True, "data": data}

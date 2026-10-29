from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import VideoRecord
from app.schemas.payloads import AnimationRequest
from app.security import get_current_user
from app.services.video_generator import generate_educational_video
from app.utils import log_activity

router = APIRouter(prefix="/api/animation", tags=["animation"])


@router.post("/generate")
def generate_animation(payload: AnimationRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    result = generate_educational_video(payload.model_dump())
    record = VideoRecord(
        user_id=user.id if user else None,
        video_id=result["video_id"],
        filename=result["filename"],
        topic=payload.topic,
        character=payload.character,
        language=payload.language,
    )
    db.add(record)
    db.commit()
    if user:
        log_activity(db, user.id, "video", f"Generated animation for {payload.topic}")
    return {"success": True, "data": result}

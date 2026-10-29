import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.entities import Activity


def log_activity(db: Session, user_id, activity_type: str, description: str):
    if not user_id:
        return
    item = Activity(user_id=user_id, type=activity_type, description=description, created_at=datetime.utcnow())
    db.add(item)
    db.commit()


def dumps(value) -> str:
    return json.dumps(value, ensure_ascii=False)


def loads(value, fallback=None):
    if fallback is None:
        fallback = []
    try:
        return json.loads(value or "[]")
    except Exception:
        return fallback

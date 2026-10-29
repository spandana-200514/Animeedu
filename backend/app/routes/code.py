from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.payloads import CodeAnalyzeRequest
from app.security import get_current_user
from app.services.code_analyzer import analyze_code
from app.utils import log_activity

router = APIRouter(prefix="/api/code", tags=["code"])


@router.post("/analyze")
def analyze(payload: CodeAnalyzeRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    result = analyze_code(payload.language, payload.code)
    if user:
        log_activity(db, user.id, "code", f"Analyzed {payload.language} code")
    return {"success": True, "data": result}

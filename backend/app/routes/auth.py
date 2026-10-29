from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import User
from app.schemas.payloads import GoogleLoginRequest, LoginRequest, RegisterRequest
from app.security import create_token, hash_password, verify_password
from app.utils import log_activity

router = APIRouter(prefix="/api/auth", tags=["auth"])


def user_payload(user: User, token: str):
    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "education_level": user.education_level,
            "institution": user.institution,
            "department": user.department,
            "semester": user.semester,
            "streak": user.streak,
        },
    }


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.confirm_password and payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    existing = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    institution = payload.institution or payload.college_or_school
    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        education_level=payload.education_level,
        institution=institution,
        department=payload.department,
        semester=payload.semester,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    log_activity(db, user.id, "auth", "Created an AnimeEdu account")
    return {"success": True, "message": "Registration successful. Please login."}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_token(user.id, user.email)
    log_activity(db, user.id, "auth", "Logged in to AnimeEdu")
    return user_payload(user, token)


@router.post("/google")
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    email = (payload.email or "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Google login did not return an email address.")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name=payload.name or email.split("@")[0],
            email=email,
            password_hash=hash_password("google-oauth-account"),
            education_level="Undergraduate",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    token = create_token(user.id, user.email)
    log_activity(db, user.id, "auth", "Signed in with Google")
    return user_payload(user, token)

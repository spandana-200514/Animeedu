from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.payloads import TutorRequest
from app.security import get_current_user
from app.utils import log_activity

router = APIRouter(prefix="/api/tutor", tags=["tutor"])

KNOWLEDGE = {
    "machine learning": "Machine learning is a way for computers to learn patterns from data instead of using only hardcoded rules.",
    "neural network": "A neural network is a set of connected layers that transform inputs into predictions, inspired by how neurons pass signals.",
    "deep learning": "Deep learning uses many neural network layers to learn complex features from images, speech, or text.",
    "python": "Python is a readable programming language widely used for AI, data science, and beginner-friendly coding.",
}


def answer_question(topic: str, question: str, language: str) -> str:
    q = (question or "").lower()
    blob = f"{topic} {question}".lower()
    matched = None
    for key, value in KNOWLEDGE.items():
        if key in blob:
            matched = value
            break
    if "example" in q:
        core = matched or f"{topic} is a concept you can understand with a simple real-world analogy."
        reply = f"{core} Example: a spam filter learns from previous emails which messages are likely spam."
    elif "kannada" in q or language.lower() == "kannada":
        reply = f"{topic} ಅಂದರೆ ಒಂದು ಪಾಠ. ಮೊದಲು ಸರಳ ವ್ಯಾಖ್ಯೆ ಕಲಿಯಿರಿ, ನಂತರ ಉದಾಹರಣೆ ಮತ್ತು ಅಭ್ಯಾಸ ಮಾಡಿ."
    elif "hindi" in q or language.lower() == "hindi":
        reply = f"{topic} को आसान भाषा में समझें: पहले परिभाषा, फिर उदाहरण, फिर अभ्यास प्रश्न।"
    elif matched:
        reply = matched + f" Related to your lesson on {topic}, focus on definition, intuition, and one worked example."
    else:
        reply = (
            f"Here is a simple explanation for '{question}'. "
            f"In the context of {topic}, start with the definition, then the reason it exists, then a tiny example. "
            "If a term is new, replace it with an everyday analogy and rebuild the idea slowly."
        )
    return reply


@router.post("/ask")
def ask_tutor(payload: TutorRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    answer = answer_question(payload.topic, payload.question, payload.language)
    if user:
        log_activity(db, user.id, "tutor", f"Asked the AI tutor about {payload.topic}")
    return {"success": True, "data": {"answer": answer, "topic": payload.topic}}

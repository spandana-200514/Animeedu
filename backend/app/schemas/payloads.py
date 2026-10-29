from typing import List, Optional
from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    confirm_password: Optional[str] = None
    education_level: str = ""
    institution: str = ""
    college_or_school: str = ""
    department: str = ""
    semester: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class GoogleLoginRequest(BaseModel):
    email: str = ""
    name: str = ""
    credential: str = ""


class LessonRequest(BaseModel):
    topic: str
    subject: str = "General"
    difficulty: str = "Beginner"
    mode: str = "Visual"
    content: str = ""


class AnimationRequest(BaseModel):
    topic: str = "Machine Learning"
    character: str = "AI Teacher"
    language: str = "English"
    voice_tone: str = "Friendly"
    subject: str = "General"
    summary: str = ""
    duration: int = 30
    quality: str = "720p"
    subtitles: bool = True
    multilingual: bool = False
    animation_style: str = "Classroom"
    background_style: str = "Soft Gradient"


class QuizGenerateRequest(BaseModel):
    topic: str = "Machine Learning"
    difficulty: str = "Beginner"
    content: str = ""
    count: int = 5


class QuizAnswerRequest(BaseModel):
    topic: str = "Machine Learning"
    answers: List[int] = Field(default_factory=list)
    questions: list = Field(default_factory=list)


class TutorRequest(BaseModel):
    topic: str = "Machine Learning"
    question: str
    language: str = "English"


class CodeAnalyzeRequest(BaseModel):
    language: str = "Python"
    code: str


class RoadmapRequest(BaseModel):
    education_level: str = "Undergraduate"
    department: str = "Computer Science"
    interests: str = "Artificial Intelligence"
    skills: str = ""
    weak_areas: str = ""
    quiz_performance: float = 70.0

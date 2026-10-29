from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    education_level = Column(String(80), default="")
    institution = Column(String(160), default="")
    department = Column(String(120), default="")
    semester = Column(String(40), default="")
    streak = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    lessons = relationship("Lesson", back_populates="user")
    quizzes = relationship("QuizAttempt", back_populates="user")
    activities = relationship("Activity", back_populates="user")
    videos = relationship("VideoRecord", back_populates="user")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    topic = Column(String(255), nullable=False)
    subject = Column(String(120), default="General")
    difficulty = Column(String(40), default="Beginner")
    mode = Column(String(40), default="Visual")
    summary = Column(Text, default="")
    concepts = Column(Text, default="[]")
    key_points = Column(Text, default="[]")
    examples = Column(Text, default="[]")
    explanation = Column(Text, default="")
    source_text = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="lessons")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    topic = Column(String(255), default="")
    score = Column(Integer, default=0)
    total = Column(Integer, default=0)
    percentage = Column(Float, default=0.0)
    strengths = Column(Text, default="[]")
    weak_areas = Column(Text, default="[]")
    recommendation = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quizzes")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    type = Column(String(80), default="general")
    description = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activities")


class VideoRecord(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    video_id = Column(String(80), unique=True, index=True)
    filename = Column(String(255), nullable=False)
    topic = Column(String(255), default="")
    character = Column(String(120), default="")
    language = Column(String(80), default="English")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="videos")

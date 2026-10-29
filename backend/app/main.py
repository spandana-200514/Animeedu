import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.learning import router as learning_router
from app.routes.animation import router as animation_router
from app.routes.quiz import router as quiz_router
from app.routes.tutor import router as tutor_router
from app.routes.code import router as code_router
from app.routes.roadmap import router as roadmap_router
from app.routes.reports import router as reports_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AnimeEdu API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generated_dir = os.path.join(os.path.dirname(__file__), "generated")
os.makedirs(os.path.join(generated_dir, "videos"), exist_ok=True)
app.mount("/generated", StaticFiles(directory=generated_dir), name="generated")

app.include_router(auth_router)
app.include_router(learning_router)
app.include_router(animation_router)
app.include_router(quiz_router)
app.include_router(tutor_router)
app.include_router(code_router)
app.include_router(roadmap_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {"message": "AnimeEdu API is running", "status": "online"}

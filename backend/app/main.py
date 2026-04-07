from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import Base
from .api import auth, section, session, attendance

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Attendance System", version="1.0.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(section.router, prefix="/api/section", tags=["section"])
app.include_router(session.router, prefix="/api/session", tags=["session"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])

@app.get("/")
def root():
    return {"message": "Smart Attendance System API"}

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from ..database import Base
import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50))  # "student" or "lecturer"


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    lecturer_id = Column(Integer, ForeignKey("users.id"))


class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    section_id = Column(Integer, ForeignKey("sections.id"))
    face_embedding = Column(Text)  # JSON string of list of floats (FaceNet 128-d)


class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"))
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime)
    status = Column(String(20), default="ACTIVE")  # ACTIVE | EXPIRED
    lat = Column(Float, nullable=True)   # Lecturer's live latitude at session start
    lng = Column(Float, nullable=True)   # Lecturer's live longitude at session start


class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(20))   # PRESENT | REJECTED
    reason = Column(String(100), nullable=True)

    # Unique constraint: one student per session
    __table_args__ = (
        __import__("sqlalchemy").UniqueConstraint("session_id", "student_id", name="uq_attendance_session_student"),
    )

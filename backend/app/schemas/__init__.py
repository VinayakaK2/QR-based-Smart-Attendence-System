from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class RoleEnum(str, Enum):
    student = "student"
    lecturer = "lecturer"


# ============ User Models ============
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=70)
    role: RoleEnum
    section_id: Optional[str] = None
    face_image_base64: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str
    name: str


# ============ Section Models ============
class SectionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


# ============ Session Models ============
class SessionCreate(BaseModel):
    section_id: str
    duration_minutes: Optional[int] = None
    lecturer_lat: float
    lecturer_lng: float


# ============ Attendance Models ============
class AttendanceMark(BaseModel):
    session_id: str
    qr_token: Optional[str] = None
    face_image_base64: str
    lat: float
    lng: float


class AttendanceResponse(BaseModel):
    status: str
    reason: Optional[str] = None

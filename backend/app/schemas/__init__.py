from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class RoleEnum(str, Enum):
    student = "student"
    lecturer = "lecturer"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum
    # For students only
    section_id: Optional[int] = None
    face_image_base64: Optional[str] = None  # Mandatory if student


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str
    name: str


class SectionCreate(BaseModel):
    name: str


class SectionResponse(BaseModel):
    id: int
    name: str
    lecturer_id: int

    model_config = {"from_attributes": True}


class SessionCreate(BaseModel):
    section_id: int
    duration_minutes: int
    lecturer_lat: float
    lecturer_lng: float


class SessionResponse(BaseModel):
    id: int
    section_id: int
    start_time: datetime
    end_time: datetime
    status: str
    qr_token: str

    model_config = {"from_attributes": True}


class AttendanceMark(BaseModel):
    session_id: int
    qr_token: str
    face_image_base64: str
    lat: float
    lng: float


class AttendanceResponse(BaseModel):
    status: str
    reason: Optional[str] = None

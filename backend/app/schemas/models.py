from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema: dict) -> dict:
        schema.update(type="string")
        return schema

# ============ User Models ============
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    role: str = Field(..., pattern="^(student|lecturer)$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=70)
    face_image_base64: Optional[str] = None
    section_id: Optional[PyObjectId] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: PyObjectId = Field(alias="_id")
    password_hash: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# ============ Student Models ============
class StudentBase(BaseModel):
    user_id: PyObjectId
    section_id: PyObjectId
    face_embedding: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class StudentResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    section_id: PyObjectId

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# ============ Section Models ============
class SectionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    lecturer_id: PyObjectId

class SectionCreate(SectionBase):
    pass

class Section(SectionBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class SectionResponse(SectionBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# ============ Session Models ============
class SessionBase(BaseModel):
    section_id: PyObjectId
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    status: str = Field(default="ACTIVE", pattern="^(ACTIVE|EXPIRED)$")
    lat: Optional[float] = None
    lng: Optional[float] = None

class SessionCreate(BaseModel):
    section_id: PyObjectId
    lat: Optional[float] = None
    lng: Optional[float] = None

class Session(SessionBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class SessionResponse(SessionBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# ============ Attendance Models ============
class AttendanceBase(BaseModel):
    session_id: PyObjectId
    student_id: PyObjectId
    status: str = Field(..., pattern="^(PRESENT|REJECTED)$")
    reason: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AttendanceCreate(BaseModel):
    session_id: PyObjectId
    student_id: PyObjectId
    status: str
    reason: Optional[str] = None

class Attendance(AttendanceBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class AttendanceResponse(AttendanceBase):
    id: PyObjectId = Field(alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# ============ Token Models ============
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str
    name: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

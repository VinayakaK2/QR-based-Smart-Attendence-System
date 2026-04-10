"""
MongoDB models and collection helpers for the attendance system.
This module provides utilities for working with MongoDB collections.
"""

from database import get_db
from bson import ObjectId
from datetime import datetime

# Collection names
USERS_COLLECTION = "users"
SECTIONS_COLLECTION = "sections"
STUDENTS_COLLECTION = "students"
SESSIONS_COLLECTION = "sessions"
ATTENDANCE_COLLECTION = "attendance"


async def get_user_by_id(user_id: str):
    """Get user by ID"""
    db = get_db()
    return await db[USERS_COLLECTION].find_one({"_id": ObjectId(user_id)})


async def get_user_by_email(email: str):
    """Get user by email"""
    db = get_db()
    return await db[USERS_COLLECTION].find_one({"email": email})


async def create_user(user_data: dict):
    """Create new user"""
    db = get_db()
    result = await db[USERS_COLLECTION].insert_one(user_data)
    return result.inserted_id


async def get_section_by_id(section_id: str):
    """Get section by ID"""
    db = get_db()
    return await db[SECTIONS_COLLECTION].find_one({"_id": ObjectId(section_id)})


async def get_student_by_user_id(user_id: str):
    """Get student record by user ID"""
    db = get_db()
    return await db[STUDENTS_COLLECTION].find_one({"user_id": ObjectId(user_id)})


async def get_session_by_id(session_id: str):
    """Get session by ID"""
    db = get_db()
    return await db[SESSIONS_COLLECTION].find_one({"_id": ObjectId(session_id)})


async def get_attendance_record(session_id: str, student_id: str):
    """Get attendance record for a student in a session"""
    db = get_db()
    return await db[ATTENDANCE_COLLECTION].find_one({
        "session_id": ObjectId(session_id),
        "student_id": ObjectId(student_id)
    })

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List
from bson import ObjectId

from ..database import get_db
from ..schemas import AttendanceMark
from ..services.qr_service import validate_qr_token
from ..services.face_service import get_face_embedding, deserialize_embedding, compare_faces
from ..utils.location import is_within_range
from ..deps import get_current_user

router = APIRouter()


@router.post("/mark", response_model=dict)
async def mark_attendance(
    payload: AttendanceMark,
    current_user: dict = Depends(get_current_user),
):
    """Mark attendance with face recognition and QR validation"""
    db = get_db()

    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can mark attendance")

    # ── 1. Validate QR token signature + expiry ──────────────────────────
    qr_payload = validate_qr_token(payload.qr_token)
    if qr_payload is None:
        return {"status": "REJECTED", "reason": "session_expired"}

    if str(qr_payload.get("session_id")) != str(payload.session_id):
        return {"status": "REJECTED", "reason": "invalid_qr"}

    # ── 2. Check session is ACTIVE and not past end_time ─────────────────
    try:
        session = await db["sessions"].find_one({"_id": ObjectId(payload.session_id)})
    except Exception:
        return {"status": "REJECTED", "reason": "session_not_found"}

    if not session:
        return {"status": "REJECTED", "reason": "session_not_found"}

    now = datetime.utcnow()
    if session["status"] != "ACTIVE" or now > session["end_time"]:
        if session["status"] == "ACTIVE" and now > session["end_time"]:
            await db["sessions"].update_one(
                {"_id": ObjectId(payload.session_id)},
                {"$set": {"status": "EXPIRED"}}
            )
        return {"status": "REJECTED", "reason": "session_expired"}

    # ── 3. Get student profile ────────────────────────────────────────────
    student = await db["students"].find_one({"user_id": current_user["_id"]})
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found. Please complete registration.")

    # ── 4. Duplicate check ────────────────────────────────────────────────
    existing = await db["attendance"].find_one({
        "session_id": ObjectId(payload.session_id),
        "student_id": student["_id"],
    })
    if existing:
        return {"status": "REJECTED", "reason": "duplicate"}

    # ── 5. GPS location validation (50m radius from lecturer's location) ──
    if not is_within_range(session["lat"], session["lng"], payload.lat, payload.lng, max_radius_meters=50):
        await _log_rejected(db, str(payload.session_id), str(student["_id"]), now, "out_of_range")
        return {"status": "REJECTED", "reason": "out_of_range"}

    # ── 6. Face recognition ───────────────────────────────────────────────
    try:
        current_embedding = get_face_embedding(payload.face_image_base64)
    except ValueError:
        await _log_rejected(db, str(payload.session_id), str(student["_id"]), now, "face_mismatch")
        return {"status": "REJECTED", "reason": "face_mismatch"}
    except Exception:
        return {"status": "REJECTED", "reason": "face_processing_error"}

    stored_embedding = deserialize_embedding(student.get("face_embedding"))
    if not compare_faces(stored_embedding, current_embedding):
        await _log_rejected(db, str(payload.session_id), str(student["_id"]), now, "face_mismatch")
        return {"status": "REJECTED", "reason": "face_mismatch"}

    # ── All checks passed → PRESENT ───────────────────────────────────────
    record = {
        "session_id": ObjectId(payload.session_id),
        "student_id": student["_id"],
        "timestamp": now,
        "status": "PRESENT",
        "reason": None,
    }
    await db["attendance"].insert_one(record)
    return {"status": "PRESENT", "reason": None}


async def _log_rejected(db, session_id, student_id, now, reason):
    """Helper to log rejected attempts (ignores duplicate constraint violations)."""
    try:
        record = {
            "session_id": ObjectId(session_id),
            "student_id": ObjectId(student_id),
            "timestamp": now,
            "status": "REJECTED",
            "reason": reason,
        }
        await db["attendance"].insert_one(record)
    except Exception:
        pass


@router.get("/session/{session_id}", response_model=List[dict])
async def get_attendance_for_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get attendance records for a session"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can view session attendance")

    db = get_db()

    try:
        session = await db["sessions"].find_one({"_id": ObjectId(session_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    section = await db["sections"].find_one({"_id": session["section_id"]})
    if str(section["lecturer_id"]) != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Access denied")

    records = await db["attendance"].find({"session_id": ObjectId(session_id)}).to_list(length=None)
    result = []
    for r in records:
        try:
            student = await db["students"].find_one({"_id": r["student_id"]})
            user = await db["users"].find_one({"_id": student["user_id"]})
            result.append({
                "student_name": user["name"],
                "email": user["email"],
                "status": r["status"],
                "reason": r.get("reason"),
                "timestamp": r["timestamp"].isoformat(),
            })
        except Exception:
            pass
    return result


@router.get("/my-history", response_model=List[dict])
async def get_student_history(
    current_user: dict = Depends(get_current_user),
):
    """Get student's attendance history"""
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view their attendance history")

    db = get_db()

    student = await db["students"].find_one({"user_id": current_user["_id"]})
    if not student:
        return []

    records = await db["attendance"].find(
        {"student_id": student["_id"]}
    ).sort("timestamp", -1).to_list(length=None)

    result = []
    for r in records:
        try:
            session = await db["sessions"].find_one({"_id": r["session_id"]})
            section = await db["sections"].find_one({"_id": session["section_id"]})
            result.append({
                "session_id": str(r["session_id"]),
                "section_name": section["name"] if section else "Unknown",
                "status": r["status"],
                "reason": r.get("reason"),
                "timestamp": r["timestamp"].isoformat(),
            })
        except Exception:
            pass
    return result

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from typing import List
from bson import ObjectId

from ..database import get_db
from ..schemas import SessionCreate
from ..services.qr_service import generate_qr_token
from ..deps import get_current_user

router = APIRouter()


@router.post("/start", response_model=dict)
async def start_session(
    session_in: SessionCreate,
    current_user: dict = Depends(get_current_user),
):
    """Start new attendance session (lecturer only)"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can start sessions")

    db = get_db()

    # Verify section exists and belongs to this lecturer
    try:
        section = await db["sections"].find_one({"_id": ObjectId(session_in.section_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid section ID")

    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    if str(section["lecturer_id"]) != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Section does not belong to you")

    # Check if there's already an active session for this section
    active = await db["sessions"].find_one({
        "section_id": ObjectId(session_in.section_id),
        "status": "ACTIVE"
    })
    if active:
        raise HTTPException(status_code=400, detail="An active session already exists for this section")

    start_time = datetime.utcnow()
    end_time = start_time + timedelta(minutes=session_in.duration_minutes or 60)

    # Create session with lecturer's live location
    session_doc = {
        "section_id": ObjectId(session_in.section_id),
        "start_time": start_time,
        "end_time": end_time,
        "status": "ACTIVE",
        "lat": session_in.lecturer_lat,
        "lng": session_in.lecturer_lng,
    }
    result = await db["sessions"].insert_one(session_doc)
    session_id = result.inserted_id

    # Generate QR token
    qr_token = generate_qr_token(str(session_id), end_time)

    return {
        "id": str(session_id),
        "section_id": str(session_in.section_id),
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "status": "ACTIVE",
        "lat": session_in.lecturer_lat,
        "lng": session_in.lecturer_lng,
        "qr_token": qr_token,
    }


@router.post("/end/{session_id}", response_model=dict)
async def end_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """End attendance session (lecturer only)"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can end sessions")

    db = get_db()

    try:
        session = await db["sessions"].find_one({"_id": ObjectId(session_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Verify ownership
    section = await db["sections"].find_one({"_id": session["section_id"]})
    if str(section["lecturer_id"]) != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not your session")

    # Update session status
    await db["sessions"].update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"status": "EXPIRED"}}
    )
    return {"message": "Session ended"}


@router.get("/my-sessions", response_model=List[dict])
async def get_my_sessions(
    current_user: dict = Depends(get_current_user),
):
    """Get current lecturer's sessions"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can view sessions")

    db = get_db()
    sections = await db["sections"].find({"lecturer_id": current_user["_id"]}).to_list(length=None)
    section_ids = [section["_id"] for section in sections]

    sessions = await db["sessions"].find({"section_id": {"$in": section_ids}}).to_list(length=None)
    result = []
    for s in sessions:
        # Auto-expire sessions that are past end_time
        if s["status"] == "ACTIVE" and datetime.utcnow() > s["end_time"]:
            await db["sessions"].update_one(
                {"_id": s["_id"]},
                {"$set": {"status": "EXPIRED"}}
            )
            s["status"] = "EXPIRED"
        result.append({
            "id": str(s["_id"]),
            "section_id": str(s["section_id"]),
            "start_time": s["start_time"].isoformat(),
            "end_time": s["end_time"].isoformat(),
            "status": s["status"],
        })
    return result



@router.post("/end/{session_id}")
async def end_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """End attendance session (lecturer only)"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can end sessions")

    db = get_db()

    try:
        session = await db["sessions"].find_one({"_id": ObjectId(session_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Verify ownership
    section = await db["sections"].find_one({"_id": session["section_id"]})
    if str(section["lecturer_id"]) != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not your session")

    # Update session status
    await db["sessions"].update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {"status": "EXPIRED"}}
    )

    return {"message": "Session ended"}


@router.get("/my-sessions", response_model=List[dict])
async def get_my_sessions(
    current_user: dict = Depends(get_current_user),
):
    """Get lecturer's sessions"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can view sessions")

    db = get_db()

    # Get all sections for this lecturer
    sections = await db["sections"].find(
        {"lecturer_id": current_user["_id"]}
    ).to_list(length=None)
    section_ids = [s["_id"] for s in sections]

    # Get all sessions for these sections
    sessions = await db["sessions"].find({
        "section_id": {"$in": section_ids}
    }).to_list(length=None)

    result = []
    now = datetime.utcnow()
    for session in sessions:
        # Auto-expire sessions past end_time
        if session["status"] == "ACTIVE" and now > session["end_time"]:
            await db["sessions"].update_one(
                {"_id": session["_id"]},
                {"$set": {"status": "EXPIRED"}}
            )
            session["status"] = "EXPIRED"

        result.append({
            "id": str(session["_id"]),
            "section_id": str(session["section_id"]),
            "start_time": session["start_time"].isoformat(),
            "end_time": session["end_time"].isoformat(),
            "status": session["status"],
        })

    return result


@router.get("/{session_id}", response_model=dict)
async def get_session(session_id: str):
    """Get session details"""
    db = get_db()

    try:
        session = await db["sessions"].find_one({"_id": ObjectId(session_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return {
        "id": str(session["_id"]),
        "section_id": str(session["section_id"]),
        "start_time": session["start_time"].isoformat(),
        "end_time": session["end_time"].isoformat(),
        "status": session["status"],
        "lat": session.get("lat"),
        "lng": session.get("lng"),
    }

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return SessionResponse(
        id=session["_id"],
        section_id=session["section_id"],
        start_time=session["start_time"],
        end_time=session["end_time"],
        status=session["status"],
        lat=session.get("lat"),
        lng=session.get("lng"),
    )

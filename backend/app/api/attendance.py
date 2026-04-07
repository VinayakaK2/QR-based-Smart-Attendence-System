from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from datetime import datetime
from typing import List

from ..database import get_db
from ..models import User, Session as SessionModel, Student, Attendance as AttendanceModel, Section as SectionModel
from ..schemas import AttendanceMark, AttendanceResponse
from ..services.qr_service import validate_qr_token
from ..services.face_service import get_face_embedding, deserialize_embedding, compare_faces
from ..utils.location import is_within_range
from ..deps import get_current_user

router = APIRouter()


@router.post("/mark", response_model=AttendanceResponse)
def mark_attendance(
    payload: AttendanceMark,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can mark attendance")

    # ── 1. Validate QR token signature + expiry ──────────────────────────
    qr_payload = validate_qr_token(payload.qr_token)
    if qr_payload is None:
        return AttendanceResponse(status="REJECTED", reason="session_expired")

    if qr_payload["session_id"] != payload.session_id:
        return AttendanceResponse(status="REJECTED", reason="invalid_qr")

    # ── 2. Check session is ACTIVE and not past end_time ─────────────────
    session = db.query(SessionModel).filter(SessionModel.id == payload.session_id).first()
    if not session:
        return AttendanceResponse(status="REJECTED", reason="session_not_found")

    now = datetime.utcnow()
    if session.status != "ACTIVE" or now > session.end_time:
        if session.status == "ACTIVE" and now > session.end_time:
            session.status = "EXPIRED"
            db.commit()
        return AttendanceResponse(status="REJECTED", reason="session_expired")

    # ── 3. Get student profile ────────────────────────────────────────────
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile not found. Please complete registration.")

    # ── 4. Duplicate check ────────────────────────────────────────────────
    existing = db.query(AttendanceModel).filter(
        AttendanceModel.session_id == payload.session_id,
        AttendanceModel.student_id == student.id,
    ).first()
    if existing:
        return AttendanceResponse(status="REJECTED", reason="duplicate")

    # ── 5. GPS location validation (50m radius from lecturer's location) ──
    if not is_within_range(session.lat, session.lng, payload.lat, payload.lng, max_radius_meters=50):
        _log_rejected(db, payload.session_id, student.id, now, "out_of_range")
        return AttendanceResponse(status="REJECTED", reason="out_of_range")

    # ── 6. Face recognition ───────────────────────────────────────────────
    try:
        current_embedding = get_face_embedding(payload.face_image_base64)
    except ValueError:
        _log_rejected(db, payload.session_id, student.id, now, "face_mismatch")
        return AttendanceResponse(status="REJECTED", reason="face_mismatch")
    except Exception:
        return AttendanceResponse(status="REJECTED", reason="face_processing_error")

    stored_embedding = deserialize_embedding(student.face_embedding)
    if not compare_faces(stored_embedding, current_embedding):
        _log_rejected(db, payload.session_id, student.id, now, "face_mismatch")
        return AttendanceResponse(status="REJECTED", reason="face_mismatch")

    # ── All checks passed → PRESENT ───────────────────────────────────────
    record = AttendanceModel(
        session_id=payload.session_id,
        student_id=student.id,
        timestamp=now,
        status="PRESENT",
        reason=None,
    )
    db.add(record)
    db.commit()
    return AttendanceResponse(status="PRESENT", reason=None)


def _log_rejected(db, session_id, student_id, now, reason):
    """Helper to log rejected attempts (ignores duplicate constraint violations)."""
    try:
        record = AttendanceModel(
            session_id=session_id,
            student_id=student_id,
            timestamp=now,
            status="REJECTED",
            reason=reason,
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()


@router.get("/session/{session_id}", response_model=List[dict])
def get_attendance_for_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    if current_user.role != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can view session attendance")

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    section = db.query(SectionModel).filter(SectionModel.id == session.section_id).first()
    if section.lecturer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    records = db.query(AttendanceModel).filter(AttendanceModel.session_id == session_id).all()
    result = []
    for r in records:
        student = db.query(Student).filter(Student.id == r.student_id).first()
        user = db.query(User).filter(User.id == student.user_id).first()
        result.append({
            "student_name": user.name,
            "email": user.email,
            "status": r.status,
            "reason": r.reason,
            "timestamp": r.timestamp.isoformat(),
        })
    return result


@router.get("/my-history", response_model=List[dict])
def get_student_history(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can view their attendance history")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []

    records = db.query(AttendanceModel).filter(
        AttendanceModel.student_id == student.id
    ).order_by(AttendanceModel.timestamp.desc()).all()

    result = []
    for r in records:
        session = db.query(SessionModel).filter(SessionModel.id == r.session_id).first()
        section = db.query(SectionModel).filter(SectionModel.id == session.section_id).first()
        result.append({
            "session_id": r.session_id,
            "section_name": section.name if section else "Unknown",
            "status": r.status,
            "reason": r.reason,
            "timestamp": r.timestamp.isoformat(),
        })
    return result

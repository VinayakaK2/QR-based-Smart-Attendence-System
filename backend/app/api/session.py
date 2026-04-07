from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from ..database import get_db
from ..models import User, Session as SessionModel, Section as SectionModel, Attendance
from ..schemas import SessionCreate, SessionResponse
from ..services.qr_service import generate_qr_token
from ..deps import get_current_user

router = APIRouter()


@router.post("/start", response_model=SessionResponse)
def start_session(
    session_in: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can start sessions")

    # Verify section belongs to this lecturer
    section = db.query(SectionModel).filter(SectionModel.id == session_in.section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    if section.lecturer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Section does not belong to you")

    # Check if there's already an active session for this section
    active = db.query(SessionModel).filter(
        SessionModel.section_id == session_in.section_id,
        SessionModel.status == "ACTIVE"
    ).first()
    if active:
        raise HTTPException(status_code=400, detail="An active session already exists for this section")

    start_time = datetime.utcnow()
    end_time = start_time + timedelta(minutes=session_in.duration_minutes)

    # Save lecturer's LIVE location at the time of starting the session
    session = SessionModel(
        section_id=session_in.section_id,
        start_time=start_time,
        end_time=end_time,
        status="ACTIVE",
        lat=session_in.lecturer_lat,
        lng=session_in.lecturer_lng,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Generate a signed QR token that expires when the session ends
    qr_token = generate_qr_token(session.id, end_time)

    return SessionResponse(
        id=session.id,
        section_id=session.section_id,
        start_time=session.start_time,
        end_time=session.end_time,
        status=session.status,
        qr_token=qr_token,
    )


@router.post("/end/{session_id}")
def end_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can end sessions")

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    section = db.query(SectionModel).filter(SectionModel.id == session.section_id).first()
    if section.lecturer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your session")

    session.status = "EXPIRED"
    db.commit()
    return {"message": "Session ended"}


@router.get("/my-sessions", response_model=List[dict])
def get_my_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can view sessions")

    sections = db.query(SectionModel).filter(SectionModel.lecturer_id == current_user.id).all()
    section_ids = [s.id for s in sections]

    sessions = db.query(SessionModel).filter(SessionModel.section_id.in_(section_ids)).all()
    result = []
    for s in sessions:
        # Auto-expire sessions that are past end_time
        if s.status == "ACTIVE" and datetime.utcnow() > s.end_time:
            s.status = "EXPIRED"
            db.commit()
        result.append({
            "id": s.id,
            "section_id": s.section_id,
            "start_time": s.start_time.isoformat(),
            "end_time": s.end_time.isoformat(),
            "status": s.status,
        })
    return result

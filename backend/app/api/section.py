from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, Section as SectionModel
from ..schemas import SectionCreate, SectionResponse
from ..deps import get_current_user, get_current_user_optional
from typing import Optional
router = APIRouter()


@router.post("/create", response_model=SectionResponse)
def create_section(
    section_in: SectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can create sections")

    section = SectionModel(
        name=section_in.name,
        lecturer_id=current_user.id,
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.get("/all", response_model=List[SectionResponse])
def get_all_sections(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    if current_user and current_user.role == "lecturer":
        return db.query(SectionModel).filter(SectionModel.lecturer_id == current_user.id).all()
    # Students see all sections (to select one during registration)
    return db.query(SectionModel).all()

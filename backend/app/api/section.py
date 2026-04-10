from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId

from ..database import get_db
from ..schemas import SectionCreate
from ..deps import get_current_user, get_current_user_optional

router = APIRouter()


@router.post("/create", response_model=dict)
async def create_section(
    section_in: SectionCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create new section (lecturer only)"""
    if current_user["role"] != "lecturer":
        raise HTTPException(status_code=403, detail="Only lecturers can create sections")

    db = get_db()
    section_doc = {
        "name": section_in.name,
        "lecturer_id": current_user["_id"],
    }
    result = await db["sections"].insert_one(section_doc)

    return {
        "id": str(result.inserted_id),
        "name": section_doc["name"],
        "lecturer_id": str(section_doc["lecturer_id"]),
    }


@router.get("/all", response_model=List[dict])
async def get_all_sections(
    current_user: dict = Depends(get_current_user_optional),
):
    """Get all sections (lecturers see only theirs, students see all)"""
    db = get_db()

    if current_user and current_user["role"] == "lecturer":
        # Lecturers see only their sections
        sections = await db["sections"].find(
            {"lecturer_id": current_user["_id"]}
        ).to_list(length=None)
    else:
        # Students see all sections
        sections = await db["sections"].find().to_list(length=None)

    return [
        {
            "id": str(section["_id"]),
            "name": section["name"],
            "lecturer_id": str(section["lecturer_id"]),
        }
        for section in sections
    ]


@router.get("/{section_id}", response_model=dict)
async def get_section(section_id: str):
    """Get section details"""
    db = get_db()

    try:
        section = await db["sections"].find_one({"_id": ObjectId(section_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid section ID")

    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    return {
        "id": str(section["_id"]),
        "name": section["name"],
        "lecturer_id": str(section["lecturer_id"]),
    }


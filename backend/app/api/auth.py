from fastapi import APIRouter, Depends, HTTPException
from datetime import timedelta
from bson import ObjectId

from ..database import get_db
from ..schemas import UserCreate, UserLogin, Token
from ..utils.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_DAYS
from ..services.face_service import get_face_embedding, serialize_embedding
from ..deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=dict)
async def register(user_in: UserCreate):
    """Register new user (student or lecturer)"""
    db = get_db()

    # Check duplicate email
    existing = await db["users"].find_one({"email": user_in.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # For students, face image is mandatory
    embedding = None
    if user_in.role == "student":
        if not user_in.face_image_base64:
            raise HTTPException(status_code=400, detail="Face image is required for student registration")
        if not user_in.section_id:
            raise HTTPException(status_code=400, detail="Section ID is required for student registration")

        try:
            embedding = get_face_embedding(user_in.face_image_base64)
        except ValueError as e:
            raise HTTPException(
                status_code=422,
                detail=f"Face not detected in the image. Please ensure your face is clearly visible and retake the photo. ({e})"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Face processing error: {str(e)}")

    if len(user_in.password) > 70:
        raise HTTPException(status_code=400, detail="Password must be less than 70 characters")

    # Create user record
    user_doc = {
        "name": user_in.name,
        "email": user_in.email,
        "password_hash": get_password_hash(user_in.password),
        "role": user_in.role,
    }
    result = await db["users"].insert_one(user_doc)
    user_id = result.inserted_id

    # If student, create student record with embedding
    if user_in.role == "student" and embedding is not None:
        student_doc = {
            "user_id": user_id,
            "section_id": user_in.section_id,
            "face_embedding": serialize_embedding(embedding),
        }
        await db["students"].insert_one(student_doc)

    return {"message": "Registration successful", "user_id": str(user_id), "role": user_in.role}


@router.post("/login", response_model=Token)
async def login(form_data: UserLogin):
    """Login and get JWT token"""
    db = get_db()

    user = await db["users"].find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(
        data={"user_id": str(user["_id"]), "role": user["role"]},
        expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
    )
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=str(user["_id"]),
        role=user["role"],
        name=user["name"],
    )


@router.get("/me", response_model=dict)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
    }


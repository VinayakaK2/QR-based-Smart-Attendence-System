from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, Token
from ..utils.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_DAYS
from ..services.face_service import get_face_embedding, serialize_embedding
from ..deps import get_current_user
from .. import models

router = APIRouter()


@router.post("/register", response_model=dict)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
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
    user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If student, create student record with embedding only (no raw image stored)
    if user_in.role == "student" and embedding is not None:
        student = models.Student(
            user_id=user.id,
            section_id=user_in.section_id,
            face_embedding=serialize_embedding(embedding),
        )
        db.add(student)
        db.commit()

    return {"message": "Registration successful", "user_id": user.id, "role": user.role}


@router.post("/login", response_model=Token)
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(
        data={"user_id": user.id, "role": user.role},
        expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
    )
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
        name=user.name,
    )


@router.get("/me", response_model=dict)
def get_me(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role}

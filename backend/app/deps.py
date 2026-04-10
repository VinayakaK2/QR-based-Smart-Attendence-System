from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .database import get_db
from .utils.security import decode_access_token
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("user_id")
    if user_id is None:
        raise credentials_exception

    db = get_db()
    try:
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    return user


async def get_current_user_optional(token: str = Depends(OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False))):
    """Get current user from JWT token (optional)"""
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("user_id")
        if user_id is None:
            return None
        db = get_db()
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        return user
    except Exception:
        return None


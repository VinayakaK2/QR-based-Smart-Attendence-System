import jwt as pyjwt
from datetime import datetime, timedelta
import os

QR_SECRET = os.environ.get("QR_SECRET", "qr_super_secret_key")
ALGORITHM = "HS256"

def generate_qr_token(session_id: int, end_time: datetime) -> str:
    """
    Generates a signed JWT token for the QR code.
    Contains session_id and expiry (= session end_time).
    """
    payload = {
        "session_id": session_id,
        "exp": end_time,  # Token expires exactly when session ends
        "type": "attendance_qr"
    }
    token = pyjwt.encode(payload, QR_SECRET, algorithm=ALGORITHM)
    return token

def validate_qr_token(token: str) -> dict | None:
    """
    Validates a QR token. Returns payload if valid, None otherwise.
    """
    try:
        payload = pyjwt.decode(token, QR_SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "attendance_qr":
            return None
        return payload
    except pyjwt.ExpiredSignatureError:
        return None
    except pyjwt.InvalidTokenError:
        return None

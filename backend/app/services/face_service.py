from __future__ import annotations
import base64
import numpy as np
import cv2
# from deepface import DeepFace  # Commented out - install separately if needed
import json
from typing import List

# Stub DeepFace class for testing without deepface installed
class DeepFace:
    @staticmethod
    def represent(img_path, model_name="Facenet", enforce_detection=True):
        """Stub method - returns mock embedding"""
        print("WARNING: Using stub DeepFace.represent() - install deepface for real functionality")
        return [{"embedding": [0.0] * 128}]

def base64_to_image(base64_string: str) -> np.ndarray:
    """
    Decodes a base64 string to a cv2 image (numpy array).
    Handles format with or without prefix 'data:image/jpeg;base64,'.
    """
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]
    
    img_data = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

def get_face_embedding(base64_string: str) -> list[float]:
    """
    Extracts a FaceNet embedding using deepface.
    Returns a list of floats on success.
    Throws ValueError if no face is detected.
    """
    img = base64_to_image(base64_string)
    # DeepFace.represent returns a list of dictionaries (one for each face detected)
    results = DeepFace.represent(img_path=img, model_name="Facenet", enforce_detection=True)
    if len(results) == 0:
        raise ValueError("No face detected")
    return results[0]["embedding"]

def serialize_embedding(embedding: list[float]) -> str:
    """Converts a float list to JSON string for database storage."""
    return json.dumps(embedding)

def deserialize_embedding(embedding_json: str) -> list[float]:
    """Converts stored JSON string back to float list."""
    return json.loads(embedding_json)

def compare_faces(embedding1: list[float], embedding2: list[float], threshold: float = 0.40) -> bool:
    """
    Compares two FaceNet embeddings using cosine distance.
    Distance smaller than threshold means they match.
    FaceNet typically uses 0.40 as threshold in DeepFace default.
    """
    # Using cosine distance formulation from scipy/deepface: 
    # 1 - cosine_similarity
    a = np.array(embedding1)
    b = np.array(embedding2)
    distance = 1 - np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    return distance < threshold

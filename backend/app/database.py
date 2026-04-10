from motor.motor_asyncio import AsyncIOMotorClient
import os

# MongoDB connection string
MONGODB_URL = os.environ.get(
    "MONGODB_URL",
    "mongodb://localhost:27017"
)
MONGODB_DATABASE = os.environ.get(
    "MONGODB_DATABASE",
    "attendance_system"
)

class MongoDB:
    client = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Initialize MongoDB connection"""
    mongodb.client = AsyncIOMotorClient(MONGODB_URL)
    mongodb.db = mongodb.client[MONGODB_DATABASE]

    # Create collections if they don't exist
    await init_collections()
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close MongoDB connection"""
    if mongodb.client:
        mongodb.client.close()
        print("Disconnected from MongoDB")

async def init_collections():
    """Initialize collections and indexes"""
    db = mongodb.db

    # Users collection
    if "users" not in await db.list_collection_names():
        await db.create_collection("users")
    users = db["users"]
    await users.create_index("email", unique=True, sparse=True)
    await users.create_index("role")

    # Sections collection
    if "sections" not in await db.list_collection_names():
        await db.create_collection("sections")
    sections = db["sections"]
    await sections.create_index("lecturer_id")

    # Students collection
    if "students" not in await db.list_collection_names():
        await db.create_collection("students")
    students = db["students"]
    await students.create_index("user_id", unique=True, sparse=True)
    await students.create_index("section_id")

    # Sessions collection
    if "sessions" not in await db.list_collection_names():
        await db.create_collection("sessions")
    sessions = db["sessions"]
    await sessions.create_index("section_id")
    await sessions.create_index("start_time")
    await sessions.create_index("status")

    # Attendance collection
    if "attendance" not in await db.list_collection_names():
        await db.create_collection("attendance")
    attendance = db["attendance"]
    await attendance.create_index([("session_id", 1), ("student_id", 1)], unique=True, sparse=True)
    await attendance.create_index("session_id")
    await attendance.create_index("student_id")
    await attendance.create_index("timestamp")

def get_db():
    """Get database instance"""
    return mongodb.db

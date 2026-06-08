import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("CRITICAL: MONGO_URI missing from .env")

# Reusable connection client with safe connection pooling boundaries
client = MongoClient(mongo_uri, maxPoolSize=50, minPoolSize=10)
db = client["placement_prep_db"]

def initialize_single_user_profile():
    """
    Ensures a single-user state exists in the database.
    Pre-seeds default history if the collection is empty.
    """
    profile_collection = db["user_profile"]
    
    # Check if our single user already has a tracking document
    user_state = profile_collection.find_one()
    
    if not user_state:
        print("-> No existing profile found. Initializing default single-user state...")
        default_profile = {
            "last_completed_topic": "None",
            "strengths": "None logged yet. This is the first session.",
            "weaknesses": "None logged yet. This is the first session.",
            "improvements_made": "None logged yet. No previous sessions analyzed.",
            "overall_accuracy": 0,
            "total_quizzes_taken": 0,
            
            # Subject-wise baseline percentages stashed safely within user_profile doc
            "subject_insights": {
                "Data Structures & Algorithms": "0%",
                "Database Management Systems": "0%",
                "Operating Systems": "0%"
            }
        }
        profile_collection.insert_one(default_profile)
        print("✓ Default profile pre-seeded successfully with baseline tracking metrics.")
    else:
        print("✓ Active user profile loaded.")


def initialize_insights_collection():
    """
    Ensures a separate standalone 'insights' collection exists.
    Pre-seeds a default analytical tracking sheet if completely empty.
    """
    insights_collection = db["insights"]
    existing_insights = insights_collection.find_one()

    if not existing_insights:
        print("-> Standalone 'insights' collection is empty. Pre-seeding table metadata...")
        default_insights = {
            "summary": "No evaluation analytics generated yet. Submit your first mixed-subject quiz.",
            "subject_breakdown": {
                "Data Structures & Algorithms": 0.0,
                "Database Management Systems": 0.0,
                "Operating Systems": 0.0
            },
            "last_updated_timestamp": None
        }
        insights_collection.insert_one(default_insights)
        print("✓ Standalone 'insights' collection tracked successfully.")
    else:
        print("✓ Standalone 'insights' historical collection loaded.")


def verify_todays_quiz_collection():
    """
    Diagnostics check for the runtime quiz layout collection state.
    """
    quiz_collection = db["todays_quiz"]
    active_quiz = quiz_collection.find_one()
    
    if active_quiz:
        print(f"✓ Active session found in 'todays_quiz' for topic: '{active_quiz.get('topic')}' (Completed: {active_quiz.get('completed', False)})")
    else:
        print("⊙ 'todays_quiz' is currently clear. Ready for next generation request.")


if __name__ == "__main__":
    try:
        print("Testing MongoDB connection...")
        # Force a connection check
        client.server_info()
        print("Connection successful!")
        
        # Run our complete configuration structural checks
        initialize_single_user_profile()
        initialize_insights_collection()
        verify_todays_quiz_collection()
        
    except Exception as e:
        print("Connection failed:", e)
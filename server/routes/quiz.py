from flask import Blueprint, jsonify
from services.db import db

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route("/fetch", methods=["GET"])
def fetch_quiz():
    """
    Exposed API Route: Fetches the currently cached quiz document 
    for the frontend UI to display.
    URL: GET /api/quiz/fetch
    """
    try:
        active_quiz = db["todays_quiz"].find_one()
        
        if not active_quiz:
            return jsonify({
                "status": "empty",
                "message": "No quiz has been generated for today yet."
            }), 404
            
        # Convert MongoDB's internal ObjectId to a string so it's JSON serializable
        active_quiz["_id"] = str(active_quiz["_id"])
        
        return jsonify({
            "status": "success",
            "quiz_data": active_quiz
        }), 200

    except Exception as error:
        return jsonify({"error": "Failed to retrieve active quiz", "details": str(error)}), 500


def mark_quiz_as_completed():
    """
    Internal Helper Function (NOT a route): Can be imported and called 
    by other route files (like your evaluation script) to update the status flag.
    """
    try:
        result = db["todays_quiz"].update_one(
            {"completed": False}, 
            {"$set": {"completed": True}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error marking quiz as completed: {e}")
        return False
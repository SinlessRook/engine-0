import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
# Initialize connections and import initialization function
from services.db import initialize_single_user_profile


# Import the blueprint route we want to test
from routes.generator import generator_bp
from routes.evaluvator import evaluator_bp
from routes.quiz import quiz_bp

app = Flask(__name__)
CORS(app)

# Register the quiz generator route
app.register_blueprint(generator_bp, url_prefix="/api/quiz")
app.register_blueprint(evaluator_bp, url_prefix="/api/quiz")
app.register_blueprint(quiz_bp, url_prefix="/api/quiz")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    print("--- Running Service Diagnostics on Startup ---")
    try:
        # Run our single-user profile check/seed right when the server fires up
        initialize_single_user_profile()
    except Exception as e:
        print(f"✗ Service initialization warning: {e}")
    print("-----------------------------------------------\n")

    port = int(os.getenv("PORT", 5000))
    # Note: Flask's built-in print output shows the port, 
    # so we run app.run last as it blocks the thread execution while active.
    app.run(host="0.0.0.0", port=port, debug=True)
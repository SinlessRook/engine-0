import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

gemini_key = os.getenv("GEMINI_API_KEY")
if not gemini_key:
    raise ValueError("CRITICAL: GEMINI_API_KEY missing from .env")

# Official modern Google GenAI Client configuration
ai_client = genai.Client(api_key=gemini_key)

if __name__ == "__main__":
    # Simple test to verify Gemini API connection
    try:
        print("Testing Gemini API connection...")
        response = ai_client.models.generate_content(
            model="gemini-3.5-flash",
            contents="Explain how AI works in a few words"
        )        
        print("Generated Content:", response)
        print("Connection successful!")
    except Exception as e:
        print("Connection failed:", e)
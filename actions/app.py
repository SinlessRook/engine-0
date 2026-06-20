import os
import json
import time
import requests
import resend

from google import genai
from dotenv import load_dotenv

load_dotenv()


BACKEND_URL = os.environ["BACKEND_URL"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]


client = genai.Client(api_key=GEMINI_API_KEY)


def wake_backend():
    print("Waking backend...")

    try:
        requests.get(BACKEND_URL, timeout=30)
    except Exception:
        pass

    for attempt in range(24):  # 24 * 10s = 4 min
        try:
            response = requests.get(
                BACKEND_URL,
                timeout=30,
            )

            if response.status_code < 500:
                print("Backend awake")
                return

        except Exception:
            pass

        print(f"Waiting... ({attempt + 1}/24)")
        time.sleep(10)

    raise Exception("Backend failed to wake")


def generate_quiz():
    print("Generating quiz...")

    response = requests.post(
        f"{BACKEND_URL}/api/quiz/generate",
        timeout=300,
    )

    response.raise_for_status()

    return response.json()


def get_resources(topic):
    prompt = f"""
Topic: {topic}

Recommend:
1. Three articles/resources
2. Two YouTube search queries
3. Three key concepts to revise

Return JSON:
{{
  "resources": [],
  "youtube_queries": [],
  "revision_points": []
}}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text[7:-3]

    return json.loads(text)


def create_message(topic, deadline, resources):
    prompt = f"""
    Create an email for a daily quiz notification.

    Topic: {topic}
    Deadline: {deadline}

    Resources:
    {json.dumps(resources, indent=2)}

    Requirements:
    - Return ONLY valid HTML
    - No markdown
    - No code fences
    - Professional email layout
    - Include a heading
    - Mention the topic
    - Mention the deadline prominently
    - Include resources as clickable links
    - Include revision points as bullet points
    - Do NOT include any buttons
    - Keep the email concise

    Output HTML only.
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    return response.text

def send_notification(message):
    print("Sending notification...")

    resend.api_key = os.environ["RESEND_API_KEY"]

    response = resend.Emails.send(
        {
            "from": os.environ["RESEND_SENDER_EMAIL"],
            "to": [os.environ["RESEND_RECIPIENT_EMAIL"]],
            "subject": "📚 Today's Quiz is Ready",
            "html": message,
        }
    )

    print(response)

    print(
        f"Notification sent to "
        f"{os.environ['RESEND_RECIPIENT_EMAIL']}"
    )

def main():
    wake_backend()

    quiz = generate_quiz()

    topic = quiz.get("topic", "Unknown Topic")
    deadline = quiz.get("deadline", "Today")
    if topic == "Unknown Topic" :
        print("Failed to generate quiz topic.")
        resources = {}
    else:
        resources = get_resources(topic)

    message = create_message(
        topic,
        deadline,
        resources,
    )
    message += f"""
            <br><br>
            <p>
                Your daily quiz is ready. Click the button below to start the test and challenge yourself.
            </p>
            <br>
            <p>
                <a href="{os.environ['QUIZ_PLATFORM_URL']}"
                style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;">
                    Attend Test Now
                </a>
            </p>
            """

    send_notification(message)


if __name__ == "__main__":
    main()
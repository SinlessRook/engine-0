import json
import os
import time
from flask import Blueprint, request, jsonify
from services.db import db
from services.llm import ai_client
from tools.prompt_loader import load_prompt_file
from routes.quiz import mark_quiz_as_completed
from dotenv import load_dotenv

load_dotenv()
evaluator_bp = Blueprint("evaluator", __name__)

@evaluator_bp.route("/evaluate", methods=["POST"])
def submit_quiz():
    data = request.get_json() or {}
    user_answers = data.get("answers", [])

    if not user_answers:
        return jsonify({"error": "No answers provided in the request body."}), 400

    try:
        # 1. Fetch active session metadata from todays_quiz
        active_session = db["todays_quiz"].find_one() or {}
        target_topic = active_session.get("topic", "Dynamic Quiz Topic")

        # 2. Fetch existing student history from MongoDB
        user_profile = db["user_profile"].find_one() or {}
        old_strengths = user_profile.get("strengths", "None logged yet.")
        old_weaknesses = user_profile.get("weaknesses", "None logged yet.")
        improvements_log = user_profile.get("improvements_made", "No improvements logged yet.")
        existing_subject_insights = user_profile.get("subject_insights", {})

        # 3. Programmatic Grading & Telemetry Calculations
        correct_count = 0
        total_questions = len(user_answers)
        total_time = 0
        grading_summary = []

        for item in user_answers:
            question_text = item.get("question")
            correct_ans = item.get("correct_answer")
            selected = item.get("user_selected")
            q_type = item.get("type", "mcq")
            time_spent = item.get("time_spent_seconds", 0)
            
            total_time += time_spent
            is_correct = False
            
            # Type-Safe Logical Evaluation Guarded Router
            try:
                if q_type in ["mcq", "short_answer"]:
                    is_correct = (str(selected).strip().lower() == str(correct_ans).strip().lower())
                    
                elif q_type in ["msq", "ordering"]:
                    # Ensure selections are real arrays before calculating sets
                    if isinstance(selected, list) and isinstance(correct_ans, list):
                        is_correct = (set(selected) == set(correct_ans))
                    else:
                        is_correct = (selected == correct_ans)
                        
                elif q_type == "matching":
                    if isinstance(selected, dict) and isinstance(correct_ans, dict):
                        is_correct = (json.dumps(selected, sort_keys=True) == json.dumps(correct_ans, sort_keys=True))
                    else:
                        is_correct = (selected == correct_ans)
                        
                elif q_type == "long_answer":
                    is_correct = True  # Handled natively by our prompt rubric evaluator
            except Exception as internal_check_err:
                print(f"Programmatic check warning for question type {q_type}: {internal_check_err}")
                is_correct = False
            
            if is_correct:
                correct_count += 1
                
            grading_summary.append({
                "question_text": question_text,
                "type": q_type,
                "user_selected": selected,
                "correct_answer": correct_ans,
                "was_correct": is_correct,
                "time_spent_seconds": time_spent
            })

        accuracy_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
        avg_time_per_question = total_time / total_questions if total_questions > 0 else 0

        # 4. Context-Aware Progress Analysis via Gemini
        evaluator_template = load_prompt_file("evaluator.txt")
        evaluator_prompt = evaluator_template.format(
            target_topic=target_topic,
            correct_count=correct_count,
            total_questions=total_questions,
            accuracy_percentage=accuracy_percentage,
            avg_time_per_question=avg_time_per_question,
            grading_summary_json=json.dumps(grading_summary, indent=2),
            old_strengths=old_strengths,
            old_weaknesses=old_weaknesses,
            improvements_log=improvements_log
        )

        try:
            ai_analysis = ai_client.models.generate_content(
            model=os.getenv("GEMINI_MODEL"),
            contents=evaluator_prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.2})
        except Exception as ai_error:
            print(f"AI evaluation service error: {ai_error}")
            try:
                ai_analysis = ai_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=evaluator_prompt,
                    config={
                        "response_mime_type": "application/json",
                        "temperature": 0.5}
                )
            except Exception as fallback_error:
                print(f"Fallback AI evaluation service error: {fallback_error}")
                try:
                    ai_analysis = ai_client.models.generate_content(
                        model="gemini-3.1-flash-lite",
                        contents=evaluator_prompt,
                        config={
                            "response_mime_type": "application/json",
                            "temperature": 0.5}
                    )
                except Exception as final_error:
                    print(f"Final fallback AI evaluation service error: {final_error}")
                    raise Exception("All AI evaluation attempts failed.")

        insights = json.loads(ai_analysis.text)

        # 5. Write back merged profile results to MongoDB
        updated_total_quizzes = user_profile.get("total_quizzes_taken", 0) + 1
        
        # Pull dynamic, open-ended fields directly from Gemini's response
        incoming_subject_insights = insights.get("subject_insights", {})
        
        # Merge incoming updates over your historic metrics without wiping unrelated subjects!
        updated_subject_insights = {**existing_subject_insights, **incoming_subject_insights}

        update_payload = {
            "$set": {
                "strengths": insights.get("strengths", old_strengths),
                "weaknesses": insights.get("weaknesses", old_weaknesses),
                "improvements_made": insights.get("improvements_made", improvements_log),
                "subject_insights": updated_subject_insights,
                "overall_accuracy": accuracy_percentage,
                "total_quizzes_taken": updated_total_quizzes
            }
        }

        # Progress check: advance the tracking baseline on passing marks
        if accuracy_percentage >= 60.0 and target_topic != "Dynamic Quiz Topic":
            update_payload["$set"]["last_completed_topic"] = target_topic

        # Atomically update user document profile
        db["user_profile"].update_one({}, update_payload)

        # Simultaneously sync to your separate insights tracking log table
        db["insights"].update_one(
            {}, 
            {
                "$set": {
                    "summary": insights.get("improvements_made", "Completed tracking step."),
                    "subject_breakdown": updated_subject_insights,
                    "last_updated_timestamp": time.time()
                }
            },
            upsert=True
        )

        # 6. Flush runtime state trackers
        mark_quiz_as_completed()

        return jsonify({
            "status": "success",
            "metrics": {
                "score": f"{correct_count}/{total_questions}",
                "accuracy": f"{accuracy_percentage}%",
                "average_time_seconds": round(avg_time_per_question, 1)
            },
            "ai_feedback": insights
        }), 200

    except Exception as error:
        # Diagnostic stack print out to identify system runtime anomalies
        print(f"Fatal server evaluation crash breakdown: {str(error)}")
        return jsonify({"error": "Failed to evaluate performance logs", "details": str(error)}), 500
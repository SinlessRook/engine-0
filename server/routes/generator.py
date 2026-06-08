import os
import json
import time
from flask import Blueprint, request, jsonify
from google.genai import types

from services.db import db
from services.llm import ai_client
from tools.syllabus_parser import get_raw_syllabus
from tools.research import research_on_topic
from tools.prompt_loader import load_prompt_file

from dotenv import load_dotenv

load_dotenv()

generator_bp = Blueprint("generator", __name__)

# ==========================================
# 1. GENERATE QUIZ ENDPOINT
# ==========================================
@generator_bp.route("/generate", methods=["POST"])
def generate_quiz():
    try:
      # 1. Read Memory & Profile Analytics Matrix
        user_profile = db["user_profile"].find_one() or {}
        last_completed_topic = user_profile.get("last_completed_topic", "None")
        historical_weaknesses = user_profile.get("weaknesses", "None logged yet")
        historical_strengths = user_profile.get("strengths", "None logged yet")
        
        # Pull existing subject-wise dashboard percentages
        profile_subject_insights = user_profile.get("subject_insights", {})

        # 2. Dynamic Directory Discovery (Using your folder name "syllabus")
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        syllabi_dir = os.path.join(base_dir, "syllabus")
        
        if not os.path.exists(syllabi_dir):
            return jsonify({"error": "Syllabus directory missing on server layout"}), 500
            
        available_files = [f for f in os.listdir(syllabi_dir) if f.endswith(".md")]
        if not available_files:
            return jsonify({"error": "No curriculum markdown files found to process."}), 400

       # --- DYNAMIC CONTEXT COMPILATION ENGINE ---
        compiled_insights_log = []
        
        for file in available_files:
            file_path = os.path.join(syllabi_dir, file)
            domain_name = None
            
            # Dynamically parse the 'course:' variable from the YAML front matter
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("course:"):
                            # Extract everything after "course:" and strip spaces/quotes
                            domain_name = line.split(":", 1)[1].strip().strip("'\"")
                            break
            except Exception as parse_err:
                print(f"Non-blocking front-matter parse error on {file}: {parse_err}")
            
            # Fallback layout protection if the file format doesn't have a 'course:' header
            if not domain_name:
                filename_clean = file.replace(".md", "")
                # Automatically split PascalCase/camelCase (e.g., "SystemDesign" -> "System Design")
                import re
                domain_name = re.sub(r'(?<!^)(?=[A-Z])', ' ', filename_clean).strip()
                
                # Fast shorthand handler for unparsed legacy filenames
                acronyms = {"DSA": "Data Structures & Algorithms", "DBMS": "Database Management Systems", "OS": "Operating Systems"}
                domain_name = acronyms.get(filename_clean, domain_name)

            # Match against MongoDB history profile fields
            if domain_name in profile_subject_insights:
                score_percentage = profile_subject_insights[domain_name]
                compiled_insights_log.append(f"- {file} ({domain_name}): Current Proficiency is {score_percentage}")
            else:
                # Direct Injection if a track file is present but has zero historical analytics data
                compiled_insights_log.append(f"- {file} ({domain_name}): 0% (CRITICAL: Uncharted file track. Not yet tested!)")
        
        # Flatten into a clean string to push inside the LLM prompt template
        formatted_insights_context = "\n".join(compiled_insights_log)

        # 3. LLM CALL 1: Route Selection with Percentage-Aware Matrix
        router_template = load_prompt_file("topic_router.txt")
        router_prompt = router_template.format(
            available_files=available_files,
            last_completed_topic=last_completed_topic,
            historical_weaknesses=historical_weaknesses,
            subject_insights_metrics=formatted_insights_context  # Matches your prompt's new placeholder
        )
        
        router_response = ai_client.models.generate_content(
            model=os.getenv("GEMINI_MODEL"),
            contents=router_prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        routing_decision = json.loads(router_response.text)
        chosen_files = routing_decision.get("chosen_files", [])
        target_topics = routing_decision.get("target_topics", [])

        if not chosen_files or not target_topics:
            return jsonify({"error": "Router returned empty files or topics arrays"}), 400
        time.sleep(2.5)  # Rate limit spacer

        # 4. Fetch Syllabus Content
        raw_syllabus_text = ""
        for chosen_file in chosen_files:
            syllabus_data = get_raw_syllabus(chosen_file)
            raw_syllabus_text += syllabus_data["content"] + "\n"

        # Convert target_topics array into a descriptive string context for downstream templates
        topics_summary_string = ", ".join(target_topics)

        # 5. LLM CALL 2: Search Query Optimization
        search_crafter_template = load_prompt_file("search_crafter.txt")
        search_crafter_prompt = search_crafter_template.format(
            target_topic=topics_summary_string,
            historical_weaknesses=historical_weaknesses
        )
        
        crafter_response = ai_client.models.generate_content(
            model=os.getenv("GEMINI_MODEL"),
            contents=search_crafter_prompt
        )
        optimized_query = crafter_response.text.strip()

        # 6. Search Intelligence Lookup
        search_insights = "No live trends retrieved."
        try:
            research_results = research_on_topic(optimized_query)
            search_insights = json.dumps(research_results.get("insights", []))
        except Exception as search_err:
            print(f"Non-blocking search bypass: {search_err}")

        time.sleep(2.5)  # Rate limit spacer

        # 7. LLM CALL 3: Quiz Construction
        quiz_builder_template = load_prompt_file("quiz_builder.txt")
        quiz_prompt = quiz_builder_template.format(
            raw_syllabus_text=raw_syllabus_text,
            target_topic=topics_summary_string,
            historical_strengths=historical_strengths,
            historical_weaknesses=historical_weaknesses,
            search_insights=search_insights
        )

        quiz_response = ai_client.models.generate_content(
            model=os.getenv("GEMINI_MODEL"),
            contents=quiz_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.3
            )
        )
        generated_quiz_array = json.loads(quiz_response.text)

        # 8. Log State to "todays_quiz" with verification tag
        db["todays_quiz"].drop()  # Flush out yesterday's run entirely
        
        todays_quiz_doc = {
            "completed": False,  
            "topic": topics_summary_string,
            "target_topics": target_topics,
            "file_used": chosen_files,
            "questions": generated_quiz_array
        }
        db["todays_quiz"].insert_one(todays_quiz_doc)

        return jsonify({
            "status": "success",
            "file_processed": chosen_files,
            "topic": target_topics,
            "quiz": generated_quiz_array
        }), 200

    except Exception as error:
        return jsonify({"error": "Failed to compile adaptive quiz session", "details": str(error)}), 500



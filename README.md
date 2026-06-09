# Engine-0 🚀

> **Engine-0** is an autonomous, context-aware educational orchestration framework that optimizes technical interview readiness through dynamic, multi-subject evaluations.

Inspired by the calculation and positional assessment models of chess engines like *AlphaZero*, **Engine-0** acts as a deep analytical evaluation layer over core computer science tracks. Instead of serving static, repetitive question sets, it tracks real-time user performance metrics, maps conceptual blind spots, and continuously refines a personalized mastery baseline in a decoupled cloud architecture.

---

## 🛠️ Tech Stack & System Architecture

Engine-0 is built using a modern, decoupled full-stack architecture optimized for low-latency delivery and intelligent generation:

* **Frontend Dashboard:** Next.js (React) deployed on **Vercel** utilizing Edge rendering for responsive client-side telemetry tracking.
* **Core Microservice:** Python Flask hosted on **Render**, serving as a type-safe grading engine and orchestrating the AI pipeline.
* **Database Layer:** MongoDB Atlas storing persistent student profile states, time telemetry logs, and open-ended subject mastery metrics.
* **AI Orchestration:** Google Gemini via the modern `google-genai` SDK, configured with a low temperature ($0.2$) for highly predictable, schema-compliant evaluations.

---

## 🧠 Core Agentic Architecture & Features

### 1. Multi-Format Programmatic Grading Router
The Python backend processes 5 distinct types of technical questions with rigorous type-safety guards to prevent runtime evaluation failures:
* **MCQs & Short Answers:** Clean, string-normalized, case-insensitive evaluation.
* **MSQs & Sequencing:** Order-agnostic set evaluations using Python array structures.
* **Matching Components:** Lexicographical dictionary key verification via JSON serialization checking.
* **Long Written Answers:** Dynamically routed directly to the Gemini semantic rubric evaluator for contextual engineering feedback.

### 2. Live Telemetry & Open-Ended Profile Merging
The backend logs question-by-question time telemetry and automatically tracks metrics like accuracy percentages and average speed. When a quiz is submitted, the AI aggregates these logs to update the user's `strengths`, `weaknesses`, and an expanding dictionary of subject proficiency scores without wiping unrelated baseline data:

$$\text{Accuracy (\%)} = \left( \frac{\text{Correct Count}}{\text{Total Questions}} \right) \times 100$$

### 3. Automated Pre-Generation & Keep-Alive Cron Setup
To bypass cold-start delays on Render's free tier, Engine-0 integrates an external cron schedule. The automated pipeline includes a back-off retry loop that captures network timeout codes ($502$, $504$), allowing the environment time to boot and execute pre-generation before the user opens their dashboard.

---

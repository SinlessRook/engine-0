import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Always hit the DB fresh — this reflects live quiz state, never cache it.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Fetching today's quiz answer key from MongoDB...");
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "quizApp");
    const quiz = await db.collection("todays_quiz").findOne({});

    if (!quiz) {
      return NextResponse.json(
        { error: "No quiz session found for today." },
        { status: 404 }
      );
    }

    // Gate: the answer key only activates once the quiz is marked completed.
    if (!quiz.completed) {
      return NextResponse.json(
        {
          error:
            "The answer key unlocks once today's quiz is marked completed.",
          completed: false,
        },
        { status: 423 } // 423 Locked
      );
    }

    return NextResponse.json({
      completed: true,
      topic: quiz.topic ?? "",
      target_topics: quiz.target_topics ?? [],
      file_used: quiz.file_used ?? [],
      questions: quiz.questions ?? [],
    });
  } catch (err) {
    console.error("Answer key fetch failed:", err);
    return NextResponse.json(
      { error: "Could not load the answer key. Try again shortly." },
      { status: 500 }
    );
  }
}
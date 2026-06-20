import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// Always read fresh from Mongo — never cache a quiz response.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "quizApp");
    const collection = db.collection("todays_quiz");

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("id");

    let quiz;

    if (quizId) {
      // Fetch a specific quiz by its Mongo _id.
      if (!ObjectId.isValid(quizId)) {
        return NextResponse.json({ error: "Invalid quiz id" }, { status: 400 });
      }
      quiz = await collection.findOne({ _id: new ObjectId(quizId) });

      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }
    } else {
      // Default: today's active quiz (the single document your Flask
      // /generate endpoint drops and reinserts each run).
      quiz = await collection.findOne({});

      if (!quiz) {
        return NextResponse.json(
          { status: "empty", message: "No quiz available" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
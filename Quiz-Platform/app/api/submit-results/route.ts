import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request format. Missing answers array.' },
        { status: 400 }
      );
    }

    // 🔥 Dynamic payload transformation mapping client answers to type-safe Flask keys
    const transformedAnswers = answers.map((a: any) => {
      // Pull and resolve correct answer options from whatever type shape was populated
      const resolvedCorrectAnswer = 
        a.correct_answer || 
        a.correctOption || 
        a.correctAnswers || 
        a.correct_sequence || 
        a.correct_mapping || 
        a.correct_keyword || 
        "";

      return {
        question: a.question || "",
        type: a.type || "mcq",
        user_selected: a.user_selected || "",
        correct_answer: resolvedCorrectAnswer,
        time_spent_seconds: Number(a.time_spent_seconds) || 0,
      };
    });

    // Match your external backend endpoint route path exactly
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const externalApiUrl = `${baseUrl}/api/quiz/evaluate`;

    // Forward the fully bundled payload directly to your Python Flask microservice
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers: transformedAnswers,
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: 'Evaluation service backend failed.', 
          details: errorDetail.error || errorDetail.details || 'Internal Flask Exception'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Pass the response containing metrics and subject insights back to the client
    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Next.js proxy engine failure.', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
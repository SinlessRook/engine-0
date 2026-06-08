import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!apiBaseUrl) {
      return NextResponse.json(
        { error: 'Backend API URL not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('id');

    if (quizId) {
      // Fetch specific quiz by ID from backend
      const response = await fetch(`${apiBaseUrl}/api/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Quiz not found' },
            { status: 404 }
          );
        }
        throw new Error(`Backend returned status ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fetch today's quiz (default behavior)
    const response = await fetch(`${apiBaseUrl}/api/quiz/fetch`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { status: 'empty', message: 'No quiz available' },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve quiz', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

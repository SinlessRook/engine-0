'use client';

import { useState } from 'react';
import { Quiz } from '@/lib/types';
import { QuestionRenderer } from './QuestionRenderer';
import { ProgressBar } from './ProgressBar';
import { SubmissionConfirmation } from './SubmissionConfirmation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { QuestionExplanation } from './questions/QuestionExplanation';

interface QuizEngineProps {
  quiz: Quiz;
  onBack: () => void;
}

export function QuizEngine({ quiz, onBack }: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<any>(null);

  // Per-question duration telemetry tracking
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeSpentMap, setTimeSpentMap] = useState<Record<string, number>>({});

  // Normalize questions to ensure all text variables map securely
  const normalizedQuestions = quiz.questions.map((q) => ({
    ...q,
    question: q.question || q.questionText || 'Question text not available',
  }));

  const currentQuestion = normalizedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === normalizedQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const canProceed = answers[currentQuestion.id] !== undefined;

  const handleAnswerChange = (answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
    setError(null);
  };

  const trackTimeForCurrentQuestion = () => {
    const now = Date.now();
    const elapsedSeconds = Math.round((now - questionStartTime) / 1000);
    
    setTimeSpentMap((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + elapsedSeconds,
    }));
    
    // Reset the snapshot timer for the incoming screen link
    setQuestionStartTime(now);
  };

  const handleNext = () => {
    if (!canProceed) {
      setError('Please answer this question before proceeding');
      return;
    }
    trackTimeForCurrentQuestion();
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    trackTimeForCurrentQuestion();
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!canProceed) {
      setError('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Commit final active screen seconds before packing telemetry
    const now = Date.now();
    const finalElapsedSeconds = Math.round((now - questionStartTime) / 1000);
    const updatedTimeMap = {
      ...timeSpentMap,
      [currentQuestion.id]: (timeSpentMap[currentQuestion.id] || 0) + finalElapsedSeconds
    };

    try {
      // Build a comprehensive, flat payload for your secure Next.js API Proxy Gate
      const clientAnswersPayload = normalizedQuestions.map((q) => ({
        question: q.question,
        type: q.type || "mcq",
        user_selected: answers[q.id] || "",
        time_spent_seconds: updatedTimeMap[q.id] || 5,
        
        // Pass up all fallback alternatives; the proxy server will distill them down cleanly
        correctOption: q.correctOption,
        correctAnswers: q.correctAnswers,
        correct_sequence: (q as any).correct_sequence,
        correct_mapping: (q as any).correct_mapping,
        correct_keyword: (q as any).correct_keyword,
      }));

      // Fire payload to your local Next.js Edge proxy path
      const response = await fetch('/api/submit-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: clientAnswersPayload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to submit quiz data.');
      }

      const resultData = await response.json();
      setEvaluationFeedback(resultData);
      setSubmitted(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your quiz');
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <SubmissionConfirmation quiz={quiz} feedback={evaluationFeedback} onBack={onBack} />;
  }

  return (
    <>
      <QuestionExplanation
        open={showExplanation}
        onClose={() => setShowExplanation(false)}
        explanation={currentQuestion.explanation}
        rubric={(currentQuestion as any).evaluation_rubric}
      />
      <div className="min-h-screen bg-background flex flex-col relative bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border/40 z-30 transition-all duration-300">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-5">
            <button
              onClick={onBack}
              className="text-muted-foreground hover:text-primary transition-all duration-200 mb-4 flex items-center gap-2 text-sm font-medium group"
            >
              <div className="bg-secondary p-1 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Back to Dashboard
            </button>

            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                { "Adaptive Assessment Track"}
              </h1>
            </div>

            <div className="mt-4">
              <ProgressBar
                current={currentQuestionIndex + 1}
                total={normalizedQuestions.length}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 sm:py-6 relative z-10 flex flex-col">
          <div className="backdrop-blur-md bg-card/60 border border-border/50 rounded-3xl shadow-xl p-5 sm:p-8 flex-1 flex flex-col transition-all duration-500 hover:shadow-primary/5">
            <div
              className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-14 lg:gap-20 animate-in fade-in slide-in-from-bottom-4 duration-500"
              key={currentQuestion.id}
            >
              <div className="space-y-3 md:pr-6">
                <span className="inline-block bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase">
                  Question {currentQuestionIndex + 1} ({currentQuestion.type?.toUpperCase() || 'MCQ'})
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug whitespace-normal break-words">
                  {currentQuestion.question}
                </h2>
                <button
                  onClick={() => setShowExplanation(true)}
                  className="mt-3 text-sm font-medium text-primary hover:underline transition hidden"
                >
                  Show explanation blueprint
                </button>
              </div>

              <div className="flex justify-center items-center md:pl-6">
                <div className="w-full max-w-md">
                  <QuestionRenderer
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onChange={handleAnswerChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-8 bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm font-medium flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Actions */}
        <div className="sticky bottom-0 backdrop-blur-xl bg-background/80 border-t border-border/40 z-30">
          <div className="max-w-3xl mx-auto px-4 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="flex-1 sm:flex-none rounded-xl group transition-all"
              >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Previous
              </Button>

              <div className="hidden sm:block text-sm font-medium py-1 px-3 bg-secondary/50 rounded-full text-muted-foreground border border-border/50">
                {currentQuestionIndex + 1} / {normalizedQuestions.length}
              </div>

              {!isLastQuestion ? (
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`flex-1 sm:flex-none rounded-xl group transition-all duration-300 ${canProceed ? 'shadow-md shadow-primary/20 hover:-translate-y-0.5' : ''}`}
                >
                  Next Step
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className={`flex-1 sm:flex-none rounded-xl group transition-all duration-300 ${canProceed && !isSubmitting ? 'shadow-md shadow-primary/20 hover:-translate-y-0.5 bg-primary text-primary-foreground' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Evaluating Performance...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Submit Assessment
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
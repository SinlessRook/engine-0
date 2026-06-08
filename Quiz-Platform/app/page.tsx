'use client';

import { useState, useEffect } from 'react';
import { Quiz } from '@/lib/types';
import { QuizEngine } from '@/components/quiz/QuizEngine';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Loader, BrainCircuit, Trophy, Target, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error('Failed to fetch quiz');
        
        const data = await response.json();
        
        // Handle different response formats
        let quizData: Quiz | null = null;
        
        if (data.status === 'empty' ) {
          setError(data.message || 'No quiz available');
          setQuiz(null);
        }else if (data.status === 'success' && data.quiz_data.completed==true) {
          setQuiz(null);
        } 
        else if (data.status === 'success' && data.quiz_data) {
          quizData = data.quiz_data;
          setQuiz(quizData);
          setError(null);
        } else if (Array.isArray(data)) {
          // Old format - array of quizzes
          setError('Quiz list format not yet supported. Please use the daily quiz.');
        } else if (data.questions) {
          // Direct quiz object
          setQuiz(data);
          setError(null);
        } else {
          setError('Unexpected response format from server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleStartQuiz = () => {
    if (quiz) {
      setStarted(true);
    }
  };

  const handleBack = () => {
    setStarted(false);
  };

  if (started && quiz) {
    return <QuizEngine quiz={quiz} onBack={handleBack} />;
  }

  // Quiz card component
  const renderQuizCard = () => {
    if (!quiz) return null;

    const questionCount = quiz.questions?.length || 0;
    const title = quiz.title || 'Today\'s Quiz';
    const description = quiz.description || 'Test your knowledge set';
    const topics = quiz.target_topics || quiz.topic || 'General Knowledge';

    return (
      <div className="relative w-full max-w-5xl mx-auto backdrop-blur-md bg-card/80 border border-border/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20 group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-primary/10 rounded-2xl mb-1 text-primary ring-1 ring-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {description}
            </p>
            {topics && (
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {(Array.isArray(topics) ? topics : [topics]).map((topic, idx) => (
                  <span
                    key={idx}
                    className="bg-secondary/50 border border-secondary text-secondary-foreground px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase shadow-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-muted/50 transition-colors">
              <Target className="w-5 h-5 text-primary mb-1.5 opacity-80" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Questions</p>
              <p className="text-3xl font-bold text-foreground">{questionCount}</p>
            </div>
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:bg-muted/50 transition-colors">
              <Trophy className="w-5 h-5 text-primary mb-1.5 opacity-80" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Difficulty</p>
              <p className="text-xl font-bold text-foreground mt-1">Adaptive</p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleStartQuiz}
              disabled={loading || !quiz}
              size="lg"
              className="w-full h-12 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-primary/25 hover:-translate-y-1 group"
            >
              Start Quiz Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] font-sans relative overflow-hidden flex flex-col">
      {/* Decorative background blur objects */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:opacity-20" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:opacity-20" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:opacity-20" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary shadow-md shadow-primary/20 p-1.5 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  QuizMaster
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:py-10 w-full relative z-10 flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <Loader className="w-10 h-10 text-primary animate-spin relative z-10" />
            </div>
            <p className="text-muted-foreground text-sm font-medium animate-pulse">Curating your experience...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/5 backdrop-blur-sm border border-destructive/20 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-xl">
            <div className="bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-destructive mb-2">Connection Issue</h3>
            <p className="text-destructive/80 text-sm font-medium mb-4">{error}</p>
            <p className="text-xs text-muted-foreground mb-6">
              Please ensure your backend services are active and configured correctly.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </div>
        ) : !quiz ? (
          <div className="text-center py-10 max-w-2xl mx-auto backdrop-blur-sm bg-card/30 border border-border/40 rounded-3xl p-8">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No Quizzes Active</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Check back later for new challenges and tests.
            </p>
            <Button variant="secondary" onClick={() => window.location.reload()} className="rounded-xl">
              Check Again
            </Button>
          </div>
        ) : (
          renderQuizCard()
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-md relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-medium">
            © {new Date().getFullYear()} QuizMaster Platform.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span>
              Engineered with <span className="text-foreground font-bold">Next.js</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PartyPopper, Home, Award } from 'lucide-react';

interface SubmissionConfirmationProps {
  quiz: Quiz;
  onBack: () => void;
}

export function SubmissionConfirmation({
  quiz,
  onBack,
}: SubmissionConfirmationProps) {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      
      <div className="max-w-md w-full backdrop-blur-xl bg-card/80 border border-border/50 rounded-3xl shadow-2xl p-8 sm:p-10 text-center space-y-8 relative z-10 transform scale-100 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
          <div className="bg-primary/10 p-5 rounded-full border border-primary/20 shadow-inner relative z-10 group hover:scale-110 transition-transform">
            <Award className="w-16 h-16 text-primary animate-bounce shadow-primary/50" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Quiz Completed!
          </h1>
          <p className="text-muted-foreground font-medium">
            Your answers for <span className="text-foreground font-semibold">&ldquo;{quiz.title}&rdquo;</span> have been successfully submitted.
          </p>
        </div>

        <div className="bg-secondary/40 border border-border/50 rounded-2xl p-5 shadow-sm">
          <PartyPopper className="w-6 h-6 text-primary mx-auto mb-3 opacity-80" />
          <p className="text-sm text-foreground/80 font-medium">
            Your response has been recorded and sent for evaluation. Thank you for participating!
          </p>
        </div>

        <Button
          onClick={onBack}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-primary/25 hover:-translate-y-1 group"
        >
          <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

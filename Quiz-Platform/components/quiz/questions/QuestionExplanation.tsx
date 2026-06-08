'use client';

import { X } from 'lucide-react';

interface QuestionExplanationProps {
  open: boolean;
  onClose: () => void;
  explanation?: string;
  rubric?: string;
}

export function QuestionExplanation({
  open,
  onClose,
  explanation,
  rubric,
}: QuestionExplanationProps) {
  if (!open) return null;

  const content = explanation || rubric;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-background border border-border/50 rounded-2xl shadow-2xl p-5 sm:p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-foreground mb-3">
          Explanation
        </h3>

        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content || 'No explanation available for this question.'}
        </div>
      </div>
    </div>
  );
}
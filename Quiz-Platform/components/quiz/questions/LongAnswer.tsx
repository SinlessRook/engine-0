'use client';

import { Question } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

interface LongAnswerProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function LongAnswer({ question, value = '', onChange }: LongAnswerProps) {
  return (
    <Textarea
      placeholder="Write your detailed answer here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-32 text-base resize-none"
    />
  );
}

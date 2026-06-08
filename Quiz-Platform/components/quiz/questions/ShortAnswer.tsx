'use client';

import { Question } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface ShortAnswerProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ShortAnswer({ question, value = '', onChange }: ShortAnswerProps) {
  return (
    <Input
      type="text"
      placeholder="Enter your answer here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 text-base"
    />
  );
}

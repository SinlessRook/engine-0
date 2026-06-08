'use client';

import { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface TrueFalseProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function TrueFalse({ question, value, onChange }: TrueFalseProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className={`h-16 text-lg font-bold rounded-xl transition-all duration-300 relative overflow-hidden group hover:shadow-md ${
          value === 'true'
            ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
            : 'border-border/60 bg-card/60 hover:border-primary/50 text-foreground'
        }`}
        onClick={() => onChange('true')}
      >
        <span className="relative z-10 flex flex-col items-center gap-1">
          True
        </span>
      </Button>
      <Button
        variant="outline"
        className={`h-16 text-lg font-bold rounded-xl transition-all duration-300 relative overflow-hidden group hover:shadow-md ${
          value === 'false'
            ? 'border-destructive bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 scale-[1.02]'
            : 'border-border/60 bg-card/60 hover:border-destructive/50 text-foreground'
        }`}
        onClick={() => onChange('false')}
      >
        <span className="relative z-10 flex flex-col items-center gap-1">
          False
        </span>
      </Button>
    </div>
  );
}

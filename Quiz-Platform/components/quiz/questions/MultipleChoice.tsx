'use client';

import { Question, Option } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MultipleChoiceProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
}

export function MultipleChoice({ question, value, onChange }: MultipleChoiceProps) {
  if (!question.options) return null;

  return (
    <div className="space-y-2">
      {question.options.map((option: Option) => (
        <Button
          key={option.id}
          variant="outline"
          className={`w-full justify-start h-auto py-2.5 px-4 text-left border rounded-xl transition-all duration-300 relative overflow-hidden group hover:shadow-md hover:border-primary/40 ${
            value === option.text 
              ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10 ring-1 ring-primary/20' 
              : 'border-border/50 bg-card/50'
          }`}
          onClick={() => onChange(option.text)}
        >
          <div className="flex items-center gap-3 w-full relative z-10">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                value === option.text
                  ? 'border-primary bg-primary scale-110'
                  : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
              }`}
            >
              {value === option.text && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-in zoom-in duration-200" />}
            </div>
            <span className={`text-sm sm:text-base whitespace-normal break-words transition-colors duration-200 ${value === option.id ? 'text-primary font-medium' : 'text-foreground'}`}>
              {option.text}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
}

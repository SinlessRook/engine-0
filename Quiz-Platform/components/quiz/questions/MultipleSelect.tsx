'use client';

import { Question, Option } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface MultipleSelectProps {
  question: Question;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function MultipleSelect({ question, value = [], onChange }: MultipleSelectProps) {
  if (!question.options) return null;

  // Type-safe extraction to safely handle both string arrays and object lists
  const getOptionTextValue = (option: Option | string): string => {
    if (typeof option === 'string') return option;
    return option.text || '';
  };

  const toggleOption = (optionText: string) => {
    if (value.includes(optionText)) {
      // Remove text string from selected array selection
      onChange(value.filter((text) => text !== optionText));
    } else {
      // Append text string to selected array selection
      onChange([...value, optionText]);
    }
  };

  return (
    <div className="space-y-3">
      {question.options.map((option: Option | string, index: number) => {
        const optionText = getOptionTextValue(option);
        const uniqueKey = typeof option === 'string' ? `opt-${index}` : option.id || `opt-${index}`;
        const isSelected = value.includes(optionText);

        return (
          <Button
            key={uniqueKey}
            variant={isSelected ? 'default' : 'outline'}
            className="w-full justify-start h-auto py-3 px-4 text-left border border-border/60 transition-all duration-200 hover:bg-accent/40"
            onClick={() => toggleOption(optionText)}
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-border bg-transparent'
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-base font-normal whitespace-normal break-words leading-relaxed text-foreground">
                {optionText}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
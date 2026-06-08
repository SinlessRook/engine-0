'use client';

import { Question } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MatchingProps {
  question: Question;
  value: Record<string, string> | undefined;
  onChange: (value: Record<string, string>) => void;
}

export function Matching({ question, value = {}, onChange }: MatchingProps) {
  // Extract left items cleanly across different backend quiz generation structures
  const leftItems: string[] = 
    question.left_pairs || 
    (question as any).pairs?.map((p: any) => p.left) || 
    [];

  // Extract right items cleanly across different backend quiz generation structures
  const rightItems: string[] = 
    question.right_pairs || 
    Array.from(new Set((question as any).pairs?.map((p: any) => p.right))) || 
    [];

  if (leftItems.length === 0) return null;

  const handleMatchChange = (leftTextStr: string, matchedRightTextStr: string) => {
    onChange({
      ...value,
      [leftTextStr]: matchedRightTextStr, // 🔥 CRITICAL FIX: Use the pure left text as the map key!
    });
  };

  return (
    <div className="space-y-5 w-full">
      {leftItems.map((leftText, index) => {
        const uniqueRowKey = `match-row-${index}`;
        const currentSelectedValue = value[leftText] || '';

        return (
          <div 
            key={uniqueRowKey} 
            className="flex flex-col sm:flex-row sm:items-center gap-4 border border-border/40 p-4 rounded-xl bg-card hover:border-border transition-all duration-200"
          >
            {/* Left Side Term Card */}
            <div className="flex-shrink-0 sm:w-2/5 bg-secondary/60 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground whitespace-normal break-words leading-relaxed">
                {leftText}
              </p>
            </div>

            {/* Right Side Selection Dropdown */}
            <div className="flex-grow sm:w-3/5 relative">
              <Select 
                value={currentSelectedValue} 
                onValueChange={(selectedRightText) => handleMatchChange(leftText, selectedRightText)}
              >
                <SelectTrigger className="w-full py-2 bg-background border-border/70 rounded-lg text-left text-sm">
                  <SelectValue placeholder="Select architectural match..." />
                </SelectTrigger>
                <SelectContent className="max-w-md sm:max-w-xl">
                  {rightItems.map((rightText, rightIdx) => (
                    <SelectItem 
                      key={`right-${rightIdx}`} 
                      value={rightText} 
                      className="whitespace-normal break-words hover:bg-accent cursor-pointer"
                    >
                      <div className="whitespace-normal break-words pr-2 text-sm text-muted-foreground hover:text-foreground">
                        {rightText}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
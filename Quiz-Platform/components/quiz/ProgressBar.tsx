'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <span>Progress Overview</span>
        <span className="text-primary">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-secondary/60 rounded-full h-2.5 overflow-hidden shadow-inner border border-border/50">
        <div
          className="bg-primary h-full transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full opacity-50" />
        </div>
      </div>
    </div>
  );
}

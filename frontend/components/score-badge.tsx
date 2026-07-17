"use client";

import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-green-500 text-white";
    if (s >= 60) return "bg-blue-500 text-white";
    if (s >= 40) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div
      className={cn(
        "flex h-16 w-16 flex-col items-center justify-center rounded-full text-lg font-bold",
        getColor(score)
      )}
    >
      <span className="text-xl">{Math.round(score)}</span>
      <span className="text-[10px] opacity-90">SCORE</span>
    </div>
  );
}

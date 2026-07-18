"use client";

import { useCountUp } from "@/lib/animations";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const { value, ref } = useCountUp(score);

  const dim = size === "lg" ? 96 : size === "sm" ? 56 : 72;
  const stroke = size === "lg" ? 6 : size === "sm" ? 4 : 5;
  const radius = (dim - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;

  const getColor = (s: number) => {
    if (s >= 85) return { ring: "#a78bfa", glow: "rgba(167, 139, 250, 0.6)" };
    if (s >= 70) return { ring: "#60a5fa", glow: "rgba(96, 165, 250, 0.6)" };
    if (s >= 50) return { ring: "#fbbf24", glow: "rgba(251, 191, 36, 0.6)" };
    return { ring: "#f87171", glow: "rgba(248, 113, 113, 0.6)" };
  };

  const colors = getColor(score);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim}
        height={dim}
        className="-rotate-90 absolute inset-0"
        style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
      >
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.25, 0.4, 0.25, 1)",
          }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center">
        <span
          ref={ref}
          className={`font-bold leading-none ${
            size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl"
          }`}
          style={{ color: colors.ring }}
        >
          {value}
        </span>
        <span
          className={`uppercase tracking-wider opacity-60 ${
            size === "lg" ? "text-[10px]" : "text-[8px]"
          }`}
        >
          Match
        </span>
      </div>
    </div>
  );
}

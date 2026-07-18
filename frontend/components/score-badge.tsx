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

  // AI-Native color palette — accessible on white background
  const getColor = (s: number) => {
    if (s >= 85) return { ring: "#7C3AED", glow: "rgba(124, 58, 237, 0.25)", text: "#6D28D9" };
    if (s >= 70) return { ring: "#0891B2", glow: "rgba(8, 145, 178, 0.25)", text: "#0E7490" };
    if (s >= 50) return { ring: "#D97706", glow: "rgba(217, 119, 6, 0.25)", text: "#B45309" };
    return { ring: "#DC2626", glow: "rgba(220, 38, 38, 0.25)", text: "#B91C1C" };
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
        style={{ filter: `drop-shadow(0 0 4px ${colors.glow})` }}
        aria-hidden="true"
      >
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="#ECEEF9"
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
          className={`font-bold leading-none ${size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl"}`}
          style={{ color: colors.text }}
          aria-label={`Match score: ${score} out of 100`}
        >
          {value}
        </span>
        <span
          className={`uppercase tracking-wider text-muted-foreground ${size === "lg" ? "text-[10px]" : "text-[8px]"}`}
        >
          Match
        </span>
      </div>
    </div>
  );
}

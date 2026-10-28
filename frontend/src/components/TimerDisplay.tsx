"use client";

import { LEVELS } from "../lib/config";
import { QuestionLevel } from "../lib/schema";
import { strings } from "../content/strings.id";

interface TimerDisplayProps {
  level: QuestionLevel;
  remainingSeconds: number;
  progress: number; // 1 down to 0
  isUrgent: boolean;
  a11yAnnouncement: string | null;
}

export function TimerDisplay({
  level,
  remainingSeconds,
  progress,
  isUrgent,
  a11yAnnouncement,
}: TimerDisplayProps) {
  const levelConfig = LEVELS[level];
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      {/* Screen reader live region - announced only at 10s, 5s, 0s */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {a11yAnnouncement}
      </div>

      <div
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
          isUrgent
            ? "ring-4 ring-rose-500/50 motion-safe:animate-pulse shadow-lg shadow-rose-950/40"
            : ""
        }`}
      >
        <svg
          className="w-32 h-32 transform -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          {/* Background circle track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated remaining progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={isUrgent ? "#f43f5e" : levelConfig.theme.accent}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-100 ease-linear"
          />
        </svg>

        {/* Center Countdown Numerals */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`tabular-timer text-4xl font-extrabold tracking-tighter leading-none ${
              isUrgent ? "text-rose-400" : "text-white"
            }`}
          >
            {remainingSeconds}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">
            detik
          </span>
        </div>
      </div>

      {isUrgent && (
        <span className="text-xs font-semibold text-rose-400 mt-2 motion-safe:animate-bounce">
          ⚠️ {strings.round.timerUrgent}
        </span>
      )}
    </div>
  );
}


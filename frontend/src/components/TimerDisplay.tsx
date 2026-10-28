"use client";

import { QuestionLevel } from "../lib/schema";
import { strings } from "../content/strings.id";

interface TimerDisplayProps {
  level: QuestionLevel;
  remainingSeconds: number;
  progress: number; // 1 down to 0
  isUrgent: boolean;
  a11yAnnouncement: string | null;
}

const LEVEL_ACCENTS: Record<QuestionLevel, string> = {
  easy: "#00d9c8",
  medium: "#f5a623",
  hard: "#ff2c5a",
};

export function TimerDisplay({
  level,
  remainingSeconds,
  progress,
  isUrgent,
  a11yAnnouncement,
}: TimerDisplayProps) {
  const accentColor = isUrgent ? "#ff2c5a" : LEVEL_ACCENTS[level];
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center relative py-1">
      {/* Screen reader live region - announced only at 10s, 5s, 0s */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {a11yAnnouncement}
      </div>

      <div
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all ${
          isUrgent ? "anim-urgent-glow ring-2 ring-rose-500/80" : ""
        }`}
      >
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          {/* Subtle tick marks */}
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i * 360) / 30;
            const isMajor = i % 5 === 0;
            return (
              <line
                key={i}
                x1="60"
                y1={isMajor ? "6" : "8"}
                x2="60"
                y2="11"
                transform={`rotate(${angle} 60 60)`}
                stroke={isMajor ? "rgba(139, 92, 246, 0.4)" : "rgba(139, 92, 246, 0.15)"}
                strokeWidth={isMajor ? "1.5" : "1"}
              />
            );
          })}

          {/* Background circle track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="6"
            fill="transparent"
          />

          {/* Animated remaining progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={accentColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-100 ease-linear"
            style={{
              filter: `drop-shadow(0 0 6px ${accentColor})`,
            }}
          />
        </svg>

        {/* Center Countdown Numerals */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="tabular-timer text-3xl sm:text-4xl font-extrabold tracking-tighter leading-none"
            style={{
              color: accentColor,
              textShadow: `0 0 12px ${accentColor}`,
            }}
          >
            {remainingSeconds}
          </span>
          <span className="font-pixel text-[7px] uppercase tracking-widest text-slate-400 mt-1">
            DETIK
          </span>
        </div>
      </div>

      {isUrgent && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 mt-2 shadow-[0_0_12px_rgba(255,44,90,0.3)]">
          <svg className="w-3 h-3 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="font-pixel text-[8px] text-rose-300 tracking-wide uppercase">
            {strings.round.timerUrgent}
          </span>
        </div>
      )}
    </div>
  );
}

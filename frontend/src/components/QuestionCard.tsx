"use client";

import { Question } from "../lib/schema";
import { strings } from "../content/strings.id";

interface QuestionCardProps {
  question: Question;
  attempt: 1 | 2;
}

const LEVEL_COLORS = {
  easy: {
    color: "#00d9c8",
    pips: 1,
    label: "MUDAH",
    border: "border-[#00d9c8]/30",
  },
  medium: {
    color: "#f5a623",
    pips: 2,
    label: "SEDANG",
    border: "border-[#f5a623]/30",
  },
  hard: {
    color: "#ff2c5a",
    pips: 3,
    label: "SULIT",
    border: "border-[#ff2c5a]/30",
  },
};

const OPTION_COLORS = ["#ff2c85", "#00d9c8", "#10b981", "#f5a623"];

export function QuestionCard({ question, attempt }: QuestionCardProps) {
  const levelData = LEVEL_COLORS[question.level];
  const isRebound = attempt === 2;

  return (
    <article className={`cyber-card w-full p-4 sm:p-5 flex flex-col gap-3.5 relative overflow-hidden anim-entry ${levelData.border}`}>
      {/* Decorative top-right circuit marks */}
      <div className="absolute top-2.5 right-3 flex items-center gap-2 pointer-events-none opacity-40">
        <span className="font-pixel text-[8px] text-purple-400">+</span>
        <div className="flex items-end gap-[2px] h-2.5">
          <div className="w-[2px] h-1 bg-purple-400" />
          <div className="w-[2px] h-2 bg-purple-400" />
          <div className="w-[2px] h-2.5 bg-purple-400" />
        </div>
      </div>

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
        {/* Difficulty Badge with square pips */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="inline-block w-2 h-2 rounded-[1px]"
                style={{
                  backgroundColor: i < levelData.pips ? levelData.color : "rgba(255, 255, 255, 0.1)",
                  boxShadow: i < levelData.pips ? `0 0 6px ${levelData.color}` : "none",
                }}
              />
            ))}
          </div>
          <span
            className="font-pixel text-[10px] tracking-wider uppercase"
            style={{ color: levelData.color }}
          >
            {levelData.label}
          </span>
        </div>

        {/* Sprint / Rebound Pill with SVG */}
        {isRebound ? (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-pixel text-[8px]">
            <svg className="w-2.5 h-2.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{strings.round.badgeAttempt2}</span>
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded bg-[#130f2c] text-purple-300 border border-purple-800/60 font-pixel text-[8px]">
            {strings.round.badgeAttempt1}
          </span>
        )}
      </div>

      {/* Reader Prompt Note */}
      <div className="flex items-center gap-1.5 text-slate-400">
        <span className="w-1.5 h-1.5 rounded-[1px] bg-cyan-400" aria-hidden="true" />
        <p className="font-pixel text-[8px] text-cyan-300/80 tracking-wide">
          {strings.round.readerGuide}
        </p>
      </div>

      {/* White / High-contrast Question Plate matching physical card design */}
      <div className="cyber-title-plate p-4 sm:p-5 shadow-lg my-0.5">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#0b091a] leading-snug tracking-tight">
          {question.question}
        </h3>
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[9px] font-pixel text-slate-500 uppercase tracking-wider">
          <span>PERTANYAAN RESMI</span>
          <span>IT-S SYSTEM</span>
        </div>
      </div>

      {/* Multiple choice options if present */}
      {question.type === "multiple_choice" && question.options && (
        <div className="flex flex-col gap-2 pt-1 border-t border-purple-900/40">
          <div className="flex items-center gap-1 text-[9px] font-pixel text-purple-300/90 tracking-wide uppercase">
            <span>■</span>
            <span>{strings.round.optionsGuide}</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {question.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const bulletColor = OPTION_COLORS[idx % OPTION_COLORS.length];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0c091f] border border-purple-900/50 text-slate-200 text-xs sm:text-sm font-medium hover:border-purple-700/60 transition-colors"
                >
                  <div
                    className="w-5 h-5 rounded-[2px] flex items-center justify-center font-pixel text-[9px] text-white shrink-0 shadow-sm"
                    style={{
                      backgroundColor: bulletColor,
                      boxShadow: `0 0 6px ${bulletColor}80`,
                    }}
                  >
                    {letter}
                  </div>
                  <span className="leading-snug text-slate-100">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

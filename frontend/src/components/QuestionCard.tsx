"use client";

import { LEVELS } from "../lib/config";
import { Question } from "../lib/schema";
import { strings } from "../content/strings.id";

interface QuestionCardProps {
  question: Question;
  attempt: 1 | 2;
}

export function QuestionCard({ question, attempt }: QuestionCardProps) {
  const levelConfig = LEVELS[question.level];
  const isRebound = attempt === 2;

  return (
    <article className="w-full rounded-2xl bg-[#161b22] border border-slate-700/80 p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm tracking-wider">{levelConfig.stars}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${levelConfig.theme.text}`}>
            {levelConfig.label}
          </span>
        </div>

        {/* Sprint / Rebound Pill */}
        {isRebound ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <span>⚡</span>
            <span>{strings.round.badgeAttempt2}</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {strings.round.badgeAttempt1}
          </span>
        )}
      </div>

      {/* Reader Prompt Note */}
      <p className="text-[11px] font-medium text-slate-400">
        📢 {strings.round.readerGuide}
      </p>

      {/* Large readable question text (arm's length table legible) */}
      <div className="min-h-[80px] flex items-center">
        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight">
          {question.question}
        </h3>
      </div>

      {/* Multiple choice options if present (so reader can read them out loud) */}
      {question.type === "multiple_choice" && question.options && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400">
            {strings.round.optionsGuide}
          </span>
          <div className="grid grid-cols-1 gap-2">
            {question.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm font-medium"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {letter}
                  </span>
                  <span className="leading-tight">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}


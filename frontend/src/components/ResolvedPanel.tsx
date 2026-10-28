"use client";

import { ResolutionResult } from "../lib/round-machine";
import { Question } from "../lib/schema";
import { strings } from "../content/strings.id";

interface ResolvedPanelProps {
  question: Question;
  result: ResolutionResult | null;
  reward: string | null;
  onNextQuestion: () => void;
}

export function ResolvedPanel({
  question,
  result,
  reward,
  onNextQuestion,
}: ResolvedPanelProps) {
  const isSuccess = result === "correct_attempt_1" || result === "correct_rebound";
  const isReboundSuccess = result === "correct_rebound";

  return (
    <div className="w-full flex flex-col gap-3.5 anim-entry">
      {/* Result Status Banner */}
      <div
        className={`cyber-card w-full rounded-xl p-4 sm:p-5 border text-center flex flex-col items-center gap-2 ${
          isSuccess
            ? isReboundSuccess
              ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,166,35,0.2)] bg-[#140e04]"
              : "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-[#04140e]"
            : "border-purple-900/50 shadow-[0_0_20px_rgba(124,58,237,0.15)] bg-[#0c091f]"
        }`}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center my-0.5">
          {isSuccess ? (
            isReboundSuccess ? (
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_12px_#f5a623]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_#10b981]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )
          ) : (
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-[0_0_12px_#ff2c5a]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
        </div>

        <h3 className="font-pixel text-xs sm:text-sm tracking-wide text-white uppercase">
          {isSuccess
            ? isReboundSuccess
              ? strings.resolved.titleReboundCorrect
              : strings.resolved.titleCorrect
            : strings.resolved.titleFailed}
        </h3>
        {!isSuccess && (
          <p className="text-xs text-slate-400">
            {strings.resolved.subtitleFailed}
          </p>
        )}
      </div>

      {/* Physical Reward Card Claim Box (shown if success) */}
      {isSuccess && reward && (
        <div className="cyber-card rounded-xl border border-emerald-500/40 p-4 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col gap-1.5 bg-[#051710]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="8" width="18" height="13" rx="2" />
              <path d="M12 8v13" />
              <path d="M19 12H3" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 4.5-4.5 2.5 2.5 0 0 1 0 5" />
            </svg>
            <span className="font-pixel text-[8px] uppercase tracking-wider">
              {strings.resolved.rewardHeader}
            </span>
          </div>
          <p className="text-sm font-bold text-white leading-snug">
            {reward}
          </p>
        </div>
      )}

      {/* Official Answer & Optional Note */}
      <div className="cyber-card rounded-xl border border-purple-900/40 p-4 space-y-2 bg-[#0d0922]">
        <div>
          <span className="font-pixel text-[8px] uppercase tracking-wider text-slate-400 block mb-1">
            {strings.resolved.correctAnswerWas}
          </span>
          <p className="text-base font-bold text-white">
            {question.answer}
          </p>
        </div>

        {question.note && (
          <div className="pt-2 border-t border-purple-900/40">
            <div className="flex items-center gap-1.5 mb-1 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-cyan-400" aria-hidden="true" />
              <span className="font-pixel text-[8px] uppercase tracking-wider">
                {strings.resolved.explanationLabel}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {question.note}
            </p>
          </div>
        )}
      </div>

      {/* Next Question CTA */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onNextQuestion}
          className="cyber-btn w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-purple-700 hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-purple-400/40 flex items-center justify-center gap-2"
        >
          <span className="font-pixel text-[10px] tracking-wider uppercase">
            {strings.resolved.nextQuestionBtn}
          </span>
          <svg className="w-3.5 h-3.5 text-purple-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

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
    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Result Status Banner */}
      <div
        className={`w-full rounded-2xl p-5 border text-center flex flex-col items-center gap-2 shadow-xl ${
          isSuccess
            ? isReboundSuccess
              ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
              : "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
            : "bg-slate-900 border-slate-700/80 text-slate-300"
        }`}
      >
        <div className="text-3xl">
          {isSuccess ? (isReboundSuccess ? "⚡" : "🎉") : "❌"}
        </div>
        <h3 className="text-xl font-extrabold text-white">
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
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/50 to-teal-950/40 border border-emerald-500/40 p-4 shadow-lg flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            🎁 {strings.resolved.rewardHeader}
          </span>
          <p className="text-base font-bold text-white leading-snug">
            {reward}
          </p>
        </div>
      )}

      {/* Learning Box: Official Answer & Optional Note */}
      <div className="rounded-2xl bg-[#161b22] border border-slate-700/80 p-4 space-y-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {strings.resolved.correctAnswerWas}
          </span>
          <p className="text-base font-bold text-white mt-0.5">
            {question.answer}
          </p>
        </div>

        {question.note && (
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-cyan-400 block mb-0.5">
              💡 {strings.resolved.explanationLabel}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {question.note}
            </p>
          </div>
        )}
      </div>

      {/* Next Question CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNextQuestion}
          className="w-full min-h-[54px] py-4 px-6 rounded-2xl font-bold text-base text-white bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] transition-all shadow-xl shadow-cyan-950/40 border border-cyan-400/30 flex items-center justify-center gap-2"
        >
          <span>{strings.resolved.nextQuestionBtn}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}


"use client";

import { strings } from "../content/strings.id";

interface JudgePanelProps {
  answer: string;
  onJudge: (correct: boolean) => void;
}

export function JudgePanel({ answer, onJudge }: JudgePanelProps) {
  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Official Answer Box */}
      <div className="rounded-2xl bg-cyan-950/30 border border-cyan-500/40 p-4 shadow-lg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
          {strings.revealed.answerHeader}
        </span>
        <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
          {answer}
        </p>
      </div>

      <div className="text-center space-y-1">
        <h4 className="text-sm font-bold text-slate-200">
          {strings.revealed.judgeTitle}
        </h4>
        <p className="text-[11px] text-slate-400">
          {strings.revealed.judgeHint}
        </p>
      </div>

      {/* Benar / Salah Action Dock */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => onJudge(false)}
          className="min-h-[56px] py-3.5 px-4 rounded-2xl font-bold text-base text-white bg-rose-600/90 hover:bg-rose-500 active:scale-[0.98] transition-all border border-rose-500/40 shadow-lg shadow-rose-950/30 flex items-center justify-center gap-2"
        >
          <span className="text-lg">❌</span>
          <span>{strings.revealed.btnWrong}</span>
        </button>

        <button
          type="button"
          onClick={() => onJudge(true)}
          className="min-h-[56px] py-3.5 px-4 rounded-2xl font-bold text-base text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all border border-emerald-400/40 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2"
        >
          <span className="text-lg">✅</span>
          <span>{strings.revealed.btnCorrect}</span>
        </button>
      </div>
    </div>
  );
}


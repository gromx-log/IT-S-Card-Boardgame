"use client";

import { strings } from "../content/strings.id";

interface JudgePanelProps {
  answer: string;
  onJudge: (correct: boolean) => void;
}

export function JudgePanel({ answer, onJudge }: JudgePanelProps) {
  return (
    <div className="w-full flex flex-col gap-3.5 anim-entry">
      {/* Official Answer Box */}
      <div className="cyber-card p-4 rounded-xl border border-cyan-500/40 shadow-[0_0_20px_rgba(0,217,200,0.15)] bg-[#0d0922]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-cyan-400" aria-hidden="true" />
          <span className="font-pixel text-[8px] uppercase tracking-wider text-cyan-400">
            {strings.revealed.answerHeader}
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
          {answer}
        </p>
      </div>

      <div className="text-center space-y-1">
        <h4 className="font-pixel text-xs tracking-wider text-slate-200 uppercase">
          {strings.revealed.judgeTitle}
        </h4>
        <p className="text-xs text-slate-400">
          {strings.revealed.judgeHint}
        </p>
      </div>

      {/* Benar / Salah Action Dock with clean SVGs */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => onJudge(false)}
          className="cyber-btn min-h-[52px] py-3 px-4 rounded-xl font-bold text-white bg-rose-600/90 hover:bg-rose-500 transition-all border border-rose-400/50 shadow-[0_0_15px_rgba(255,44,90,0.3)] flex items-center justify-center gap-2"
        >
          {/* Cross SVG icon */}
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="font-pixel text-[10px] tracking-wider uppercase">
            {strings.revealed.btnWrong}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onJudge(true)}
          className="cyber-btn min-h-[52px] py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
        >
          {/* Checkmark SVG icon */}
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-pixel text-[10px] tracking-wider uppercase">
            {strings.revealed.btnCorrect}
          </span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { strings } from "../content/strings.id";

interface ReboundPanelProps {
  onStartRebound: () => void;
  onSkipRebound: () => void;
}

export function ReboundPanel({
  onStartRebound,
  onSkipRebound,
}: ReboundPanelProps) {
  return (
    <div className="cyber-card w-full p-4 sm:p-5 rounded-xl border border-amber-500/40 shadow-[0_0_25px_rgba(245,166,35,0.2)] anim-entry flex flex-col gap-3.5">
      {/* Title & Banner */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div>
          <h3 className="font-pixel text-xs sm:text-sm text-white tracking-wide uppercase">
            {strings.rebound.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {strings.rebound.description}
          </p>
        </div>
      </div>

      {/* Rules Notice Box with cyber square pips */}
      <div className="rounded-lg bg-[#0b081e] border border-purple-900/40 p-3 space-y-2 text-xs">
        <div className="flex items-start gap-2 leading-relaxed">
          <span className="w-2 h-2 rounded-[1px] bg-amber-400 shrink-0 mt-1 shadow-[0_0_6px_#f5a623]" />
          <p className="text-amber-200/90 font-medium">
            {strings.rebound.serverDownWarning}
          </p>
        </div>
        <div className="flex items-start gap-2 leading-relaxed">
          <span className="w-2 h-2 rounded-[1px] bg-cyan-400 shrink-0 mt-1 shadow-[0_0_6px_#00d9c8]" />
          <p className="text-slate-300">
            {strings.rebound.turnNote}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={onStartRebound}
          className="cyber-btn w-full min-h-[50px] py-3 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all border border-amber-400/50 shadow-[0_0_15px_rgba(245,166,35,0.3)] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-amber-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className="font-pixel text-[10px] tracking-wider uppercase">
            {strings.rebound.startBtn}
          </span>
        </button>

        <button
          type="button"
          onClick={onSkipRebound}
          className="cyber-btn w-full min-h-[44px] py-2.5 px-4 rounded-xl font-pixel text-[8px] tracking-wide text-slate-300 hover:text-white bg-[#100d28] hover:bg-[#151135] transition-all border border-purple-900/60 uppercase"
        >
          {strings.rebound.skipBtn}
        </button>
      </div>
    </div>
  );
}

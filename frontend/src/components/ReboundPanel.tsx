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
    <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-[#161b22] border border-amber-500/40 shadow-xl animate-in fade-in duration-200">
      {/* Title & Banner */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shrink-0">
          ⚡
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {strings.rebound.title}
          </h3>
          <p className="text-xs text-slate-300">
            {strings.rebound.description}
          </p>
        </div>
      </div>

      {/* Rules Notice Box */}
      <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-3 space-y-2 text-xs">
        <p className="text-amber-300 font-semibold flex items-start gap-1.5 leading-relaxed">
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span>{strings.rebound.serverDownWarning}</span>
        </p>
        <p className="text-slate-400 flex items-start gap-1.5 leading-relaxed">
          <span className="shrink-0 mt-0.5">💡</span>
          <span>{strings.rebound.turnNote}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={onStartRebound}
          className="w-full min-h-[54px] py-3.5 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500 active:scale-[0.98] transition-all border border-amber-400/40 shadow-lg shadow-amber-950/30 flex items-center justify-center gap-2 text-base"
        >
          <span>⚡</span>
          <span>{strings.rebound.startBtn}</span>
        </button>

        <button
          type="button"
          onClick={onSkipRebound}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all border border-slate-700 text-sm"
        >
          {strings.rebound.skipBtn}
        </button>
      </div>
    </div>
  );
}


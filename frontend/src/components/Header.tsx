"use client";

import { strings } from "../content/strings.id";

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRequestReset: () => void;
  showReaderNotice?: boolean;
}

export function Header({
  soundEnabled,
  onToggleSound,
  onRequestReset,
  showReaderNotice = true,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-slate-800 bg-[#0d1117]/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-sm shadow-cyan-500/20 text-sm tracking-tight border border-cyan-400/30">
            IT
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>{strings.app.title}</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                Sprint
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {strings.app.subtitle}
            </p>
          </div>
        </div>

        {/* Top Controls: Sound toggle & Reset decks */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? strings.settings.soundOn : strings.settings.soundOff}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 active:scale-95 transition-all text-xs flex items-center gap-1"
            title={soundEnabled ? strings.settings.soundOn : strings.settings.soundOff}
          >
            {soundEnabled ? (
              <span className="text-sm" aria-hidden="true">🔊</span>
            ) : (
              <span className="text-sm opacity-60" aria-hidden="true">🔇</span>
            )}
          </button>

          <button
            type="button"
            onClick={onRequestReset}
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 active:scale-95 transition-all text-xs font-medium flex items-center gap-1"
            title="Reset tumpukan kartu"
          >
            <span aria-hidden="true">🔄</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Reader guidance banner */}
      {showReaderNotice && (
        <div className="bg-cyan-950/40 border-t border-cyan-800/30 px-4 py-1.5 text-center">
          <p className="text-[11px] text-cyan-200/90 font-medium">
            📱 {strings.app.readerBanner}
          </p>
        </div>
      )}
    </header>
  );
}


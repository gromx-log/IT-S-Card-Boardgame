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
    <header className="w-full border-b border-purple-900/40 bg-[#06040e]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand identity matching the physical card's top-left badge */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#e0000b] border border-red-400/50 rounded px-2 py-1 shadow-[0_0_12px_rgba(224,0,11,0.5)] flex items-center justify-center">
            <span className="font-pixel text-[11px] text-white tracking-wider">IT-S</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[9px] text-slate-100 tracking-wide uppercase">
                {strings.app.title}
              </span>
              <span className="font-pixel text-[7px] text-cyan-400 px-1 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                SPRINT
              </span>
            </div>
            <span className="font-pixel text-[6px] text-purple-400/80 tracking-widest uppercase mt-0.5">
              IT-S CARD SYSTEM
            </span>
          </div>
        </div>

        {/* Top Controls: Sound toggle & Reset decks with inline SVGs */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? strings.settings.soundOn : strings.settings.soundOff}
            className="w-8 h-8 rounded-lg bg-[#120d2b] border border-purple-500/30 hover:border-purple-400/60 active:scale-95 transition-all flex items-center justify-center text-slate-300 hover:text-white"
            title={soundEnabled ? strings.settings.soundOn : strings.settings.soundOff}
          >
            {soundEnabled ? (
              <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          {/* Reset Decks Button */}
          <button
            type="button"
            onClick={onRequestReset}
            className="h-8 px-2.5 rounded-lg bg-[#120d2b] border border-purple-500/30 hover:border-purple-400/60 active:scale-95 transition-all text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
            title="Reset tumpukan kartu"
          >
            <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
            <span className="font-pixel text-[8px] tracking-wide">RESET</span>
          </button>
        </div>
      </div>

      {/* Reader guidance banner */}
      {showReaderNotice && (
        <div className="bg-[#120d2b]/80 border-t border-purple-900/30 px-4 py-1.5 text-center flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
          <p className="font-pixel text-[8px] text-cyan-300/90 tracking-wide">
            {strings.app.readerBanner}
          </p>
        </div>
      )}
    </header>
  );
}

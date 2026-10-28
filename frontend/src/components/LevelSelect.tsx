"use client";

import { useMemo } from "react";
import { LEVELS } from "../lib/config";
import { getDeckStats } from "../lib/deck";
import { QuestionLevel } from "../lib/schema";
import { strings } from "../content/strings.id";

interface LevelSelectProps {
  onSelectLevel: (level: QuestionLevel) => void;
  resetSignal?: number;
}

const LEVEL_THEMES = {
  easy: {
    color: "#00d9c8",
    pips: 1,
    glow: "rgba(0, 217, 200, 0.25)",
    border: "border-[#00d9c8]/40 hover:border-[#00d9c8]",
    tagBg: "bg-[#00d9c8]/10 text-[#00d9c8] border-[#00d9c8]/30",
  },
  medium: {
    color: "#f5a623",
    pips: 2,
    glow: "rgba(245, 166, 35, 0.25)",
    border: "border-[#f5a623]/40 hover:border-[#f5a623]",
    tagBg: "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/30",
  },
  hard: {
    color: "#ff2c5a",
    pips: 3,
    glow: "rgba(255, 44, 90, 0.25)",
    border: "border-[#ff2c5a]/40 hover:border-[#ff2c5a]",
    tagBg: "bg-[#ff2c5a]/10 text-[#ff2c5a] border-[#ff2c5a]/30",
  },
};

export function LevelSelect({ onSelectLevel, resetSignal = 0 }: LevelSelectProps) {
  const stats = useMemo(() => {
    void resetSignal;
    return {
      easy: getDeckStats("easy"),
      medium: getDeckStats("medium"),
      hard: getDeckStats("hard"),
    };
  }, [resetSignal]);

  const levelKeys: QuestionLevel[] = ["easy", "medium", "hard"];

  return (
    <section className="flex flex-col gap-4 w-full anim-entry">
      <div className="text-center space-y-1 py-1">
        <h2 className="font-pixel text-sm sm:text-base tracking-wide text-white uppercase">
          {strings.select.heading}
        </h2>
        <p className="text-xs text-slate-400">
          {strings.select.subheading}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {levelKeys.map((lvl) => {
          const config = LEVELS[lvl];
          const stat = stats[lvl];
          const theme = LEVEL_THEMES[lvl];
          const isExhausted = stat.remaining === 0;

          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onSelectLevel(lvl)}
              className={`cyber-card cyber-btn w-full text-left p-4 rounded-xl border transition-all active:scale-[0.98] relative overflow-hidden group ${theme.border}`}
              style={{
                boxShadow: `0 4px 20px -4px ${theme.glow}`,
              }}
            >
              {/* Circuit header area with micro crosshairs & equalizer bars */}
              <div className="absolute top-2 right-3 flex items-center gap-2 pointer-events-none opacity-40">
                <span className="font-pixel text-[8px] text-purple-400">+</span>
                {/* Micro signal/equalizer bars */}
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[2px] h-1.5 bg-purple-400" />
                  <div className="w-[2px] h-2.5 bg-purple-400" />
                  <div className="w-[2px] h-3 bg-purple-400" />
                  <div className="w-[2px] h-2 bg-purple-400" />
                </div>
              </div>

              {/* Header row with Pixel Pips, Label & Cards Remaining */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Square pixel pips */}
                  <div className="flex items-center gap-1" aria-label={`${theme.pips} star rating`}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        className={`inline-block w-2.5 h-2.5 rounded-[2px] ${
                          i < theme.pips
                            ? "shadow-[0_0_8px_currentColor]"
                            : "opacity-20 bg-slate-700"
                        }`}
                        style={{
                          backgroundColor: i < theme.pips ? theme.color : undefined,
                          color: theme.color,
                        }}
                      />
                    ))}
                  </div>

                  <span
                    className="font-pixel text-xs sm:text-sm tracking-wider uppercase"
                    style={{ color: theme.color }}
                  >
                    {config.label}
                  </span>
                </div>

                <span className="font-pixel text-[8px] px-2 py-0.5 rounded bg-[#0b081e] text-slate-300 border border-purple-900/50">
                  {isExhausted ? "RE-SHUFFLE" : `${stat.remaining} KARTU`}
                </span>
              </div>

              {/* Sub description */}
              <p className="text-xs text-slate-300/80 mb-3 leading-relaxed">
                {config.description}
              </p>

              {/* Reward preview banner with cyber styling */}
              <div className="rounded-lg p-2.5 flex items-center justify-between text-xs bg-[#090717]/90 border border-purple-900/40">
                <div className="flex items-center gap-2">
                  {/* Cyber gift / card package SVG */}
                  <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="8" width="18" height="13" rx="2" />
                    <path d="M12 8v13" />
                    <path d="M19 12H3" />
                    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 4.5-4.5 2.5 2.5 0 0 1 0 5" />
                  </svg>
                  <span className="font-medium text-slate-200 text-[11px]">{config.reward}</span>
                </div>

                <div className="flex items-center gap-1 font-pixel text-[8px] text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>PILIH</span>
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

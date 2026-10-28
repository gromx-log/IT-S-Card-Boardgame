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

export function LevelSelect({ onSelectLevel, resetSignal = 0 }: LevelSelectProps) {
  const stats = useMemo(() => {
    // Read fresh deck stats whenever resetSignal changes
    void resetSignal;
    return {
      easy: getDeckStats("easy"),
      medium: getDeckStats("medium"),
      hard: getDeckStats("hard"),
    };
  }, [resetSignal]);

  const levelKeys: QuestionLevel[] = ["easy", "medium", "hard"];

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white">
          {strings.select.heading}
        </h2>
        <p className="text-xs text-slate-400">
          {strings.select.subheading}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {levelKeys.map((lvl) => {
          const config = LEVELS[lvl];
          const stat = stats[lvl];
          const isExhausted = stat.remaining === 0;

          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onSelectLevel(lvl)}
              className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] relative overflow-hidden bg-[#161b22] hover:bg-[#1c222b] ${config.theme.border} group`}
            >
              {/* Header row with Stars, Label & Cards Remaining */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base tracking-widest">{config.stars}</span>
                  <span className={`text-base font-bold ${config.theme.text}`}>
                    {config.label}
                  </span>
                </div>

                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {isExhausted ? "Akan dikocok" : `${stat.remaining} kartu`}
                </span>
              </div>

              {/* Sub description */}
              <p className="text-xs text-slate-400 mb-3">
                {config.description}
              </p>

              {/* Reward preview banner */}
              <div className={`rounded-xl p-2.5 flex items-center justify-between text-xs border ${config.theme.badgeBg} ${config.theme.badgeText}`}>
                <div className="flex items-center gap-1.5 font-medium">
                  <span>🎁</span>
                  <span>{config.reward}</span>
                </div>
                <span className="text-xs font-bold text-white group-hover:translate-x-0.5 transition-transform">
                  Pilih →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

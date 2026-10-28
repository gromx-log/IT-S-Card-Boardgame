"use client";

import { useEffect, useRef, useState } from "react";
import { strings } from "../content/strings.id";

interface RevealPanelProps {
  disabled: boolean;
  onReveal: () => void;
}

export function RevealPanel({ disabled, onReveal }: RevealPanelProps) {
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const HOLD_DURATION_MS = 250; // Quick 250ms hold prevents accidental taps while feeling instantaneous

  function startHold() {
    if (disabled) return;
    setHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);

      if (elapsed >= HOLD_DURATION_MS) {
        cleanHold();
        onReveal();
      }
    }, 20);
  }

  function cleanHold() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHolding(false);
    setHoldProgress(0);
  }

  useEffect(() => {
    return () => cleanHold();
  }, []);

  return (
    <div className="w-full pt-2 flex flex-col gap-2">
      <div className="text-center">
        <p className="text-[11px] text-slate-400">
          {strings.round.revealPrompt}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onPointerDown={startHold}
        onPointerUp={cleanHold}
        onPointerLeave={cleanHold}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (!disabled) onReveal();
          }
        }}
        className={`w-full min-h-[56px] py-4 px-6 rounded-2xl font-bold text-base transition-all relative overflow-hidden select-none active:scale-[0.98] ${
          disabled
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-950/40 border border-cyan-400/40"
        }`}
      >
        {/* Hold progress bar fill */}
        {holding && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-white/25 transition-all ease-linear"
            style={{ width: `${holdProgress}%` }}
          />
        )}

        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="text-lg">👁️</span>
          <span>{holding ? strings.round.revealHolding : strings.round.revealButton}</span>
        </div>
      </button>
    </div>
  );
}


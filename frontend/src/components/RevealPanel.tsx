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
  const HOLD_DURATION_MS = 250; // Quick 250ms hold prevents accidental taps

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
    <div className="w-full pt-1 flex flex-col gap-2">
      <div className="text-center">
        <p className="font-pixel text-[8px] text-slate-400 tracking-wide uppercase">
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
        className={`cyber-btn w-full min-h-[52px] py-3.5 px-6 rounded-xl font-bold text-sm transition-all relative overflow-hidden select-none ${
          disabled
            ? "bg-[#100d24] text-slate-600 cursor-not-allowed border border-purple-950"
            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(0,217,200,0.3)] border border-cyan-400/50"
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
          {/* Eye SVG icon */}
          <svg className="w-4 h-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="font-pixel text-[10px] tracking-wider uppercase">
            {holding ? strings.round.revealHolding : strings.round.revealButton}
          </span>
        </div>
      </button>
    </div>
  );
}

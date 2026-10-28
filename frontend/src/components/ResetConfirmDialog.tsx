"use client";

import { useEffect, useRef } from "react";
import { strings } from "../content/strings.id";

interface ResetConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ResetConfirmDialogProps) {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      confirmBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm anim-entry"
    >
      <div className="cyber-card w-full max-w-sm rounded-xl border border-red-500/50 p-6 shadow-[0_0_30px_rgba(224,0,11,0.25)] text-slate-100 flex flex-col gap-4 bg-[#0d0922]">
        <div className="w-11 h-11 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(224,0,11,0.4)]">
          <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <div className="text-center space-y-1.5">
          <h2 id="dialog-title" className="font-pixel text-xs sm:text-sm text-white tracking-wide uppercase">
            {strings.settings.resetDialogTitle}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {strings.settings.resetDialogBody}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="cyber-btn w-full py-3 px-4 rounded-xl font-pixel text-[10px] tracking-wider uppercase text-white bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(224,0,11,0.4)] border border-red-400/50"
          >
            {strings.settings.resetConfirm}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cyber-btn w-full py-2.5 px-4 rounded-xl font-pixel text-[9px] tracking-wider uppercase text-slate-300 hover:text-white bg-[#151032] hover:bg-[#1b1540] active:scale-[0.98] transition-all border border-purple-900/60"
          >
            {strings.settings.resetCancel}
          </button>
        </div>
      </div>
    </div>
  );
}

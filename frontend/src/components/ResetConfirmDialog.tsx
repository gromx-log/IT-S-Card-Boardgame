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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#161b22] border border-slate-700 p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mx-auto">
          ⚠️
        </div>

        <div className="text-center space-y-1.5">
          <h2 id="dialog-title" className="text-lg font-bold text-white">
            {strings.settings.resetDialogTitle}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {strings.settings.resetDialogBody}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition-all shadow-lg shadow-rose-950/30 text-sm"
          >
            {strings.settings.resetConfirm}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all text-sm"
          >
            {strings.settings.resetCancel}
          </button>
        </div>
      </div>
    </div>
  );
}


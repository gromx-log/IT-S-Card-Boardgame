"use client";

import { useEffect, useRef, useState } from "react";
import { soundEffects } from "./audio";
import { releaseWakeLock, requestWakeLock, triggerVibration } from "./device";
import {
  calculateProgress,
  calculateRemainingMs,
  calculateRemainingSeconds,
  isDeadlinePassed,
} from "./timer-math";

export interface UseTimerOptions {
  deadline: number | null;
  totalDurationMs: number;
  isRunning: boolean;
  soundEnabled: boolean;
  onTimeout: () => void;
}

export interface TimerState {
  remainingMs: number;
  remainingSeconds: number;
  progress: number; // 1 -> 0
  isUrgent: boolean; // <= 5 seconds
  a11yAnnouncement: string | null;
}

export function useDeadlineTimer({
  deadline,
  totalDurationMs,
  isRunning,
  soundEnabled,
  onTimeout,
}: UseTimerOptions): TimerState {
  const [now, setNow] = useState(() => Date.now());
  const prevSecondsRef = useRef<number | null>(null);
  const timeoutDispatchedRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Reset timeout dispatch flag whenever a new deadline starts
  useEffect(() => {
    timeoutDispatchedRef.current = false;
    prevSecondsRef.current = null;
  }, [deadline]);

  // Screen Wake Lock lifecycle
  useEffect(() => {
    if (isRunning && deadline !== null) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isRunning, deadline]);

  // Main tick loop and visibilitychange handler
  useEffect(() => {
    if (!isRunning || deadline === null) return;

    function checkTick() {
      const currentNow = Date.now();
      setNow(currentNow);

      if (isDeadlinePassed(deadline!, currentNow)) {
        if (!timeoutDispatchedRef.current) {
          timeoutDispatchedRef.current = true;
          triggerVibration();
          soundEffects.timeout(soundEnabled);
          onTimeoutRef.current();
        }
      }
    }

    // Run tick immediately
    checkTick();

    // 100ms interval for smooth clock
    const interval = window.setInterval(checkTick, 100);

    // Recompute immediately on visibilitychange
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        requestWakeLock();
        checkTick();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning, deadline, soundEnabled]);

  const remainingMs = deadline !== null && isRunning ? calculateRemainingMs(deadline, now) : 0;
  const remainingSeconds = deadline !== null && isRunning ? calculateRemainingSeconds(deadline, now) : 0;
  const progress = deadline !== null && isRunning ? calculateProgress(deadline, totalDurationMs, now) : 0;
  const isUrgent = isRunning && remainingSeconds <= 5 && remainingSeconds > 0;

  // Sound tick in last 5 seconds
  useEffect(() => {
    if (!isRunning || deadline === null) return;

    if (prevSecondsRef.current !== remainingSeconds) {
      if (remainingSeconds <= 5 && remainingSeconds > 0) {
        soundEffects.tick(soundEnabled);
      }
      prevSecondsRef.current = remainingSeconds;
    }
  }, [remainingSeconds, isRunning, deadline, soundEnabled]);

  // A11y announcement computed directly for 10s, 5s, 0s
  const a11yAnnouncement =
    isRunning && (remainingSeconds === 10 || remainingSeconds === 5 || remainingSeconds === 0)
      ? remainingSeconds === 0
        ? "Waktu habis!"
        : `Waktu tersisa ${remainingSeconds} detik`
      : null;

  return {
    remainingMs,
    remainingSeconds,
    progress,
    isUrgent,
    a11yAnnouncement,
  };
}


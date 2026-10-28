// Screen Wake Lock & Vibration wrappers with fallbacks

interface WakeLockSentinelLike {
  release: () => Promise<void>;
  addEventListener?: (type: string, listener: () => void) => void;
}

let activeWakeLock: WakeLockSentinelLike | null = null;

export async function requestWakeLock(): Promise<void> {
  if (typeof window === "undefined" || !("wakeLock" in navigator)) {
    return;
  }
  try {
    const nav = navigator as Navigator & {
      wakeLock?: {
        request: (type: "screen") => Promise<WakeLockSentinelLike>;
      };
    };
    if (nav.wakeLock) {
      activeWakeLock = await nav.wakeLock.request("screen");
    }
  } catch {
    // Wake Lock request failed or not allowed, safely ignore
    activeWakeLock = null;
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (activeWakeLock) {
    try {
      await activeWakeLock.release();
    } catch {
      // Ignore
    } finally {
      activeWakeLock = null;
    }
  }
}

export function triggerVibration(pattern: number | number[] = [120, 80, 180]): void {
  if (typeof window === "undefined" || !("vibrate" in navigator)) {
    return;
  }
  try {
    navigator.vibrate(pattern);
  } catch {
    // Ignore if blocked or unsupported
  }
}


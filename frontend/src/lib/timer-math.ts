/**
 * Pure timer calculation helpers for testability and deadline management.
 */

export function calculateRemainingMs(deadline: number, now: number): number {
  return Math.max(0, deadline - now);
}

export function calculateRemainingSeconds(deadline: number, now: number): number {
  const ms = calculateRemainingMs(deadline, now);
  return Math.ceil(ms / 1000);
}

export function isDeadlinePassed(deadline: number, now: number): boolean {
  return now >= deadline;
}

export function calculateProgress(
  deadline: number,
  totalDurationMs: number,
  now: number
): number {
  if (totalDurationMs <= 0) return 0;
  const remaining = calculateRemainingMs(deadline, now);
  const ratio = remaining / totalDurationMs;
  return Math.min(1, Math.max(0, ratio));
}

export function shouldAnnounceA11y(
  previousSeconds: number | null,
  currentSeconds: number
): boolean {
  if (previousSeconds === currentSeconds) return false;
  return currentSeconds === 10 || currentSeconds === 5 || currentSeconds === 0;
}


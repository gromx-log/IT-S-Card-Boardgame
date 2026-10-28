import { describe, expect, it } from "vitest";
import {
  calculateProgress,
  calculateRemainingMs,
  calculateRemainingSeconds,
  isDeadlinePassed,
  shouldAnnounceA11y,
} from "../src/lib/timer-math";

describe("Timer Math & Deadline Logic", () => {
  const baseTime = 1700000000000;
  const durationMs = 20000; // 20s
  const deadline = baseTime + durationMs;

  it("calculates remaining milliseconds correctly across time increments", () => {
    expect(calculateRemainingMs(deadline, baseTime)).toBe(20000);
    expect(calculateRemainingMs(deadline, baseTime + 5500)).toBe(14500);
    expect(calculateRemainingMs(deadline, baseTime + 19900)).toBe(100);
    expect(calculateRemainingMs(deadline, baseTime + 20000)).toBe(0);
    // After deadline, clamps to 0
    expect(calculateRemainingMs(deadline, baseTime + 25000)).toBe(0);
  });

  it("calculates remaining seconds (ceiling) so 19.1s shows as 20s, 0.1s shows as 1s", () => {
    expect(calculateRemainingSeconds(deadline, baseTime)).toBe(20);
    expect(calculateRemainingSeconds(deadline, baseTime + 500)).toBe(20);
    expect(calculateRemainingSeconds(deadline, baseTime + 1000)).toBe(19);
    expect(calculateRemainingSeconds(deadline, baseTime + 19100)).toBe(1);
    expect(calculateRemainingSeconds(deadline, baseTime + 19999)).toBe(1);
    expect(calculateRemainingSeconds(deadline, baseTime + 20000)).toBe(0);
    expect(calculateRemainingSeconds(deadline, baseTime + 21000)).toBe(0);
  });

  it("determines if deadline has passed", () => {
    expect(isDeadlinePassed(deadline, baseTime + 19999)).toBe(false);
    expect(isDeadlinePassed(deadline, baseTime + 20000)).toBe(true);
    expect(isDeadlinePassed(deadline, baseTime + 20001)).toBe(true);
  });

  it("calculates progress ratio (1 down to 0) accurately", () => {
    expect(calculateProgress(deadline, durationMs, baseTime)).toBe(1);
    expect(calculateProgress(deadline, durationMs, baseTime + 10000)).toBe(0.5);
    expect(calculateProgress(deadline, durationMs, baseTime + 20000)).toBe(0);
    expect(calculateProgress(deadline, durationMs, baseTime + 25000)).toBe(0);
  });

  it("only triggers a11y announcements at exactly 10s, 5s, and 0s transitions", () => {
    expect(shouldAnnounceA11y(20, 20)).toBe(false);
    expect(shouldAnnounceA11y(20, 19)).toBe(false);
    expect(shouldAnnounceA11y(11, 10)).toBe(true);
    expect(shouldAnnounceA11y(10, 10)).toBe(false);
    expect(shouldAnnounceA11y(10, 9)).toBe(false);
    expect(shouldAnnounceA11y(6, 5)).toBe(true);
    expect(shouldAnnounceA11y(5, 5)).toBe(false);
    expect(shouldAnnounceA11y(5, 4)).toBe(false);
    expect(shouldAnnounceA11y(1, 0)).toBe(true);
    expect(shouldAnnounceA11y(0, 0)).toBe(false);
  });
});


import { describe, expect, it } from "vitest";
import { initialRoundState, roundReducer } from "../src/lib/round-machine";

describe("Round Machine Reducer", () => {
  const baseTime = 1000000;
  const deadline = baseTime + 20000; // 20s

  it("starts in select state", () => {
    expect(initialRoundState.status).toBe("select");
    expect(initialRoundState.attempt).toBe(1);
    expect(initialRoundState.result).toBeNull();
  });

  it("transitions from select to running on START_ROUND", () => {
    const state = roundReducer(initialRoundState, {
      type: "START_ROUND",
      level: "easy",
      questionId: "easy-001",
      deadline,
    });

    expect(state.status).toBe("running");
    expect(state.level).toBe("easy");
    expect(state.questionId).toBe("easy-001");
    expect(state.attempt).toBe(1);
    expect(state.deadline).toBe(deadline);
  });

  describe("Attempt 1 Flow", () => {
    const runningState = roundReducer(initialRoundState, {
      type: "START_ROUND",
      level: "medium",
      questionId: "medium-005",
      deadline,
    });

    it("reveals within deadline and transitions to revealed", () => {
      const revealed = roundReducer(runningState, {
        type: "REVEAL",
        now: baseTime + 5000, // 5s elapsed, 15s left
      });

      expect(revealed.status).toBe("revealed");
      expect(revealed.remainingMs).toBe(15000);
    });

    it("prevents late reveal after deadline and treats as timeout -> rebound_offer", () => {
      const lateReveal = roundReducer(runningState, {
        type: "REVEAL",
        now: deadline + 1000, // 1s past deadline
      });

      expect(lateReveal.status).toBe("rebound_offer");
      expect(lateReveal.remainingMs).toBe(0);
    });

    it("transitions directly to rebound_offer on TIMEOUT", () => {
      const timedOut = roundReducer(runningState, { type: "TIMEOUT" });
      expect(timedOut.status).toBe("rebound_offer");
      expect(timedOut.attempt).toBe(1);
    });

    it("resolves with reward when judged Benar (correct)", () => {
      const revealed = roundReducer(runningState, {
        type: "REVEAL",
        now: baseTime + 10000,
      });

      const correct = roundReducer(revealed, {
        type: "JUDGE",
        correct: true,
      });

      expect(correct.status).toBe("resolved");
      expect(correct.result).toBe("correct_attempt_1");
      expect(correct.reward).toBe("1 kartu bebas (Profesi atau Aksi)");
    });

    it("transitions to rebound_offer when judged Salah (wrong)", () => {
      const revealed = roundReducer(runningState, {
        type: "REVEAL",
        now: baseTime + 10000,
      });

      const wrong = roundReducer(revealed, {
        type: "JUDGE",
        correct: false,
      });

      expect(wrong.status).toBe("rebound_offer");
      expect(wrong.result).toBeNull();
      expect(wrong.reward).toBeNull();
    });
  });

  describe("Rebound Flow (Attempt 2)", () => {
    const reboundOfferState = {
      status: "rebound_offer" as const,
      level: "hard" as const,
      questionId: "hard-003",
      attempt: 1 as const,
      deadline: null,
      remainingMs: null,
      result: null,
      reward: null,
    };

    it("skips rebound and resolves with no reward", () => {
      const skipped = roundReducer(reboundOfferState, {
        type: "SKIP_REBOUND",
      });

      expect(skipped.status).toBe("resolved");
      expect(skipped.result).toBe("skipped_rebound");
      expect(skipped.reward).toBeNull();
    });

    it("starts rebound attempt 2 with fresh deadline and same question", () => {
      const newDeadline = baseTime + 40000;
      const attempt2 = roundReducer(reboundOfferState, {
        type: "START_REBOUND",
        deadline: newDeadline,
      });

      expect(attempt2.status).toBe("running");
      expect(attempt2.attempt).toBe(2);
      expect(attempt2.questionId).toBe("hard-003");
      expect(attempt2.level).toBe("hard");
      expect(attempt2.deadline).toBe(newDeadline);
    });

    it("rebound attempt 2 judged Benar grants full reward for difficulty", () => {
      const attempt2Running = roundReducer(reboundOfferState, {
        type: "START_REBOUND",
        deadline: baseTime + 20000,
      });

      const revealed = roundReducer(attempt2Running, {
        type: "REVEAL",
        now: baseTime + 8000,
      });

      const resolved = roundReducer(revealed, {
        type: "JUDGE",
        correct: true,
      });

      expect(resolved.status).toBe("resolved");
      expect(resolved.result).toBe("correct_rebound");
      expect(resolved.reward).toBe("2 kartu bebas (Profesi dan/atau Aksi)");
    });

    it("rebound attempt 2 judged Salah closes round with no reward", () => {
      const attempt2Running = roundReducer(reboundOfferState, {
        type: "START_REBOUND",
        deadline: baseTime + 20000,
      });

      const revealed = roundReducer(attempt2Running, {
        type: "REVEAL",
        now: baseTime + 8000,
      });

      const resolved = roundReducer(revealed, {
        type: "JUDGE",
        correct: false,
      });

      expect(resolved.status).toBe("resolved");
      expect(resolved.result).toBe("failed_wrong");
      expect(resolved.reward).toBeNull();
    });

    it("rebound attempt 2 timeout closes round with no reward", () => {
      const attempt2Running = roundReducer(reboundOfferState, {
        type: "START_REBOUND",
        deadline: baseTime + 20000,
      });

      const timedOut = roundReducer(attempt2Running, {
        type: "TIMEOUT",
      });

      expect(timedOut.status).toBe("resolved");
      expect(timedOut.result).toBe("failed_timeout");
      expect(timedOut.reward).toBeNull();
    });

    it("rebound attempt 2 late reveal closes round with no reward", () => {
      const attempt2Running = roundReducer(reboundOfferState, {
        type: "START_REBOUND",
        deadline: baseTime + 20000,
      });

      const lateReveal = roundReducer(attempt2Running, {
        type: "REVEAL",
        now: baseTime + 25000, // late
      });

      expect(lateReveal.status).toBe("resolved");
      expect(lateReveal.result).toBe("failed_timeout");
      expect(lateReveal.reward).toBeNull();
    });
  });

  describe("Reset and Restore", () => {
    it("resets round to select state", () => {
      const modifiedState = {
        status: "resolved" as const,
        level: "easy" as const,
        questionId: "easy-001",
        attempt: 2 as const,
        deadline: null,
        remainingMs: null,
        result: "failed_wrong" as const,
        reward: null,
      };

      const reset = roundReducer(modifiedState, { type: "RESET_ROUND" });
      expect(reset).toEqual(initialRoundState);
    });

    it("restores state from session", () => {
      const saved = {
        status: "running" as const,
        level: "medium" as const,
        questionId: "medium-002",
        attempt: 1 as const,
        deadline: 999999,
        remainingMs: null,
        result: null,
        reward: null,
      };

      const restored = roundReducer(initialRoundState, {
        type: "RESTORE_SESSION",
        state: saved,
      });

      expect(restored).toEqual(saved);
    });
  });
});


import { REWARDS } from "./config";
import { QuestionLevel } from "./schema";

export type RoundStatus =
  | "select"
  | "running"
  | "revealed"
  | "timed_out"
  | "rebound_offer"
  | "resolved";

export type RoundAttempt = 1 | 2;

export type ResolutionResult =
  | "correct_attempt_1"
  | "correct_rebound"
  | "failed_timeout"
  | "failed_wrong"
  | "skipped_rebound";

export interface RoundState {
  status: RoundStatus;
  level: QuestionLevel | null;
  questionId: string | null;
  attempt: RoundAttempt;
  deadline: number | null; // epoch ms
  remainingMs: number | null;
  result: ResolutionResult | null;
  reward: string | null;
}

export type RoundEvent =
  | {
      type: "START_ROUND";
      level: QuestionLevel;
      questionId: string;
      deadline: number;
    }
  | {
      type: "REVEAL";
      now: number;
    }
  | {
      type: "TIMEOUT";
    }
  | {
      type: "JUDGE";
      correct: boolean;
    }
  | {
      type: "START_REBOUND";
      deadline: number;
    }
  | {
      type: "SKIP_REBOUND";
    }
  | {
      type: "RESET_ROUND";
    }
  | {
      type: "RESTORE_SESSION";
      state: RoundState;
    };

export const initialRoundState: RoundState = {
  status: "select",
  level: null,
  questionId: null,
  attempt: 1,
  deadline: null,
  remainingMs: null,
  result: null,
  reward: null,
};

export function roundReducer(state: RoundState, event: RoundEvent): RoundState {
  switch (event.type) {
    case "RESTORE_SESSION": {
      return event.state;
    }

    case "RESET_ROUND": {
      return initialRoundState;
    }

    case "START_ROUND": {
      if (state.status !== "select" && state.status !== "resolved") {
        return state;
      }
      return {
        status: "running",
        level: event.level,
        questionId: event.questionId,
        attempt: 1,
        deadline: event.deadline,
        remainingMs: null,
        result: null,
        reward: null,
      };
    }

    case "REVEAL": {
      if (state.status !== "running" || state.deadline === null) {
        return state;
      }

      // If reveal occurred after the deadline, disallow late reveal and treat as timeout
      if (event.now > state.deadline) {
        if (state.attempt === 1) {
          return {
            ...state,
            status: "rebound_offer",
            deadline: null,
            remainingMs: 0,
          };
        } else {
          return {
            ...state,
            status: "resolved",
            deadline: null,
            remainingMs: 0,
            result: "failed_timeout",
            reward: null,
          };
        }
      }

      return {
        ...state,
        status: "revealed",
        remainingMs: Math.max(0, state.deadline - event.now),
      };
    }

    case "TIMEOUT": {
      if (state.status !== "running") {
        return state;
      }

      if (state.attempt === 1) {
        return {
          ...state,
          status: "rebound_offer",
          deadline: null,
          remainingMs: 0,
        };
      }

      // Attempt 2 timed out: question closes, no reward
      return {
        ...state,
        status: "resolved",
        deadline: null,
        remainingMs: 0,
        result: "failed_timeout",
        reward: null,
      };
    }

    case "JUDGE": {
      if (state.status !== "revealed" || !state.level) {
        return state;
      }

      if (event.correct) {
        return {
          ...state,
          status: "resolved",
          result: state.attempt === 1 ? "correct_attempt_1" : "correct_rebound",
          reward: REWARDS[state.level],
        };
      }

      // Wrong answer
      if (state.attempt === 1) {
        return {
          ...state,
          status: "rebound_offer",
          deadline: null,
          remainingMs: null,
        };
      }

      // Attempt 2 wrong: question closes, no reward
      return {
        ...state,
        status: "resolved",
        result: "failed_wrong",
        reward: null,
      };
    }

    case "START_REBOUND": {
      if (state.status !== "rebound_offer" || !state.level || !state.questionId) {
        return state;
      }

      return {
        ...state,
        status: "running",
        attempt: 2,
        deadline: event.deadline,
        remainingMs: null,
        result: null,
        reward: null,
      };
    }

    case "SKIP_REBOUND": {
      if (state.status !== "rebound_offer") {
        return state;
      }

      return {
        ...state,
        status: "resolved",
        deadline: null,
        remainingMs: null,
        result: "skipped_rebound",
        reward: null,
      };
    }

    default:
      return state;
  }
}


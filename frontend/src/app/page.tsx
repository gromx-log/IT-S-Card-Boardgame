"use client";

import { Suspense, useEffect, useReducer, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "../components/Header";
import { JudgePanel } from "../components/JudgePanel";
import { LevelSelect } from "../components/LevelSelect";
import { QuestionCard } from "../components/QuestionCard";
import { ReboundPanel } from "../components/ReboundPanel";
import { ResetConfirmDialog } from "../components/ResetConfirmDialog";
import { ResolvedPanel } from "../components/ResolvedPanel";
import { RevealPanel } from "../components/RevealPanel";
import { TimerDisplay } from "../components/TimerDisplay";
import { soundEffects } from "../lib/audio";
import { STORAGE_KEYS, TIMER_SECONDS } from "../lib/config";
import { drawCard, resetAllDecks } from "../lib/deck";
import { getQuestionById } from "../lib/questions";
import {
  initialRoundState,
  roundReducer,
  RoundState,
} from "../lib/round-machine";
import { QuestionLevel } from "../lib/schema";
import { safeStorage } from "../lib/storage";
import { useDeadlineTimer } from "../lib/timer";

function initRoundState(): RoundState {
  if (typeof window === "undefined") return initialRoundState;
  const savedRound = safeStorage.getJSON<RoundState>("session", STORAGE_KEYS.roundSession);
  if (savedRound && savedRound.questionId && savedRound.status !== "select") {
    const now = Date.now();
    // If round was running but deadline has passed in the background
    if (savedRound.status === "running" && savedRound.deadline !== null && now >= savedRound.deadline) {
      if (savedRound.attempt === 1) {
        return {
          ...savedRound,
          status: "rebound_offer",
          deadline: null,
          remainingMs: 0,
        };
      } else {
        return {
          ...savedRound,
          status: "resolved",
          deadline: null,
          remainingMs: 0,
          result: "failed_timeout",
          reward: null,
        };
      }
    }
    return savedRound;
  }
  return initialRoundState;
}

function GameContainer() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(roundReducer, initialRoundState, initRoundState);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return safeStorage.get("local", STORAGE_KEYS.soundEnabled) === "true";
  });
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  // Handle URL query parameter pre-selection e.g. /?level=hard
  useEffect(() => {
    if (state.status === "select") {
      const lvlParam = searchParams.get("level")?.toLowerCase();
      if (lvlParam === "easy" || lvlParam === "medium" || lvlParam === "hard") {
        const { cardId } = drawCard(lvlParam as QuestionLevel);
        const deadline = Date.now() + TIMER_SECONDS * 1000;
        dispatch({
          type: "START_ROUND",
          level: lvlParam as QuestionLevel,
          questionId: cardId,
          deadline,
        });
      }
    }
  }, [searchParams, state.status]);

  // Synchronize state with sessionStorage
  useEffect(() => {
    if (state.status === "select") {
      safeStorage.remove("session", STORAGE_KEYS.roundSession);
    } else {
      safeStorage.setJSON("session", STORAGE_KEYS.roundSession, state);
    }
  }, [state]);

  function toggleSound() {
    setSoundEnabled((prev) => {
      const next = !prev;
      safeStorage.set("local", STORAGE_KEYS.soundEnabled, String(next));
      return next;
    });
  }

  function handleStartRound(level: QuestionLevel) {
    const { cardId } = drawCard(level);
    const deadline = Date.now() + TIMER_SECONDS * 1000;
    dispatch({
      type: "START_ROUND",
      level,
      questionId: cardId,
      deadline,
    });
  }

  function handleReveal() {
    dispatch({ type: "REVEAL", now: Date.now() });
  }

  function handleTimeout() {
    dispatch({ type: "TIMEOUT" });
  }

  function handleJudge(correct: boolean) {
    if (correct) {
      soundEffects.correct(soundEnabled);
    } else {
      soundEffects.wrong(soundEnabled);
    }
    dispatch({ type: "JUDGE", correct });
  }

  function handleStartRebound() {
    const deadline = Date.now() + TIMER_SECONDS * 1000;
    dispatch({ type: "START_REBOUND", deadline });
  }

  function handleSkipRebound() {
    dispatch({ type: "SKIP_REBOUND" });
  }

  function handleNextQuestion() {
    dispatch({ type: "RESET_ROUND" });
    setResetSignal((s) => s + 1);
  }

  function handleConfirmResetDecks() {
    resetAllDecks();
    dispatch({ type: "RESET_ROUND" });
    safeStorage.remove("session", STORAGE_KEYS.roundSession);
    setResetDialogOpen(false);
    setResetSignal((s) => s + 1);
  }

  const isRunning = state.status === "running";
  const timer = useDeadlineTimer({
    deadline: state.deadline,
    totalDurationMs: TIMER_SECONDS * 1000,
    isRunning,
    soundEnabled,
    onTimeout: handleTimeout,
  });

  const currentQuestion = state.questionId ? getQuestionById(state.questionId) : null;

  return (
    <div className="min-h-full flex flex-col justify-between max-w-md w-full mx-auto pb-6">
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onRequestReset={() => setResetDialogOpen(true)}
        showReaderNotice={state.status !== "select"}
      />

      <main className="flex-1 px-4 py-4 flex flex-col justify-center items-center w-full">
        {state.status === "select" && (
          <LevelSelect
            onSelectLevel={handleStartRound}
            resetSignal={resetSignal}
          />
        )}

        {/* Running & Active Countdown Phase */}
        {state.status === "running" && currentQuestion && (
          <div className="w-full flex flex-col items-center gap-4 animate-in fade-in duration-150">
            <TimerDisplay
              level={currentQuestion.level}
              remainingSeconds={timer.remainingSeconds}
              progress={timer.progress}
              isUrgent={timer.isUrgent}
              a11yAnnouncement={timer.a11yAnnouncement}
            />

            <QuestionCard
              question={currentQuestion}
              attempt={state.attempt}
            />

            <RevealPanel
              disabled={timer.remainingSeconds <= 0}
              onReveal={handleReveal}
            />
          </div>
        )}

        {/* Revealed Phase: Answer is conditionally shown to reader for judgement */}
        {state.status === "revealed" && currentQuestion && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-150">
            <QuestionCard
              question={currentQuestion}
              attempt={state.attempt}
            />

            <JudgePanel
              answer={currentQuestion.answer}
              onJudge={handleJudge}
            />
          </div>
        )}

        {/* Rebound Offer Phase: Attempt 1 wrong or timed out */}
        {state.status === "rebound_offer" && currentQuestion && (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-150">
            <QuestionCard
              question={currentQuestion}
              attempt={1}
            />

            <ReboundPanel
              onStartRebound={handleStartRebound}
              onSkipRebound={handleSkipRebound}
            />
          </div>
        )}

        {/* Resolved Phase: Showing result, reward, answer & trivia note */}
        {state.status === "resolved" && currentQuestion && (
          <ResolvedPanel
            question={currentQuestion}
            result={state.result}
            reward={state.reward}
            onNextQuestion={handleNextQuestion}
          />
        )}
      </main>

      {/* Footer attribution */}
      <footer className="text-center pt-2 px-4">
        <p className="text-[11px] text-slate-500 font-medium">
          IT-S Card • Information Technology Sprint
        </p>
      </footer>

      {/* Reset Confirmation Dialog */}
      <ResetConfirmDialog
        isOpen={resetDialogOpen}
        onConfirm={handleConfirmResetDecks}
        onCancel={() => setResetDialogOpen(false)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Memuat IT-S Card...
      </div>
    }>
      <GameContainer />
    </Suspense>
  );
}

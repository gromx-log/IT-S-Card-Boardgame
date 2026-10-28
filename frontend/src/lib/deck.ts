import { STORAGE_KEYS } from "./config";
import { getActiveQuestionIdsByLevel } from "./questions";
import { QuestionLevel } from "./schema";
import { safeStorage } from "./storage";

export interface DeckState {
  cardIds: string[];
  currentIndex: number;
  lastPlayedId: string | null;
}

/**
 * Pure Fisher-Yates in-place shuffle.
 */
export function fisherYatesShuffle<T>(array: T[], rng: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Reshuffle deck, ensuring the last played card is never at index 0 (if deck has > 1 card).
 */
export function reshuffleDeck(
  activeIds: string[],
  avoidFirstId?: string | null,
  rng: () => number = Math.random
): string[] {
  if (activeIds.length === 0) return [];
  if (activeIds.length === 1) return [...activeIds];

  const shuffled = fisherYatesShuffle(activeIds, rng);

  // If first card equals avoidFirstId, swap it with another index
  if (avoidFirstId && shuffled[0] === avoidFirstId) {
    const swapTarget = 1 + Math.floor(rng() * (shuffled.length - 1));
    const temp = shuffled[0];
    shuffled[0] = shuffled[swapTarget];
    shuffled[swapTarget] = temp;
  }

  return shuffled;
}

/**
 * Reconciles saved deck state with current active question IDs from questions.json.
 * - Drops deleted or inactive questions.
 * - Inserts newly added questions at random positions in the remaining deck.
 * - Reshuffles if deck is empty.
 */
export function reconcileDeck(
  saved: DeckState | null,
  activeIds: string[],
  rng: () => number = Math.random
): DeckState {
  const activeSet = new Set(activeIds);

  if (!saved || !Array.isArray(saved.cardIds) || saved.cardIds.length === 0) {
    return {
      cardIds: reshuffleDeck(activeIds, null, rng),
      currentIndex: 0,
      lastPlayedId: null,
    };
  }

  // 1. Filter out cards that are no longer active
  const remainingPlayed: string[] = [];
  const remainingUnplayed: string[] = [];

  saved.cardIds.forEach((id, idx) => {
    if (activeSet.has(id)) {
      if (idx < saved.currentIndex) {
        remainingPlayed.push(id);
      } else {
        remainingUnplayed.push(id);
      }
    }
  });

  const savedSet = new Set([...remainingPlayed, ...remainingUnplayed]);

  // 2. Identify newly added active IDs not present in saved deck
  const newIds = activeIds.filter((id) => !savedSet.has(id));

  // 3. Insert newly added IDs at random positions in remainingUnplayed
  for (const newId of newIds) {
    const insertIdx = Math.floor(rng() * (remainingUnplayed.length + 1));
    remainingUnplayed.splice(insertIdx, 0, newId);
  }

  const combinedCards = [...remainingPlayed, ...remainingUnplayed];
  const newCurrentIndex = remainingPlayed.length;

  // If all cards were already played or deck exhausted, reshuffle from scratch
  if (newCurrentIndex >= combinedCards.length) {
    return {
      cardIds: reshuffleDeck(activeIds, saved.lastPlayedId, rng),
      currentIndex: 0,
      lastPlayedId: saved.lastPlayedId,
    };
  }

  return {
    cardIds: combinedCards,
    currentIndex: newCurrentIndex,
    lastPlayedId: saved.lastPlayedId && activeSet.has(saved.lastPlayedId) ? saved.lastPlayedId : null,
  };
}

/**
 * Load and reconcile the deck for a given level.
 */
export function loadDeck(level: QuestionLevel): DeckState {
  const activeIds = getActiveQuestionIdsByLevel(level);
  const key = STORAGE_KEYS.deck(level);
  const saved = safeStorage.getJSON<DeckState>("local", key);

  const reconciled = reconcileDeck(saved, activeIds);
  safeStorage.setJSON("local", key, reconciled);
  return reconciled;
}

/**
 * Draw the next card from the deck. Reshuffles automatically if exhausted.
 */
export function drawCard(level: QuestionLevel): {
  cardId: string;
  deck: DeckState;
  justReshuffled: boolean;
} {
  let deck = loadDeck(level);
  let justReshuffled = false;
  const activeIds = getActiveQuestionIdsByLevel(level);

  if (activeIds.length === 0) {
    throw new Error(`No active questions found for level ${level}`);
  }

  // If exhausted, reshuffle avoiding repeating the last card played
  if (deck.currentIndex >= deck.cardIds.length) {
    deck = {
      cardIds: reshuffleDeck(activeIds, deck.lastPlayedId),
      currentIndex: 0,
      lastPlayedId: deck.lastPlayedId,
    };
    justReshuffled = true;
  }

  const drawnCardId = deck.cardIds[deck.currentIndex];
  deck.currentIndex += 1;
  deck.lastPlayedId = drawnCardId;

  // Save updated state
  safeStorage.setJSON("local", STORAGE_KEYS.deck(level), deck);

  return {
    cardId: drawnCardId,
    deck,
    justReshuffled,
  };
}

/**
 * Get remaining count and total count for a deck level.
 */
export function getDeckStats(level: QuestionLevel): {
  remaining: number;
  total: number;
} {
  const deck = loadDeck(level);
  const total = deck.cardIds.length;
  const remaining = Math.max(0, total - deck.currentIndex);
  return { remaining, total };
}

/**
 * Reset a specific deck back to a freshly shuffled state.
 */
export function resetDeck(level: QuestionLevel): DeckState {
  const activeIds = getActiveQuestionIdsByLevel(level);
  const freshDeck: DeckState = {
    cardIds: reshuffleDeck(activeIds),
    currentIndex: 0,
    lastPlayedId: null,
  };
  safeStorage.setJSON("local", STORAGE_KEYS.deck(level), freshDeck);
  return freshDeck;
}

/**
 * Reset all decks across all levels.
 */
export function resetAllDecks(): void {
  const levels: QuestionLevel[] = ["easy", "medium", "hard"];
  for (const lvl of levels) {
    resetDeck(lvl);
  }
}

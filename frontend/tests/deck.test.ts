import { describe, expect, it } from "vitest";
import {
  DeckState,
  fisherYatesShuffle,
  reconcileDeck,
  reshuffleDeck,
} from "../src/lib/deck";

describe("Deck Logic & Randomization", () => {
  it("fisherYatesShuffle returns all elements without duplicates", () => {
    const input = ["a", "b", "c", "d", "e", "f"];
    const shuffled = fisherYatesShuffle(input);

    expect(shuffled).toHaveLength(input.length);
    expect(new Set(shuffled)).toEqual(new Set(input));
  });

  it("reshuffleDeck never puts avoidFirstId at index 0 when array length > 1", () => {
    const input = ["easy-001", "easy-002", "easy-003", "easy-004"];
    const avoid = "easy-001";

    // Test across multiple runs
    for (let i = 0; i < 50; i++) {
      const shuffled = reshuffleDeck(input, avoid);
      expect(shuffled[0]).not.toBe(avoid);
      expect(shuffled).toHaveLength(input.length);
      expect(new Set(shuffled)).toEqual(new Set(input));
    }
  });

  describe("reconcileDeck", () => {
    it("creates fresh deck if saved state is null or empty", () => {
      const activeIds = ["easy-001", "easy-002", "easy-003"];
      const reconciled = reconcileDeck(null, activeIds);

      expect(reconciled.currentIndex).toBe(0);
      expect(reconciled.cardIds).toHaveLength(3);
      expect(new Set(reconciled.cardIds)).toEqual(new Set(activeIds));
    });

    it("drops inactive/deleted question ids and preserves played index", () => {
      // Suppose easy-002 was retired from questions.json
      const activeIds = ["easy-001", "easy-003", "easy-004"];
      const saved: DeckState = {
        cardIds: ["easy-001", "easy-002", "easy-003", "easy-004"],
        currentIndex: 2, // easy-001 and easy-002 were played
        lastPlayedId: "easy-002",
      };

      const reconciled = reconcileDeck(saved, activeIds);

      // easy-002 was dropped. Played remaining: easy-001 (1 card). Unplayed remaining: easy-003, easy-004
      expect(reconciled.cardIds).toEqual(["easy-001", "easy-003", "easy-004"]);
      expect(reconciled.currentIndex).toBe(1); // easy-001 was played
      expect(reconciled.cardIds.includes("easy-002")).toBe(false);
    });

    it("inserts newly added questions at random positions in the remaining deck", () => {
      // easy-005 is a new question added to questions.json
      const activeIds = ["easy-001", "easy-002", "easy-003", "easy-004", "easy-005"];
      const saved: DeckState = {
        cardIds: ["easy-001", "easy-002", "easy-003", "easy-004"],
        currentIndex: 2, // easy-001 and easy-002 were already played
        lastPlayedId: "easy-002",
      };

      const reconciled = reconcileDeck(saved, activeIds);

      expect(reconciled.cardIds).toHaveLength(5);
      expect(reconciled.cardIds.includes("easy-005")).toBe(true);
      // Played cards must remain at the beginning
      expect(reconciled.cardIds[0]).toBe("easy-001");
      expect(reconciled.cardIds[1]).toBe("easy-002");
      expect(reconciled.currentIndex).toBe(2);
      // easy-005 should be among the remaining cards (index >= 2)
      const remainingCards = reconciled.cardIds.slice(2);
      expect(remainingCards).toContain("easy-005");
    });

    it("reshuffles when all saved cards were already played", () => {
      const activeIds = ["easy-001", "easy-002", "easy-003"];
      const saved: DeckState = {
        cardIds: ["easy-001", "easy-002", "easy-003"],
        currentIndex: 3, // all played
        lastPlayedId: "easy-003",
      };

      const reconciled = reconcileDeck(saved, activeIds);

      expect(reconciled.currentIndex).toBe(0);
      expect(reconciled.cardIds).toHaveLength(3);
      // The last played id should not be at index 0 after reshuffle
      expect(reconciled.cardIds[0]).not.toBe("easy-003");
    });
  });
});


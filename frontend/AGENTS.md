## 1. What this project is

IT-S Card is a physical board game (2-5 players, 20-30 min). This repo is its **digital Kartu Pertanyaan**: every physical question card has a QR code on top. Scanning it opens this site, where a player picks a difficulty, gets a random question with a 20-second timer, and the result decides the reward.

**Read `docs/GAME_RULES.md` first.** It is the source of truth for the game. If the code and the rules disagree, the rules win. If the rules are unclear, ask the user; do not invent rules.

Primary users: students at a faculty event, playing in a group, on their own phones, often on weak Wi-Fi.

## 2. Scope

**In scope (v1)**
- Difficulty select (Mudah / Sedang / Sulit)
- Random question draw, no repeats until the deck is exhausted
- 20s countdown, Reveal button, Benar/Salah judgement
- Rebound flow (see section 4)
- Reward reminder text per difficulty
- Question content kept in a JSON file that non-developers can edit

**Out of scope (do not build unless the user asks)**
- Accounts, login, scoreboards, turn tracking, multiplayer sync, or any backend/database
- Tracking cards in hand, Kartu Aksi, or Server Down state. The app only shows reminders; the physical game owns that state.
- Analytics, ads, third-party trackers

## 3. Stack and commands

- **Next.js (App Router) + TypeScript + Tailwind CSS**, deployed on **Vercel**
- No API routes in v1. Questions are bundled with the app, so after the first load the app works even if the connection drops.
- Test with **Vitest**. Validate data with **Zod**.

Create these npm scripts if missing:

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Runs `validate:questions` first (prebuild), then builds |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm test` | Unit tests (round machine, deck, timer math) |
| `npm run validate:questions` | Validates `src/content/questions.json` against the Zod schema |

Before finishing any task, run lint, typecheck, and tests. If you touched questions, run `validate:questions`.

## 4. Round logic (the core of the app)

Model one question as a **state machine**, written as a pure reducer in `src/lib/round-machine.ts` (no React, no timers inside it) so it can be unit-tested.

```
select
  └─ pick level ─────────────▶ running (attempt 1)

running
  ├─ Reveal before deadline ──▶ revealed
  └─ deadline passes ─────────▶ timed_out

revealed
  ├─ Benar ───────────────────▶ resolved (correct)
  └─ Salah ───────────────────▶ rebound_offer

timed_out ────────────────────▶ rebound_offer

rebound_offer
  ├─ Mulai Rebound ───────────▶ running (attempt 2, same question, fresh 20s)
  └─ Lewati Rebound ──────────▶ resolved (no reward)

running (attempt 2)
  ├─ Reveal ──▶ revealed ──▶ Benar: resolved (correct via rebound)
  │                     └─▶ Salah: resolved (no reward)
  └─ timeout ─────────────────▶ resolved (no reward)
```

**Rules the logic must enforce**
1. Only **one** rebound per question. After attempt 2, the question is closed, whatever happens.
2. Rebound uses the **same question** and a **fresh 20s timer**. It never re-rolls.
3. The reward is determined by the question's difficulty, for attempt 1 or the rebound alike (see `REWARDS` in `src/config.ts`).
4. Reveal stops the timer. Timeout is treated as a wrong answer.
5. After the deadline, Reveal is disabled. It is not possible to reveal "late".
6. Server Down players cannot Rebound. The app cannot know who that is, so the rebound screen shows a reminder and a clearly visible **Lewati Rebound** button.
7. Rebound is a chance to answer and does not use up that player's turn. Show this as a short note on the rebound screen.

**Answer visibility**
- Do not render the answer in the DOM before Reveal (conditional render, not CSS hiding).
- On timeout, **do not show the answer**, because a rebound may follow.
- When the rebound starts, hide the answer again.
- Once the question is fully `resolved`, show the answer (and the optional `note`) so players learn from it.

**Who holds the phone:** per the rules, the player to the left of the answerer reads the question and runs the timer. Design for that person: they read the question aloud, press Reveal once the answer is given, then judge Benar/Salah. The answerer is not supposed to look at the screen.

## 5. Timer

- Store an absolute `deadline = Date.now() + TIMER_SECONDS * 1000` when a round starts. Compute `remaining = deadline - Date.now()` on each tick (about every 100 ms). **Never decrement a counter**, because mobile browsers throttle background tabs.
- Recompute on `visibilitychange`. If the deadline passed while the tab was hidden, dispatch the timeout.
- Persist the active round (`questionId`, `level`, `attempt`, `deadline`, `status`) to `sessionStorage`. A page refresh must **resume the same question with the same remaining time**, not reroll or reset it. This prevents refreshing to dodge a hard question.
- `TIMER_SECONDS` (default 20) and `READ_LEAD_IN_SECONDS` (default 0) live in `src/config.ts`. See the open decisions in section 10.
- Use the Screen Wake Lock API while a timer runs, with a safe fallback if unsupported.
- Feedback: visual urgency in the last 5 seconds, a short `navigator.vibrate` on timeout (where supported), and optional sound that is **off by default** (players share a room). Respect `prefers-reduced-motion`. Do not announce every second to screen readers, only at 10s, 5s, and 0.

## 6. Randomization and decks

- Mirror the physical game: each difficulty is a **shuffled deck**. Draw from the top, and when the deck is exhausted, reshuffle (see the "kocok ulang" rule in `docs/GAME_RULES.md`). Never repeat the card just played at the start of a reshuffle.
- Shuffle with Fisher-Yates. Store per-level deck order and position in `localStorage` (`itscard:deck:v1:{level}`).
- **Reconcile on load:** drop ids that no longer exist or are inactive, and insert newly added ids at random positions in the remaining deck. Updating `questions.json` must never break a player's saved deck.
- Provide a **"Game baru / Reset kartu"** button (with a confirm) that clears the saved decks.
- Known limitation: decks are per device. Two phones in one game can see the same question. This is acceptable for v1.
- Wrap all storage access in `src/lib/storage.ts` with try/catch. Private mode or blocked storage must degrade to in-memory state, not crash.

## 7. Question data

File: `src/content/questions.json`. It is the **only** place question content lives. Only `src/lib/questions.ts` may read it, so the data source can later be swapped (Edge Config, Google Sheets) by changing that one file.

```json
{
  "id": "easy-001",
  "level": "easy",
  "type": "open",
  "question": "Apa kepanjangan QR pada QR Code?",
  "options": null,
  "answer": "Quick Response",
  "note": null,
  "active": true
}
```

| Field | Rules |
|---|---|
| `id` | `{level}-{3 digits}`, **unique, stable, never reused** |
| `level` | `easy` \| `medium` \| `hard` (UI labels: Mudah / Sedang / Sulit) |
| `type` | `open` \| `multiple_choice`. `multiple_choice` requires `options` (2-4 items), and `answer` must equal one of them. |
| `answer` | Short, one line, as it would be read aloud |
| `note` | Optional one-line explanation shown after the question resolves |
| `active` | Set `false` to retire a question. **Do not delete** (keeps ids and history clean). |

**Content rules (from the pitch)**
- Questions are about the IT world but must be answerable by laypeople through everyday logic or terms they have heard. Keep them simple.
- Hard questions are not "obscure"; they are slightly more conceptual (for example, scenario questions like "Who do you call?" or "What is an API?").
- Questions are written in Indonesian. Keep the three levels reasonably balanced; flag it if one level has fewer than about 10 active questions.
- Seed the file from the question lists in `docs/GAME_RULES.md`. Note that `Wi-Fi = Wireless Fidelity` is not an official expansion (Wi-Fi is a brand name). Flag it to the user rather than silently keeping or removing it.
- Never invent or "fix" questions without telling the user which ones you added or changed.

`validate:questions` must fail on: duplicate ids, id/level mismatch, missing options for `multiple_choice`, answer not in options, empty strings, unknown fields.

## 8. UI/UX

- **Mobile-first, portrait.** Design for 360-430 px wide. Desktop only needs to look acceptable (centered column).
- Thumb-reachable primary actions at the bottom of the screen. Tap targets at least 48 px. No hover-only interactions.
- The screen must be readable at arm's length across a table: large question text, a big timer (ring or bar), high contrast.
- Each difficulty has a distinct color **and** its star label (⭐ / ⭐⭐ / ⭐⭐⭐), so color is never the only signal.
- Show the reward for the current difficulty on the result screen (text from `REWARDS` in `src/config.ts`).
- Prevent accidental Reveal taps (for example, require a deliberate press or a short hold).
- Keep the page light: no heavy images or libraries, and fast first paint on weak mobile data.
- All UI copy is Indonesian and lives in `src/content/strings.id.ts`, not scattered in components. Code, identifiers, and comments are English.
- Use the `frontend-design` skill for visual direction. Keep the look playful and "tech sprint" in spirit, matching the tagline "Build your team, complete the project."

## 9. Suggested structure

```
AGENTS.md
docs/GAME_RULES.md            # the pitch; source of truth
scripts/validate-questions.ts
src/
  app/                        # layout.tsx, page.tsx (select), play/page.tsx
  components/                 # Timer, QuestionCard, RevealPanel, ReboundPanel, ...
  content/
    questions.json
    strings.id.ts
  lib/
    config.ts                 # TIMER_SECONDS, REWARDS, LEVELS
    questions.ts              # only reader of questions.json
    deck.ts                   # shuffle, draw, reconcile
    round-machine.ts          # pure reducer
    timer.ts                  # deadline-based hook
    storage.ts                # safe wrappers
tests/
```

## 10. Deployment (Vercel)

- Deploy from GitHub. Pushes to `main` go to production, and branches or PRs get preview URLs. Use previews to review question changes before merging.
- **The QR codes are printed on cards, so the production URL must never change.** Use a custom short domain (preferred) or lock the Vercel production URL before printing. Never rename the project afterwards.
- A failing `validate:questions` fails the build, so a bad edit never replaces the live site.
- Updating content: edit `questions.json` (the GitHub web editor works), commit, and Vercel redeploys.
- If this is sold as merchandise, check that Vercel's plan terms (the free Hobby tier is for non-commercial use) fit.

## 11. Open decisions: ask the user, do not guess

| # | Question | Current default |
|---|---|---|
| 1 | **Timer start.** The rules say the reader reads the question, then starts the timer. The current design starts the timer on display, so reading time counts against the 20s. Add a 3s "Siap?" lead-in, a Start button, or raise it to 25s? | Starts immediately, 20s |
| 2 | **Answer leak on wrong reveal.** If attempt 1 is revealed and judged Salah, the reader has seen the answer, and may also be the rebounder (always so in a 2-player game). Accept it (honor system), or switch to tap-to-answer on options so the app judges and the answer stays hidden until resolution? | Accept it (honor system) |
| 3 | **QR scheme.** One QR for every card, or three QRs (one per difficulty deck) that preselect the level via `/?level=hard`? | One QR to the home screen |
| 4 | **Rebound when the next player is under Server Down.** Skip the rebound entirely, or pass it to the following player? | Skip (via the Lewati button) |
| 5 | **Mode Poin** (optional variant in the rules). | Out of scope for v1 |

## 12. Working agreements for agents

- Keep changes small and focused. Do not add dependencies without a reason; prefer the platform (Web APIs) over libraries.
- Keep game logic out of components. It belongs in `lib/`, covered by unit tests, especially the round machine (every transition above), deck reconcile, and timer math with a mocked clock.
- Do not store or send any personal data.
- When you change behavior described in this file or in the rules, update the doc in the same change.
- Commit messages: imperative, short (for example, `Add rebound state to round machine`).
- If a request conflicts with this file, say so and ask before proceeding.
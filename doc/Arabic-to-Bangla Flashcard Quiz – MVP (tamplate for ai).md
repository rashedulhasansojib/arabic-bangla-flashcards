# Arabic-to-Bangla Flashcard Quiz – MVP (v0.dev Spec)

\[\[ TEMPLATE META \]\] Name: Community: App Prototyping with AI Code Generation Description: This template is structured for use with AI code generation platforms like v0, Bolt.new, Loveable, and Replit. It includes product overviews, necessary application stack defaults, and outlines backend service requiements for your next MVP.

\[\[ TEMPLATE SECTIONS - FOLLOW EXACTLY \]\] Rules:

* Follow these sections exactly, in order.

* Do not add or remove sections unless the user explicitly requests it.

## Product Description

A self-contained, browser-based flashcard quiz application that helps Bangla-speaking learners memorize Arabic vocabulary efficiently and privately. The app runs entirely client-side, stores progress locally, and uses a simple spaced-repetition system to reinforce learning over time.

Key goals:

* Learn and retain Arabic vocabulary with Bangla translations using lightweight quizzes and spaced repetition.

* Provide a private, zero-signup experience that never sends data to a server.

* Deliver a focused, distraction-free interface that encourages daily practice.

Primary user interactions:

* Start a quiz session from the home screen and answer questions (multiple-choice or type-to-answer).

* Flip/reveal answers, self-grade confidence (Again/Hard/Good/Easy), and proceed to the next card.

* View progress metrics (accuracy, streak, due cards) directly in the browser.

* Manage the deck: add, edit, delete words; import/export JSON for backup/sharing.

* Adjust preferences: dark/light mode, quiz mode, daily goal (cards per day), and answer style.

End goal:

* Enable users to achieve consistent daily learning (“I learned 10 new words today”) with a minimal, fast, and private interface, backed by a simple yet effective spaced-repetition workflow.

## Deisgn and Theme

Chosen UI system: Shadcn UI (with Tailwind CSS and Radix primitives)

* Style principles: clean, modern, minimal. Compact spacing, generous typography, and clear hierarchy.

* Color and accessibility: neutral base palette with a single accent (teal/emerald recommended). High contrast, WCAG-compliant focus states, large tap targets, and visible validation.

* Modes: fully supports light and dark mode; respects system preference and persists user choice locally.

* Arabic text layout: proper RTL rendering for Arabic script; Bangla and English in LTR. Clear typographic pairing for legibility.

* Motion and feedback: subtle micro-interactions (hover, press, success toast), optional confetti for “win” moments, no distracting animation loops.

Keyboard and interaction defaults:

* Keyboard-friendly: Tab order, Enter to submit, Space to flip, 1–4 to select multiple-choice options, H to show hint.

* Screen reader support: ARIA roles for buttons, dialogs, tabs; semantic headings and labels; descriptive alt text.

* Error/resilience: clear inline errors; undo for destructive actions (delete card); toast confirmations for changes.

Suggested Shadcn components:

* App Shell: Navbar, Sidebar (optional), Breadcrumbs

* Core: Card, Button, Input, Textarea, Select, Toggle, Switch, Tabs, Tooltip, Dialog, Sheet, DropdownMenu, Progress, Alert, Toast

* Data: Table (for deck management), Badge, Separator

## Required Development Stack

* Framework: Next.js (App Router, TypeScript), deployed via Vercel v0

* UI: Tailwind CSS + Shadcn UI (Radix under the hood)

* Icons: Lucide

* State: Lightweight client state via React Context + useReducer, or Zustand (no server state)

* Storage: localStorage by default; optional IndexedDB adapter if decks become large

* Build/quality: ESLint + Prettier + TypeScript strict; basic unit tests optional

* Assets: Self-host fonts if used; prefer system fonts to avoid network calls

* No backend, no serverless functions, no third-party analytics or telemetry

Simplicity first:

* All data and logic run in the browser.

* Fast load via static assets and minimal bundle size.

* Optional PWA setup for offline caching (static assets + deck JSON).

## Application Backend Requirements

No backend is required for this MVP.

* Authentication: none (no AuthJS, no Clerk)

* Database: none (no Supabase/Neon)

* Remote APIs: none

* ORM: none

* Analytics/telemetry: none

Client-side data handling:

* Persistence: localStorage keys (versioned), e.g.:

  * app:settings:v1

  * app:deck:v1

  * app:progress:v1

* Backup and portability: JSON import/export (file download/upload). No network requests.

* Privacy: all data remains on-device; no external calls required for core use.

Data model (stored as JSON locally):

* Card

  * id (string, UUID)

  * arabic (string, RTL)

  * bangla (string)

  * transliteration (string, optional)

  * tags (string\[\], optional)

  * createdAt (number, epoch ms)

* ReviewState

  * cardId (string)

  * box (number; Leitner box index)

  * lastReviewedAt (number)

  * nextReviewAt (number)

  * stats: { correct: number; incorrect: number; streak: number }

* Settings

  * theme: "system" | "light" | "dark"

  * quizMode: "multiple-choice" | "type-answer" | "flashcard"

  * dailyGoal: number (e.g., 10)

  * showTransliteration: boolean

  * soundEnabled: boolean (optional, e.g., SpeechSynthesis if available)

  * rtlArabic: true (always enforced, but kept for explicitness)

## Explicitly Defined Product Flows

1. First run and onboarding

* User lands on home with a short welcome and “Start Quiz” primary action.

* App seeds a small starter deck (e.g., 50 high-frequency words).

* System theme respected; user can toggle light/dark and choose quiz mode.

* Quick tip banner: keyboard shortcuts, privacy note (“Everything stays in your browser”), and how to import/export decks.

1. Start a quiz session

* User clicks Start Quiz. The app composes a session from due cards:

  * Scheduling: simple Leitner system with default intervals (Box 0: today, Box 1: +1d, Box 2: +3d, Box 3: +7d, Box 4: +14d, Box 5: +30d).

  * New cards are introduced up to dailyGoal if there aren’t enough due reviews.

* Quiz screen layout:

  * Arabic word prominently at center (RTL, large font).

  * Optional transliteration and hint toggle.

  * Mode controls: Multiple-choice (4 options by default), Type-answer, or Flashcard (flip and self-grade).

  * Actions: Reveal/Check, Then grade as Again/Hard/Good/Easy.

  * Quick nav: Skip, Mark as “Need Attention,” or Bookmark.

* Feedback:

  * Correct: subtle success animation, nextReviewAt advanced per grade, streak increments.

  * Incorrect: gentle nudge, place back into near-term review, optional hint on next encounter.

1. Answering and spaced repetition

* Multiple-choice: user selects 1 of 4 Bangla options; distractors drawn from other cards’ translations and tags to keep plausible.

* Type-answer: user types Bangla; basic normalization (trim, lowercase, ignoring punctuation/diacritics) to match.

* Flashcard: user flips to reveal and chooses a grade.

* Grading logic (defaults; adjustable later):

  * Again → move to Box 0 (due today)

  * Hard → stay in same box, nextReviewAt + short interval

  * Good → advance one box

  * Easy → advance two boxes (cap at max box)

* Intervals derived from box index; nextReviewAt computed relative to now.

1. Session wrap-up

* Summary modal/page:

  * Cards reviewed, accuracy %, time spent, streak progress, next due count.

  * Celebrate “I Win” moments:

    * Hitting dailyGoal triggers confetti and a small congratulatory message.

    * Streak increases show a toast with a motivating tip or phrase.

* From summary, user can:

  * Review mistakes (quick loop-through)

  * Return home

  * Continue with extra practice (if desired)

1. Deck management

* Deck screen (table):

  * Columns: Arabic (RTL), Bangla, Transliteration, Tags, Actions (Edit/Delete).

  * Add single card via dialog; bulk add (CSV/JSON import).

  * Edit in place; Undo toast on delete.

* Import/Export:

  * Export downloads a versioned JSON with cards and review state.

  * Import validates and merges (no duplicates by id; allows replace option).

* Reset progress:

  * Clears ReviewState only; preserves deck.

  * Confirm dialog with Undo.

1. Progress view

* Visuals:

  * Progress ring toward dailyGoal.

  * Due cards today vs upcoming.

  * Box distribution (stacked bars) to show long-term retention trend.

* Privacy note always visible: “Data is stored locally on this device.”

Delight moments to reinforce habit:

* Smooth transitions between cards and a responsive, snappy feel.

* Encouraging microcopy after tough reviews.

* Zero-loading sensation for repeat visits thanks to local caching and small bundle size.

## Explicit Directions for AI Generation

For v0.dev code generation and scaffolding:

* Pages/Routes

  * / (Home: start quiz, quick stats, settings link)

  * /quiz (Active session UI)

  * /deck (Deck table: CRUD, import/export)

  * /settings (Theme, quiz mode, accessibility, daily goal)

  * Optional: /progress (Detailed charts) or include within /

* Core components

  * AppShell (Header, ThemeToggle)

  * QuizCard (Arabic display, options, type field, flip)

  * QuizControls (Reveal/Check, grading buttons, skip)

  * ProgressSummary (goal ring, due counts, streak)

  * DeckTable (list, edit, delete, tags)

  * ImportExportPanel (upload/download JSON)

  * ToastProvider, Dialogs, Tooltip wrappers

* State and data

  * Types: Card, ReviewState, Settings, SessionItem

  * Session builder: collect due cards + introduce new up to dailyGoal

  * SRS utilities: box transitions, interval map, nextReviewAt calculator

  * Storage layer:

    * localStorage keys: app:settings:v1, app:deck:v1, app:progress:v1

    * Safe read/write with schema validation (lightweight zod optional)

    * Versioning + migration placeholder

  * Event model: on deck change, auto-refresh the quiz pool if on /quiz

* Accessibility & i18n considerations

  * Arabic is RTL: ensure dir="rtl" for Arabic text blocks; Bangla and UI in LTR

  * Labels, roles, and keyboard shortcuts integrated; focus ring always visible

  * High-contrast theme tokens; avoid color-only status indicators

* Performance & privacy

  * No external network requests for core flow

  * Prefer system fonts or self-hosted; no remote analytics

  * Preload critical routes; code-split non-critical pages

  * Optional service worker for static asset caching (no server sync)

* UX details

  * Default quiz mode: multiple-choice

  * Options per question: 4 (1 correct + 3 distractors)

  * Hints: optional transliteration toggle

  * Confetti on dailyGoal reached; subtle success toasts elsewhere

  * Undo for destructive actions (deck delete/reset)

* Development constraints

  * TypeScript strict, ESLint, Prettier configured

  * Keep the bundle lean; no heavy charts initially (prefer simple bars/progress)

  * No backend complexity required for this MVP—everything must work offline and privately in the browser

* Testing targets (lightweight)

  * Session creation produces expected due count

  * Grading transitions advance boxes correctly

  * Import/export round-trips without data loss

  * Accessibility: keyboard-only flow, ARIA attributes on critical controls
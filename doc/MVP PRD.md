# Arabic-to-Bangla Flashcard Quiz – MVP PRD

### Overview

A focused, web-based flashcard quiz app that helps Bangla speakers learn Arabic vocabulary through up to 10-question multiple-choice sessions and simple spaced repetition. Content is preloaded from a static data.json at build time. All progress is stored locally in the browser for a private, single-user experience. The interface is clean, accessible, responsive, and supports Arabic and Bangla scripts. Built with React (Next.js) and deployable on Vercel v0.

---

## Goals

### Product Goals

* Deliver a minimal, reliable Arabic-to-Bangla vocabulary quiz with zero setup.

* Ensure each session presents up to 10 unique words with four Bangla options each.

* Implement deterministic spaced repetition: correct → review in 2 days; wrong → due again immediately (same day).

* Always include outstanding incorrects from prior sessions (up to 5 per session) before other items.

* Keep all data on-device with a clear reset option; no accounts, no backend.

* Provide a clean, accessible UI with strong contrast and scalable typography.

### User Goals

* Learn Arabic vocabulary efficiently in short, focused sessions.

* Practice with straightforward multiple-choice quizzes.

* See which words were answered correctly or incorrectly at the end of a session.

* Return when words are due to review at the right time.

### Non-Goals

* No audio, typing practice, transliteration, grammar content, or example sentences.

* No deck browsing, user-generated content, or content editing.

* No teacher/admin interfaces, sharing, or collaboration.

* No notifications, offline sync, streaks, leaderboards, or paid content.

* No sign-in, accounts, or cloud synchronization.

---

## User Stories

* Bangla-speaking learner (beginner/intermediate)

  * As a learner, I want quick up-to-10-question sessions so I can study during short breaks.

  * As a learner, I want immediate right/wrong feedback so I can learn from mistakes.

  * As a learner, I want the app to remember my progress locally so I can return later without signing in.

  * As a learner, I want comfortable text sizes and good contrast so the content is easy to read.

---

## Functional Requirements

### Content

* The app loads all Arabic–Bangla vocabulary from a static data.json at build time.

* Prompts are Arabic only; choices are Bangla only.

* No in-app content editing, creation, or management.

### Quiz Sessions

* Each session contains up to 10 unique Arabic words.

* Each question shows:

  * Prompt: Arabic word (large, right-to-left rendering).

  * Four Bangla options: exactly one correct answer and three distractors.

* No word repeats within a single session.

* Immediate feedback after selection: correct/incorrect indication and reveal of the correct answer when wrong.

* A visible progress indicator (e.g., 3/10 for a full session; reflects actual count for short sessions).

* End-of-session summary: total correct, list of missed words with their correct Bangla meanings.

### Spaced Repetition

* Scheduling rules:

  * Correct answer → next review due in 2 days.

  * Incorrect answer → next review due immediately (same day).

  * “Immediately due” means it is eligible for inclusion in a new session started the same day; no repeats occur within the same session.

* Session composition (selection order):

  1. Outstanding incorrect backlog: include all previously missed words that have not yet been answered correctly again, up to 5 items per session. If fewer than 5 exist, include all.

    * Within this group, pick oldest missed first (earliest due or earliest missed time).

  2. Additional due-today items: words scheduled with due dates on or before today (excluding those already included above).

    * Sort by earliest due date.

  3. Unseen words: fill any remaining slots with words the user has never attempted.

* Capacity and availability:

  * Fill up to 10 total items per session.

  * If fewer than 10 total words are available (combined: incorrect backlog + due today + unseen), start a shorter session with the available items.

  * No duplicates within a session.

* Updating schedule:

  * Update a word’s due date immediately upon answer selection based on the rules above.

  * When a previously incorrect word is answered correctly, remove it from the incorrect backlog and schedule it for 2 days later.

### Option Generation (Multiple Choice)

* For each question, pick 3 distractors from other words in the dataset.

* Ensure no duplicate options within a question.

* Avoid reusing the same distractor repeatedly in the same session when possible.

* If the dataset is too small to generate 3 distractors, show as many as possible and indicate limited options.

### Progress & Data

* All progress is stored locally in the browser (e.g., localStorage).

* No sign-in or sync; no network requests are required at runtime.

* Provide a “Reset Progress” control with a confirmation step that clears all local data.

### Accessibility & UI

* Clean, high-contrast UI that scales via relative units (rem, responsive layout).

* Clear language labels and proper text direction: Arabic (RTL) and Bangla (LTR).

* Keyboard navigation for the entire flow (Tab/Shift+Tab, Enter/Space to select).

* Screen reader-compatible labels and roles for interactive elements.

* Adjustable text size via a settings control.

### Platform & Deployment

* React with Next.js, deployable on Vercel v0.

* No backend services or databases.

* The app runs fully client-side after initial load.

---

## User Experience

### Entry Point

* Landing screen with:

  * “Start Session” primary action.

  * A small indicator showing the count of words due today.

  * “Settings” link (text size control, high-contrast theme toggle, reset progress).

  * Privacy note: data is stored locally in the browser.

### Session Flow

* Question view:

  * Arabic prompt rendered prominently with correct RTL layout.

  * Four Bangla choices as distinct, high-contrast buttons with ample spacing.

  * Progress indicator (e.g., Question 4 of 10) reflecting actual session length.

  * Keyboard-friendly focus order and clear focus states.

* Answer feedback:

  * Immediate correct/incorrect indication.

  * If incorrect, show the correct Bangla meaning.

  * Continue to next question via button or keyboard.

* Session summary:

  * Score (e.g., 7/10).

  * List of missed words with their correct Bangla meanings.

  * Informational note: correct answers will reappear in 2 days; wrong answers are due again today (included in a future session started the same day, up to 5 per session).

  * Actions: “Return to Home” and, if eligible, “Start Another Session.”

### Settings

* Text size: small/medium/large (relative units).

* Theme: default and high-contrast.

* Data: “Reset Progress” (with confirmation).

* About: brief explanation of on-device storage and the scheduling logic (correct → 2 days, incorrect → same day), Arabic prompts with Bangla choices only, and build-time data.json content.

### Empty and Edge States

* If no words are due and no new words remain, display a friendly message: “You’re all caught up.”

* If the dataset has fewer than 4 distinct items, allow fewer options per question with clear notice.

* If local storage is unavailable, show a warning and run the session without persistence.

---

## Narrative

Rafi opens the web app on his phone. He taps “Start Session” and sees the first Arabic word with four Bangla options. He selects an answer and gets instant feedback. Over up to 10 questions, he builds confidence. At the end, he sees which words he missed with the correct meanings.

Later that day or the next time he studies, up to five of his previously missed words appear first. Correctly answered words come back two days later, while missed words are due again the same day (and included early in subsequent sessions). He doesn’t create accounts or manage content. Everything happens locally in his browser. The clean interface, accessible text sizes, and script-friendly layout make study quick and comfortable.

---

## Success Metrics

### Functional

* Sessions contain up to 10 unique items (no repeats). When fewer than 10 items are available, a clear short-session state is shown.

* 100% of questions display four unique options (or as many as available with a clear notice).

* Accurate scheduling: correct → +2 days; incorrect → due again same day.

* Session composition adheres to priority order:

  1. outstanding incorrects (up to 5),

  2. remaining due today,

  3. unseen, filling up to 10 total.

### Usability & Accessibility

* Meets WCAG 2.1 AA color contrast.

* Full keyboard navigability across flows.

* No layout breakage across text scaling ranges.

### Performance & Reliability

* Initial page interactive in under 2 seconds on mid-tier devices/network.

* No runtime network dependency after initial load.

* Zero critical client errors in normal usage paths.

### Privacy

* No data leaves the device.

* Reset removes all local progress with confirmation.

---

## Technical Considerations

### Technical Needs

* Framework: React with Next.js, app deployed on Vercel v0.

* Content: data.json imported at build time (static bundling).

* Rendering: Arabic RTL and Bangla LTR with appropriate direction attributes.

* State: Client-side state management (React state/Context); no server state.

* Persistence: localStorage for progress and settings.

* Routing: Single-page quiz flow with lightweight routes (Home, Session, Summary, Settings).

### Integration Points

* None. No authentication, analytics, payments, or notifications.

### Data Storage & Privacy

* Storage Model

  * Words: static bundle (read-only).

  * Progress: localStorage entries keyed by word id, storing due date and history; track last outcome to determine if the word remains in the incorrect backlog until answered correctly once.

  * Settings: localStorage (text size, theme).

* Privacy

  * No PII; no network calls for user data.

  * Clear Reset function to wipe localStorage keys used by the app.

### Scalability & Performance

* Static generation for the app shell and content.

* Lazy load non-critical UI components.

* Efficient option generation (avoid heavy computations).

* Content scale: thousands of words supported client-side with minimal overhead.

### Potential Challenges

* Right-to-left rendering: ensure correct directionality and isolation to avoid bidi issues.

* Distractor quality: random distractors may be too easy/hard; ensure variety while avoiding duplicates.

* Local data loss: users clearing browser data will lose progress; communicate this clearly.

* Timezone handling: schedule due dates based on local time; store ISO strings to avoid drift.

---

## Milestones & Sequencing

### Project Estimate

* Small scope: 1–2 weeks for MVP (including SRS, quiz flow, accessibility pass, and Vercel deployment).

### Team Size & Composition

* 1–2 people

  * Front-end Engineer (React/Next.js)

  * Designer (part-time) for typography, contrast, and interaction polish

### Suggested Phases

* Phase 1: Define (1–2 days)

  * Finalize dataset format (data.json) and card schema.

  * Define SRS objects and localStorage keys (due date, last outcome/backlog flag).

  * Wireframes for Home, Session, Summary, Settings.

* Phase 2: Build (4–7 days)

  * Implement static content loading via Next.js.

  * Build quiz session generator (up to 10 items, option generation, no repeats).

  * Implement SRS updates (correct → +2 days; incorrect → same day) and session composition (incorrect backlog first up to 5, then due today, then unseen).

  * Add accessibility features: ARIA, keyboard flow, contrast themes, text scaling.

  * Implement local persistence and reset control.

* Phase 3: QA & Polish (2–3 days)

  * Unit tests for scheduler and option generator.

  * Cross-device and screen-size testing.

  * Accessibility audit (automated + manual).

  * Performance tune and deploy to Vercel v0.

* Phase 4: Launch (1 day)

  * Promote production URL.

  * Add lightweight “About” and “Privacy” notes.

  * Monitor errors via browser console-only checks during internal testing.

---

## Table: Recommended Card Fields (for data.json)

Optional extensions (not required for MVP but supported by the app if present and ignored otherwise):

* group: string – Optional grouping to pick distractors from similar items.

* frequency: number – Optional frequency rank for potential future ordering.

Notes:

* The dataset should contain at least 4 distinct items to guarantee four options.

* Avoid duplicate Arabic terms or duplicate Bangla meanings where possible to reduce ambiguity.
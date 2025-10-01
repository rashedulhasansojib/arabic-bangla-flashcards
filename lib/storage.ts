// localStorage utilities for data persistence

import type { Card, Deck, Progress, QuizSession, Settings } from './types';

const STORAGE_KEYS = {
	CARDS: 'flashcards_cards',
	DECKS: 'flashcards_decks',
	SETTINGS: 'flashcards_settings',
	PROGRESS: 'flashcards_progress',
	SESSIONS: 'flashcards_sessions',
} as const;

// Default settings
const DEFAULT_SETTINGS: Settings = {
	quizMode: 'multiple-choice',
	cardsPerSession: 20,
	dailyGoal: 50,
	showTransliteration: true,
	theme: 'system',
	soundEnabled: true,
};

// Default progress
const DEFAULT_PROGRESS: Progress = {
  totalCards: 0,
  masteredCards: 0,
  learningCards: 0,
  newCards: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalReviews: 0,
  accuracyRate: 0,
};

// Generic storage functions
function getItem<T>(key: string, defaultValue: T): T {
	if (typeof window === 'undefined') return defaultValue;

	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch {
		// console.error(`Error reading ${key} from localStorage:`, error);
		return defaultValue;
	}
}

function setItem<T>(key: string, value: T): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// console.error(`Error writing ${key} to localStorage:`, error);
	}
}

// Cards
export function getCards(): Card[] {
	return getItem<Card[]>(STORAGE_KEYS.CARDS, []);
}

export function setCards(cards: Card[]): void {
	setItem(STORAGE_KEYS.CARDS, cards);
}

export function getCard(id: string): Card | undefined {
	const cards = getCards();
	return cards.find((card) => card.id === id);
}

export function updateCard(id: string, updates: Partial<Card>): void {
	const cards = getCards();
	const index = cards.findIndex((card) => card.id === id);
	if (index !== -1) {
		cards[index] = { ...cards[index], ...updates };
		setCards(cards);
	}
}

// Decks
export function getDecks(): Deck[] {
	return getItem<Deck[]>(STORAGE_KEYS.DECKS, []);
}

export function setDecks(decks: Deck[]): void {
	setItem(STORAGE_KEYS.DECKS, decks);
}

export function getDeck(id: string): Deck | undefined {
	const decks = getDecks();
	return decks.find((deck) => deck.id === id);
}

// Settings
export function getSettings(): Settings {
	return getItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function setSettings(settings: Partial<Settings>): void {
	const current = getSettings();
	setItem(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
}

// Progress
export function getProgress(): Progress {
	return getItem<Progress>(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS);
}

export function setProgress(progress: Partial<Progress>): void {
	const current = getProgress();
	setItem(STORAGE_KEYS.PROGRESS, { ...current, ...progress });
}

export function updateStreak(): void {
	const progress = getProgress();
	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	if (!progress.lastStudyDate) {
		// First study session
		setProgress({
			currentStreak: 1,
			longestStreak: Math.max(progress.longestStreak, 1),
			lastStudyDate: today.toISOString(),
		});
		return;
	}

	const lastStudyDate = new Date(progress.lastStudyDate);
	const lastStudyStr = lastStudyDate.toISOString().split('T')[0];
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = yesterday.toISOString().split('T')[0];

	if (lastStudyStr === todayStr) {
		// Already studied today, no change to streak
		return;
	} else if (lastStudyStr === yesterdayStr) {
		// Studied yesterday, continue streak
		const newStreak = progress.currentStreak + 1;
		setProgress({
			currentStreak: newStreak,
			longestStreak: Math.max(progress.longestStreak, newStreak),
			lastStudyDate: today.toISOString(),
		});
	} else {
		// Gap in study, reset streak
		setProgress({
			currentStreak: 1,
			longestStreak: Math.max(progress.longestStreak, 1),
			lastStudyDate: today.toISOString(),
		});
	}
}

export function calculateProgress(): Progress {
	const cards = getCards();
	const totalCards = cards.length;
	const masteredCards = cards.filter((card) => card.box === 5).length;
	const learningCards = cards.filter(
		(card) => card.box > 1 && card.box < 5
	).length;
	const newCards = cards.filter(
		(card) =>
			card.box === 1 && card.correctCount === 0 && card.incorrectCount === 0
	).length;

	// Calculate accuracy from all card review history
	const totalReviews = cards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0);
	const correctReviews = cards.reduce((sum, card) => sum + card.correctCount, 0);
	const accuracyRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

	const currentProgress = getProgress();

	return {
		...currentProgress,
		totalCards,
		masteredCards,
		learningCards,
		newCards,
		accuracyRate,
	};
}

// Sessions
export function getSessions(): QuizSession[] {
	return getItem<QuizSession[]>(STORAGE_KEYS.SESSIONS, []);
}

export function addSession(session: QuizSession): void {
	const sessions = getSessions();
	sessions.push(session);
	// Keep only last 50 sessions
	if (sessions.length > 50) {
		sessions.shift();
	}
	setItem(STORAGE_KEYS.SESSIONS, sessions);
}

// Export/Import
export function exportData(): string {
	const data = {
		cards: getCards(),
		decks: getDecks(),
		settings: getSettings(),
		progress: getProgress(),
		sessions: getSessions(),
		exportedAt: new Date().toISOString(),
	};
	return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
	try {
		const data = JSON.parse(jsonString);

		if (data.cards) setCards(data.cards);
		if (data.decks) setDecks(data.decks);
		if (data.settings) setItem(STORAGE_KEYS.SETTINGS, data.settings);
		if (data.progress) setItem(STORAGE_KEYS.PROGRESS, data.progress);
		if (data.sessions) setItem(STORAGE_KEYS.SESSIONS, data.sessions);

		return true;
	} catch {
		// console.error('Error importing data:', error);
		return false;
	}
}

// Clear all data
export function clearAllData(): void {
	Object.values(STORAGE_KEYS).forEach((key) => {
		localStorage.removeItem(key);
	});
}

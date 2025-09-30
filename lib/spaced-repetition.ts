// Spaced repetition algorithm (Leitner system)

import { updateCard } from './storage';
import type { Card, QuizGrade } from './types';

// Box intervals in days
const BOX_INTERVALS = {
	1: 1, // Review tomorrow
	2: 3, // Review in 3 days
	3: 7, // Review in 1 week
	4: 14, // Review in 2 weeks
	5: 30, // Review in 1 month
};

export function calculateNextReview(box: number): string {
	const days = BOX_INTERVALS[box as keyof typeof BOX_INTERVALS] || 1;
	const nextDate = new Date();
	nextDate.setDate(nextDate.getDate() + days);
	return nextDate.toISOString();
}

export function gradeCard(card: Card, grade: QuizGrade): void {
	const now = new Date().toISOString();
	let newBox = card.box;

	switch (grade) {
		case 'again':
			// Move back to box 1
			newBox = 1;
			updateCard(card.id, {
				box: newBox,
				lastReviewed: now,
				nextReview: calculateNextReview(newBox),
				incorrectCount: card.incorrectCount + 1,
			});
			break;

		case 'hard':
			// Stay in same box
			updateCard(card.id, {
				lastReviewed: now,
				nextReview: calculateNextReview(newBox),
				correctCount: card.correctCount + 1,
			});
			break;

		case 'good':
			// Move to next box
			newBox = Math.min(card.box + 1, 5);
			updateCard(card.id, {
				box: newBox,
				lastReviewed: now,
				nextReview: calculateNextReview(newBox),
				correctCount: card.correctCount + 1,
			});
			break;

		case 'easy':
			// Skip a box
			newBox = Math.min(card.box + 2, 5);
			updateCard(card.id, {
				box: newBox,
				lastReviewed: now,
				nextReview: calculateNextReview(newBox),
				correctCount: card.correctCount + 1,
			});
			break;
	}
}

export function getDueCards(cards: Card[]): Card[] {
	const now = new Date();
	return cards.filter((card) => {
		if (!card.nextReview) return true; // New cards
		const nextReview = new Date(card.nextReview);
		return nextReview <= now;
	});
}

export function getSessionCards(cards: Card[], maxCards: number = 10): Card[] {
	const now = new Date();
	const sessionCards: Card[] = [];

	// 1. Outstanding incorrect backlog (up to 5 items)
	// These are cards that were answered incorrectly and haven't been answered correctly again
	const incorrectBacklog = cards
		.filter((card) => {
			// Card has been reviewed before, has incorrect answers, and is still in early boxes
			// (indicating it hasn't been mastered yet)
			return (
				card.lastReviewed &&
				card.incorrectCount > 0 &&
				card.box <= 2 && // Still in early learning phase
				new Date(card.lastReviewed) <= now
			);
		})
		.sort((a, b) => {
			// Sort by earliest missed time (oldest first)
			const aTime = new Date(a.lastReviewed || 0).getTime();
			const bTime = new Date(b.lastReviewed || 0).getTime();
			return aTime - bTime;
		})
		.slice(0, 5); // Take up to 5 items

	sessionCards.push(...incorrectBacklog);

	// 2. Additional due-today items (excluding those already included)
	const alreadyIncluded = new Set(incorrectBacklog.map((card) => card.id));
	const dueToday = cards
		.filter((card) => {
			if (alreadyIncluded.has(card.id)) return false;
			if (!card.nextReview) return true; // New cards
			const nextReview = new Date(card.nextReview);
			return nextReview <= now;
		})
		.sort((a, b) => {
			// Sort by earliest due date
			const aTime = new Date(a.nextReview || 0).getTime();
			const bTime = new Date(b.nextReview || 0).getTime();
			return aTime - bTime;
		});

	sessionCards.push(...dueToday);

	// 3. Unseen words (fill remaining slots)
	const alreadyInSession = new Set(sessionCards.map((card) => card.id));
	const unseenWords = cards.filter((card) => {
		return !alreadyInSession.has(card.id) && !card.lastReviewed;
	});

	sessionCards.push(...unseenWords);

	// Return up to maxCards, ensuring no duplicates
	const uniqueCards = sessionCards.filter(
		(card, index, self) => index === self.findIndex((c) => c.id === card.id)
	);

	return uniqueCards.slice(0, maxCards);
}

export function getCardsByBox(cards: Card[], box: number): Card[] {
	return cards.filter((card) => card.box === box);
}

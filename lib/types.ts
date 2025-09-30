// Data models for the flashcard application

export interface Card {
  id: string
  arabic: string
  bangla: string
  transliteration?: string
  module: string
  box: number // Leitner box (1-5)
  lastReviewed: string | null
  nextReview: string | null
  correctCount: number
  incorrectCount: number
  createdAt: string
}

export interface Deck {
  id: string
  name: string
  description: string
  cardIds: string[]
  createdAt: string
  updatedAt: string
}

export interface ReviewState {
  cardId: string
  box: number
  lastReviewed: string
  nextReview: string
  correctCount: number
  incorrectCount: number
}

export interface Settings {
  quizMode: "multiple-choice" | "type-answer" | "flashcard"
  cardsPerSession: number
  dailyGoal: number
  showTransliteration: boolean
  theme: "light" | "dark" | "system"
  soundEnabled: boolean
}

export interface Progress {
  totalCards: number
  masteredCards: number
  learningCards: number
  newCards: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
  totalReviews: number
  accuracyRate: number
}

export interface QuizSession {
  id: string
  cards: Card[]
  currentIndex: number
  answers: {
    cardId: string
    correct: boolean
    timeSpent: number
  }[]
  startedAt: string
  completedAt: string | null
}

export type QuizGrade = "again" | "hard" | "good" | "easy"

// Quiz generation and utilities

import type { Card } from "./types"

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateMultipleChoiceOptions(
  correctCard: Card,
  allCards: Card[],
  count = 4,
): { text: string; isCorrect: boolean }[] {
  // Get wrong options from same module if possible
  const sameModuleCards = allCards.filter((card) => card.module === correctCard.module && card.id !== correctCard.id)

  const otherCards = allCards.filter((card) => card.id !== correctCard.id)
  const pool = sameModuleCards.length >= count - 1 ? sameModuleCards : otherCards

  const wrongOptions = shuffleArray(pool)
    .slice(0, count - 1)
    .map((card) => ({ text: card.bangla, isCorrect: false }))

  const options = [...wrongOptions, { text: correctCard.bangla, isCorrect: true }]

  return shuffleArray(options)
}

export function normalizeArabicText(text: string): string {
  // Remove diacritics and normalize for comparison
  return text
    .replace(/[\u064B-\u065F]/g, "") // Remove Arabic diacritics
    .trim()
    .toLowerCase()
}

export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalized1 = normalizeArabicText(userAnswer)
  const normalized2 = normalizeArabicText(correctAnswer)
  return normalized1 === normalized2
}

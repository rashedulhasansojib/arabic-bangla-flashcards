// Initialize default data from JSON

import type { Card, Deck } from "./types"
import { getCards, setCards, setDecks } from "./storage"
import vocabularyData from "./vocabulary-data.json"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function initializeDefaultData(): void {
  const existingCards = getCards()
  // const existingDecks = getDecks()

  // Only initialize if no data exists
  if (existingCards.length > 0) return

  const cards: Card[] = []
  const decks: Deck[] = []

  // Process vocabulary data
  Object.entries(vocabularyData).forEach(([moduleName, moduleCards]) => {
    const deckId = generateId()
    const cardIds: string[] = []

    // Create cards for this module
    moduleCards.forEach((item: any) => {
      const cardId = generateId()
      const card: Card = {
        id: cardId,
        arabic: item.Arabic_Term || "",
        bangla: item.Bengali_Meaning || "",
        transliteration: item.Transliteration || "",
        module: moduleName,
        box: 1,
        lastReviewed: null,
        nextReview: null,
        correctCount: 0,
        incorrectCount: 0,
        createdAt: new Date().toISOString(),
      }
      cards.push(card)
      cardIds.push(cardId)
    })

    // Create deck for this module
    const deck: Deck = {
      id: deckId,
      name: moduleName,
      description: `${moduleCards.length} vocabulary items`,
      cardIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    decks.push(deck)
  })

  setCards(cards)
  setDecks(decks)
}

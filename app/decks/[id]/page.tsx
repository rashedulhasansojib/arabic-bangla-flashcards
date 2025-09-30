"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Play, Edit, Trash2 } from "lucide-react"
import { getDeck, getCards } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type { Deck, Card as FlashCard } from "@/lib/types"

export default function DeckDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<FlashCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBox, setFilterBox] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const deckId = params.id as string
    const loadedDeck = getDeck(deckId)

    if (!loadedDeck) {
      toast({
        title: "Deck not found",
        description: "The requested deck could not be found.",
        variant: "destructive",
      })
      router.push("/decks")
      return
    }

    const allCards = getCards()
    const deckCards = allCards.filter((card) => loadedDeck.cardIds.includes(card.id))

    setDeck(loadedDeck)
    setCards(deckCards)
    setIsLoading(false)
  }, [params.id, router, toast])

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.bangla.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBox = filterBox === "all" || card.box.toString() === filterBox

    return matchesSearch && matchesBox
  })

  const getBoxLabel = (box: number) => {
    const labels = {
      1: "New",
      2: "Learning",
      3: "Familiar",
      4: "Known",
      5: "Mastered",
    }
    return labels[box as keyof typeof labels] || "Unknown"
  }

  const getBoxColor = (box: number) => {
    const colors = {
      1: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
      2: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      3: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
      4: "bg-green-500/10 text-green-700 dark:text-green-400",
      5: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    }
    return colors[box as keyof typeof colors] || ""
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading deck...</p>
        </div>
      </div>
    )
  }

  if (!deck) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/decks")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Decks
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{deck.name}</h1>
            <p className="mt-2 text-muted-foreground">{deck.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Study Now
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterBox} onValueChange={setFilterBox}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by box" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Boxes</SelectItem>
            <SelectItem value="1">Box 1 - New</SelectItem>
            <SelectItem value="2">Box 2 - Learning</SelectItem>
            <SelectItem value="3">Box 3 - Familiar</SelectItem>
            <SelectItem value="4">Box 4 - Known</SelectItem>
            <SelectItem value="5">Box 5 - Mastered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        {[1, 2, 3, 4, 5].map((box) => {
          const count = cards.filter((c) => c.box === box).length
          return (
            <Card key={box}>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">{getBoxLabel(box)}</p>
                <p className="mt-1 text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Cards List */}
      {filteredCards.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center p-8 text-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No cards match your search" : "No cards in this deck"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <Card key={card.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="arabic-text text-xl font-bold" dir="rtl">
                          {card.arabic}
                        </p>
                        <span className="text-muted-foreground">→</span>
                        <p className="text-lg">{card.bangla}</p>
                      </div>
                      {card.transliteration && (
                        <p className="mt-1 text-sm text-muted-foreground">{card.transliteration}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getBoxColor(card.box)}>{getBoxLabel(card.box)}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

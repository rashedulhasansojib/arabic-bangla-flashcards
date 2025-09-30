"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  arabic: string
  bangla: string
  transliteration?: string
  showTransliteration: boolean
}

export function Flashcard({ arabic, bangla, transliteration, showTransliteration }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          "min-h-[300px] cursor-pointer border-2 transition-all hover:border-primary",
          isFlipped && "bg-primary/5",
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8">
          {!isFlipped ? (
            <div className="text-center">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Front</p>
              <p className="arabic-text text-5xl font-bold" dir="rtl">
                {arabic}
              </p>
              {showTransliteration && transliteration && (
                <p className="mt-4 text-lg text-muted-foreground">{transliteration}</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Back</p>
              <p className="text-3xl font-bold">{bangla}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={() => setIsFlipped(!isFlipped)}>
        <RotateCw className="mr-2 h-5 w-5" />
        Flip Card
      </Button>

      <p className="text-center text-sm text-muted-foreground">Click the card or button to flip</p>
    </div>
  )
}

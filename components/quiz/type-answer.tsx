"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TypeAnswerProps {
  question: string
  correctAnswer: string
  onSubmit: (answer: string) => void
  showResult: boolean
  isCorrect: boolean | null
}

export function TypeAnswer({ question, correctAnswer, onSubmit, showResult, isCorrect }: TypeAnswerProps) {
  const [answer, setAnswer] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.trim()) {
      onSubmit(answer)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Translate this word</p>
            <p className="arabic-text text-4xl font-bold" dir="rtl">
              {question}
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Type your answer in Bangla..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={showResult}
            className={cn(
              "h-14 text-lg",
              showResult && isCorrect && "border-green-500 bg-green-500/10",
              showResult && !isCorrect && "border-red-500 bg-red-500/10",
            )}
            autoFocus
          />
        </div>

        {showResult && (
          <Card className={cn(isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
            <CardContent className="p-4">
              <p className="text-sm font-medium">{isCorrect ? "Correct!" : "Incorrect"}</p>
              {!isCorrect && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Correct answer: <span className="font-semibold">{correctAnswer}</span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {!showResult && (
          <Button type="submit" size="lg" className="w-full" disabled={!answer.trim()}>
            Check Answer
          </Button>
        )}
      </form>
    </div>
  )
}

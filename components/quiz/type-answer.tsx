"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
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
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-2">
        <CardContent className="p-4 sm:p-8">
          <div className="text-center">
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-foreground/80 uppercase tracking-wide">Translate this word</p>
            <p className="arabic-text text-2xl sm:text-4xl font-bold text-foreground" dir="rtl">
              {question}
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Type your answer in Bangla..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={showResult}
            className={cn(
              "h-12 sm:h-14 text-base sm:text-lg border-2 transition-all duration-300 touch-manipulation",
              !showResult && "border-border focus:border-primary",
              showResult && isCorrect && "border-green-600 bg-green-600/20 text-green-800 dark:text-green-300",
              showResult && !isCorrect && "border-red-600 bg-red-600/20 text-red-800 dark:text-red-300",
            )}
            autoFocus
          />
          {showResult && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
          )}
        </div>

        {showResult && (
          <Card className={cn(
            "border-2 transition-all duration-300",
            isCorrect 
              ? "border-green-600 bg-green-600/20 shadow-lg" 
              : "border-red-600 bg-red-600/20 shadow-lg"
          )}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={cn(
                    "text-lg font-semibold",
                    isCorrect ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
                  )}>
                    {isCorrect ? "Correct! 🎉" : "Incorrect"}
                  </p>
                  {!isCorrect && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Correct answer:
                          </p>
                          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mt-1">
                            {correctAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!showResult && (
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 sm:h-auto text-base font-semibold transition-all duration-300 hover:scale-[1.02] touch-manipulation" 
            disabled={!answer.trim()}
          >
            Check Answer
          </Button>
        )}
      </form>
    </div>
  )
}

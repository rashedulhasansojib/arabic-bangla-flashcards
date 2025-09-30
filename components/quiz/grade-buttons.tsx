"use client"

import { Button } from "@/components/ui/button"
import type { QuizGrade } from "@/lib/types"

interface GradeButtonsProps {
  onGrade: (grade: QuizGrade) => void
  disabled?: boolean
}

export function GradeButtons({ onGrade, disabled }: GradeButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("again")}
        disabled={disabled}
        className="h-auto flex-col gap-1 py-4 hover:border-red-500 hover:bg-red-500/10"
      >
        <span className="text-lg font-bold">Again</span>
        <span className="text-xs text-muted-foreground">1 day</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("hard")}
        disabled={disabled}
        className="h-auto flex-col gap-1 py-4 hover:border-yellow-500 hover:bg-yellow-500/10"
      >
        <span className="text-lg font-bold">Hard</span>
        <span className="text-xs text-muted-foreground">3 days</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("good")}
        disabled={disabled}
        className="h-auto flex-col gap-1 py-4 hover:border-green-500 hover:bg-green-500/10"
      >
        <span className="text-lg font-bold">Good</span>
        <span className="text-xs text-muted-foreground">7 days</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("easy")}
        disabled={disabled}
        className="h-auto flex-col gap-1 py-4 hover:border-blue-500 hover:bg-blue-500/10"
      >
        <span className="text-lg font-bold">Easy</span>
        <span className="text-xs text-muted-foreground">14 days</span>
      </Button>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, Clock, CheckCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizGrade } from "@/lib/types"

interface GradeButtonsProps {
  onGrade: (grade: QuizGrade) => void
  disabled?: boolean
}

export function GradeButtons({ onGrade, disabled }: GradeButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("again")}
        disabled={disabled}
        className={cn(
          "h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px]",
          "hover:border-red-600 hover:bg-red-600/20 hover:scale-[1.02] hover:shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
        <span className="text-sm sm:text-base font-bold text-foreground">Again</span>
        <span className="text-xs text-foreground/70 font-medium">1 day</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("hard")}
        disabled={disabled}
        className={cn(
          "h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px]",
          "hover:border-orange-600 hover:bg-orange-600/20 hover:scale-[1.02] hover:shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
        <span className="text-sm sm:text-base font-bold text-foreground">Hard</span>
        <span className="text-xs text-foreground/70 font-medium">3 days</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("good")}
        disabled={disabled}
        className={cn(
          "h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px]",
          "hover:border-green-600 hover:bg-green-600/20 hover:scale-[1.02] hover:shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
        <span className="text-sm sm:text-base font-bold text-foreground">Good</span>
        <span className="text-xs text-foreground/70 font-medium">7 days</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade("easy")}
        disabled={disabled}
        className={cn(
          "h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px]",
          "hover:border-blue-600 hover:bg-blue-600/20 hover:scale-[1.02] hover:shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        <span className="text-sm sm:text-base font-bold text-foreground">Easy</span>
        <span className="text-xs text-foreground/70 font-medium">14 days</span>
      </Button>
    </div>
  )
}

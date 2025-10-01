'use client';

import { Button } from '@/components/ui/button';
import type { QuizGrade } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, RotateCcw, Zap } from 'lucide-react';

interface GradeButtonsProps {
	onGrade: (grade: QuizGrade) => void;
	disabled?: boolean;
}

export function GradeButtons({ onGrade, disabled }: GradeButtonsProps) {
	return (
		<div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
			<Button
				variant="outline"
				size="lg"
				onClick={() => onGrade('again')}
				disabled={disabled}
				className={cn(
					'h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px] group-grade',
					'border-red-200 bg-red-50/50 hover:border-red-600 hover:bg-red-600/20 hover:scale-[1.02] hover:shadow-lg',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
				)}
			>
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 group-grade-hover:bg-red-200 transition-all duration-300 group-grade-hover:scale-110">
					<RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 group-grade-hover:text-red-700 transition-colors duration-300" />
				</div>
				<span className="text-sm sm:text-base font-bold text-foreground group-grade-hover:text-red-700 transition-colors duration-300">
					Again
				</span>
				<span className="text-xs text-foreground/70 font-medium group-grade-hover:text-red-600/80 transition-colors duration-300">
					1 day
				</span>
			</Button>

			<Button
				variant="outline"
				size="lg"
				onClick={() => onGrade('hard')}
				disabled={disabled}
				className={cn(
					'h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px] group-grade',
					'border-orange-200 bg-orange-50/50 hover:border-orange-600 hover:bg-orange-600/20 hover:scale-[1.02] hover:shadow-lg',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
				)}
			>
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 group-grade-hover:bg-orange-200 transition-all duration-300 group-grade-hover:scale-110">
					<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 group-grade-hover:text-orange-700 transition-colors duration-300" />
				</div>
				<span className="text-sm sm:text-base font-bold text-foreground group-grade-hover:text-orange-700 transition-colors duration-300">
					Hard
				</span>
				<span className="text-xs text-foreground/70 font-medium group-grade-hover:text-orange-600/80 transition-colors duration-300">
					3 days
				</span>
			</Button>

			<Button
				variant="outline"
				size="lg"
				onClick={() => onGrade('good')}
				disabled={disabled}
				className={cn(
					'h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px] group-grade',
					'border-green-200 bg-green-50/50 hover:border-green-600 hover:bg-green-600/20 hover:scale-[1.02] hover:shadow-lg',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
				)}
			>
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 group-grade-hover:bg-green-200 transition-all duration-300 group-grade-hover:scale-110">
					<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 group-grade-hover:text-green-700 transition-colors duration-300" />
				</div>
				<span className="text-sm sm:text-base font-bold text-foreground group-grade-hover:text-green-700 transition-colors duration-300">
					Good
				</span>
				<span className="text-xs text-foreground/70 font-medium group-grade-hover:text-green-600/80 transition-colors duration-300">
					7 days
				</span>
			</Button>

			<Button
				variant="outline"
				size="lg"
				onClick={() => onGrade('easy')}
				disabled={disabled}
				className={cn(
					'h-auto flex-col gap-1 sm:gap-2 py-3 sm:py-4 border-2 transition-all duration-300 touch-manipulation min-h-[60px] group-grade',
					'border-blue-200 bg-blue-50/50 hover:border-blue-600 hover:bg-blue-600/20 hover:scale-[1.02] hover:shadow-lg',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
				)}
			>
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 group-grade-hover:bg-blue-200 transition-all duration-300 group-grade-hover:scale-110">
					<Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 group-grade-hover:text-blue-700 transition-colors duration-300" />
				</div>
				<span className="text-sm sm:text-base font-bold text-foreground group-grade-hover:text-blue-700 transition-colors duration-300">
					Easy
				</span>
				<span className="text-xs text-foreground/70 font-medium group-grade-hover:text-blue-600/80 transition-colors duration-300">
					14 days
				</span>
			</Button>
		</div>
	);
}

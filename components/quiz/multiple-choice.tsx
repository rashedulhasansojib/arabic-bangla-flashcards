'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface MultipleChoiceProps {
	question: string;
	options: { text: string; isCorrect: boolean }[];
	selectedAnswer: number | null;
	onSelectAnswer: (index: number) => void;
	showResult: boolean;
	isChecking?: boolean;
}

export function MultipleChoice({
	question,
	options,
	selectedAnswer,
	onSelectAnswer,
	showResult,
	isChecking = false,
}: MultipleChoiceProps) {
	return (
		<div className="space-y-4 sm:space-y-6">
			<Card className="border-2 group hover:shadow-lg transition-all duration-300">
				<CardContent className="p-4 sm:p-8">
					<div className="text-center">
						<p className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-foreground/80 uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
							নিচের আরবি শব্দটির অর্থ কী?
						</p>
						<p
							className="arabic-text text-2xl sm:text-4xl font-bold text-foreground group-hover:drop-shadow-lg transition-all duration-300"
							dir="rtl"
						>
							{question}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-2 sm:gap-3">
				{options.map((option, index) => {
					const isSelected = selectedAnswer === index;
					const isCorrect = option.isCorrect;
					const showCorrect = showResult && isCorrect;
					const showIncorrect = showResult && isSelected && !isCorrect;

					return (
						<Button
							key={index}
							variant="outline"
							size="lg"
							className={cn(
								'h-auto justify-start py-3 sm:py-4 text-left text-sm sm:text-base transition-all duration-300 border-2 touch-manipulation min-h-[48px] group-option',
								// Default state
								!showResult &&
									!isSelected &&
									'border-border hover:border-primary/50 hover:bg-accent/50 hover:shadow-md hover:scale-[1.01]',
								// Selected state (before result)
								isSelected &&
									!showResult &&
									'border-primary bg-primary/15 scale-[1.02] shadow-lg animate-pulse',
								// Correct answer (always show when result is shown)
								showCorrect &&
									'border-green-600 bg-green-600/20 text-green-800 dark:text-green-300 shadow-xl scale-[1.02] animate-bounce',
								// Incorrect selected answer
								showIncorrect &&
									'border-red-600 bg-red-600/20 text-red-800 dark:text-red-300 shadow-xl scale-[1.02] animate-shake',
								// Disabled state
								(showResult || isChecking) &&
									!showCorrect &&
									!showIncorrect &&
									'opacity-60'
							)}
							onClick={() =>
								!showResult && !isChecking && onSelectAnswer(index)
							}
							disabled={showResult || isChecking}
						>
							<span
								className={cn(
									'mr-3 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 group-option-hover:scale-110',
									// Default state
									!showResult &&
										!isSelected &&
										'border-border bg-background group-option-hover:border-primary group-option-hover:bg-primary/10',
									// Selected state (before result)
									isSelected &&
										!showResult &&
										'border-primary bg-primary text-primary-foreground animate-pulse',
									// Correct answer
									showCorrect &&
										'border-green-600 bg-green-600 text-white animate-bounce',
									// Incorrect answer
									showIncorrect &&
										'border-red-600 bg-red-600 text-white animate-shake'
								)}
							>
								{showCorrect && (
									<CheckCircle className="h-4 w-4 animate-pulse" />
								)}
								{showIncorrect && <XCircle className="h-4 w-4 animate-pulse" />}
								{!showResult &&
									!showCorrect &&
									!showIncorrect &&
									String.fromCharCode(65 + index)}
							</span>
							<span
								className={cn(
									'transition-all duration-300 group-option-hover:font-semibold',
									showCorrect && 'font-bold animate-pulse',
									showIncorrect && 'font-bold'
								)}
							>
								{option.text}
							</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
}

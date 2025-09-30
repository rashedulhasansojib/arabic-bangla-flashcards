'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
		<div className="space-y-6">
			<Card className="border-2">
				<CardContent className="p-8">
					<div className="text-center">
						<p className="mb-4 text-sm font-medium text-muted-foreground">
							নিচের আরবি শব্দটির অর্থ কী?
						</p>
						<p className="arabic-text text-4xl font-bold" dir="rtl">
							{question}
						</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-3">
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
								'h-auto justify-start py-4 text-left text-base transition-all duration-200',
								isSelected &&
									!showResult &&
									'border-primary bg-primary/10 scale-[1.02]',
								showCorrect &&
									'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
								showIncorrect &&
									'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
							)}
							onClick={() =>
								!showResult && !isChecking && onSelectAnswer(index)
							}
							disabled={showResult || isChecking}
						>
							<span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold">
								{String.fromCharCode(65 + index)}
							</span>
							{option.text}
						</Button>
					);
				})}
			</div>
		</div>
	);
}

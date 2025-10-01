'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';

interface FlashcardProps {
	arabic: string;
	bangla: string;
	transliteration?: string;
	showTransliteration: boolean;
}

export function Flashcard({
	arabic,
	bangla,
	transliteration,
	showTransliteration,
}: FlashcardProps) {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<div className="space-y-4">
			<Card
				className={cn(
					'min-h-[250px] sm:min-h-[300px] cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg touch-manipulation bg-card shadow-sm',
					isFlipped && 'bg-primary/15 border-primary shadow-lg'
				)}
				onClick={() => setIsFlipped(!isFlipped)}
			>
				<CardContent className="flex min-h-[250px] sm:min-h-[300px] flex-col items-center justify-center p-4 sm:p-8">
					{!isFlipped ? (
						<div className="text-center">
							<p className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide">
								Front
							</p>
							<p
								className="arabic-text text-3xl sm:text-5xl font-black text-foreground drop-shadow-sm"
								dir="rtl"
							>
								{arabic}
							</p>
							{showTransliteration && transliteration && (
								<p className="mt-3 sm:mt-4 text-base sm:text-lg text-foreground font-semibold">
									{transliteration}
								</p>
							)}
						</div>
					) : (
						<div className="text-center">
							<p className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide">
								Back
							</p>
							<p className="text-2xl sm:text-3xl font-black text-foreground drop-shadow-sm">
								{bangla}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Button
				variant="outline"
				size="lg"
				className="w-full h-12 sm:h-auto bg-background hover:bg-accent border-2 hover:border-primary transition-all touch-manipulation shadow-sm"
				onClick={() => setIsFlipped(!isFlipped)}
			>
				<RotateCw className="mr-2 h-5 w-5" />
				<span className="text-base font-bold">Flip Card</span>
			</Button>

			<p className="text-center text-xs sm:text-sm text-foreground font-semibold">
				Tap the card or button to flip
			</p>
		</div>
	);
}

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
	isFlipped?: boolean;
	onFlip?: (flipped: boolean) => void;
}

export function Flashcard({
	arabic,
	bangla,
	transliteration,
	showTransliteration,
	isFlipped: externalIsFlipped,
	onFlip,
}: FlashcardProps) {
	const [internalIsFlipped, setInternalIsFlipped] = useState(false);

	// Use external state if provided, otherwise use internal state
	const isFlipped =
		externalIsFlipped !== undefined ? externalIsFlipped : internalIsFlipped;

	const handleFlip = () => {
		const newFlipped = !isFlipped;
		if (onFlip) {
			onFlip(newFlipped);
		} else {
			setInternalIsFlipped(newFlipped);
		}
	};

	return (
		<div className="space-y-4">
			<Card
				className={cn(
					'min-h-[250px] sm:min-h-[300px] cursor-pointer border-2 transition-all duration-500 hover:border-primary hover:shadow-xl touch-manipulation bg-card shadow-lg group',
					isFlipped &&
						'bg-gradient-to-br from-primary/15 to-primary/5 border-primary shadow-2xl'
				)}
				onClick={handleFlip}
			>
				<CardContent className="flex min-h-[250px] sm:min-h-[300px] flex-col items-center justify-center p-4 sm:p-8">
					{!isFlipped ? (
						<div className="text-center transform-gpu transition-all duration-500 group-hover:scale-105">
							<p className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
								Front
							</p>
							<p
								className="arabic-text text-3xl sm:text-5xl font-black text-foreground drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
								dir="rtl"
							>
								{arabic}
							</p>
							{showTransliteration && transliteration && (
								<p className="mt-3 sm:mt-4 text-base sm:text-lg text-foreground font-semibold group-hover:text-primary/80 transition-colors duration-300">
									{transliteration}
								</p>
							)}
						</div>
					) : (
						<div className="text-center transform-gpu transition-all duration-500 group-hover:scale-105">
							<p className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
								Back
							</p>
							<p className="text-2xl sm:text-3xl font-black text-foreground drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300">
								{bangla}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Button
				variant="outline"
				size="lg"
				className="w-full h-12 sm:h-auto bg-background hover:bg-accent border-2 hover:border-primary transition-all duration-300 touch-manipulation shadow-sm hover:shadow-md hover:scale-[1.02] group"
				onClick={handleFlip}
			>
				<RotateCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
				<span className="text-base font-bold">Flip Card</span>
			</Button>

			<p className="text-center text-xs sm:text-sm text-foreground font-semibold">
				Tap the card or button to flip
			</p>
		</div>
	);
}

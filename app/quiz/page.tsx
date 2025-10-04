'use client';

import { Flashcard } from '@/components/quiz/flashcard';
import { GradeButtons } from '@/components/quiz/grade-buttons';
import { MultipleChoice } from '@/components/quiz/multiple-choice';
import { TypeAnswer } from '@/components/quiz/type-answer';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { checkAnswer, generateMultipleChoiceOptions } from '@/lib/quiz-utils';
import { getSessionCards, gradeCard } from '@/lib/spaced-repetition';
import {
	addSession,
	getCards,
	getDeck,
	getProgress,
	getSettings,
	setProgress,
	updateStreak,
} from '@/lib/storage';
import type { Card as FlashCard, QuizGrade } from '@/lib/types';
import { ArrowRight, Check, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuizPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [cards, setCards] = useState<FlashCard[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	// const [typedAnswer, setTypedAnswer] = useState('');
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [quizMode, setQuizMode] = useState<
		'multiple-choice' | 'type-answer' | 'flashcard'
	>('multiple-choice');
	const [showTransliteration, setShowTransliteration] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
	const [isChecking, setIsChecking] = useState(false);
	const [currentOptions, setCurrentOptions] = useState<
		{ text: string; isCorrect: boolean }[]
	>([]);
	const [sessionAnswers, setSessionAnswers] = useState<
		{
			cardId: string;
			correct: boolean;
			timeSpent: number;
		}[]
	>([]);
	const [answerStartTime, setAnswerStartTime] = useState<Date | null>(null);
	const [isFlipped, setIsFlipped] = useState(false);

	// Helper function to handle redirects based on query parameters
	const handleRedirect = () => {
		const returnTo = searchParams.get('returnTo');
		const deckId = searchParams.get('deckId');

		if (returnTo === 'deck' && deckId) {
			router.push(`/decks/${deckId}`);
		} else if (returnTo === 'decks') {
			router.push('/decks');
		} else {
			router.push('/');
		}
	};

	useEffect(() => {
		const settings = getSettings();
		const allCards = getCards();
		const deckId = searchParams.get('deckId');

		let sessionCards;

		if (deckId) {
			// Study specific deck - get deck and filter cards
			const deck = getDeck(deckId);
			if (!deck) {
				toast({
					title: 'Deck not found',
					description: 'The requested deck could not be found.',
				});
				handleRedirect();
				return;
			}

			// Filter cards to only include those in this deck
			const deckCards = allCards.filter(card => deck.cardIds.includes(card.id));
			sessionCards = getSessionCards(deckCards, settings.cardsPerSession);
		} else {
			// Study all cards - use the new session composition logic that follows PRD priority order
			sessionCards = getSessionCards(allCards, settings.cardsPerSession);
		}

		if (sessionCards.length === 0) {
			toast({
				title: 'No words due',
				description: 'Great job! Come back later for more reviews.',
			});
			handleRedirect();
			return;
		}

		setCards(sessionCards);
		setQuizMode(settings.quizMode);
		setShowTransliteration(settings.showTransliteration);
		setSessionStartTime(new Date());
		setIsLoading(false);
	}, [router, toast, searchParams]);

	const currentCard = cards[currentIndex];
	const progressPercent =
		cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

	// Generate options when card changes
	useEffect(() => {
		if (currentCard && quizMode === 'multiple-choice') {
			const allCards = getCards();
			const options = generateMultipleChoiceOptions(currentCard, allCards);
			setCurrentOptions(options);
		}
		// Set answer start time when card changes
		setAnswerStartTime(new Date());
	}, [currentCard, quizMode]);

	const handleMultipleChoiceAnswer = (index: number) => {
		setSelectedAnswer(index);
		setIsChecking(true);

		// Use the pre-generated options instead of regenerating them
		const correct = currentOptions[index]?.isCorrect || false;
		setIsCorrect(correct);

		// Record the answer with timing
		if (currentCard && answerStartTime) {
			const timeSpent = Date.now() - answerStartTime.getTime();
			setSessionAnswers((prev) => [
				...prev,
				{
					cardId: currentCard.id,
					correct,
					timeSpent,
				},
			]);
		}

		// Show result with a slight delay for better UX
		setTimeout(() => {
			setIsChecking(false);
			setShowResult(true);

			if (correct) {
				setCorrectCount((prev) => prev + 1);
			} else {
				setIncorrectCount((prev) => prev + 1);
			}
		}, 800); // 800ms delay to show selection and processing
	};

	const handleTypeAnswer = (answer: string) => {
		setIsChecking(true);

		const correct = checkAnswer(answer, currentCard.bangla);
		setIsCorrect(correct);

		// Record the answer with timing
		if (currentCard && answerStartTime) {
			const timeSpent = Date.now() - answerStartTime.getTime();
			setSessionAnswers((prev) => [
				...prev,
				{
					cardId: currentCard.id,
					correct,
					timeSpent,
				},
			]);
		}

		// Show result with a slight delay for better UX
		setTimeout(() => {
			setIsChecking(false);
			setShowResult(true);

			if (correct) {
				setCorrectCount((prev) => prev + 1);
			} else {
				setIncorrectCount((prev) => prev + 1);
			}
		}, 800); // 800ms delay to show selection and processing
	};

	const handleGrade = (grade: QuizGrade) => {
		gradeCard(currentCard, grade);

		// Update progress and streak
		const progress = getProgress();
		setProgress({
			...progress,
			totalReviews: progress.totalReviews + 1,
		});

		// Update streak tracking
		updateStreak();

		handleNext();
	};

	const handleNext = () => {
		if (currentIndex < cards.length - 1) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedAnswer(null);
			// setTypedAnswer('');
			setShowResult(false);
			setIsCorrect(null);
			setIsChecking(false);
			setCurrentOptions([]); // Reset options for next question
			setAnswerStartTime(new Date()); // Reset answer start time
			setIsFlipped(false); // Reset flashcard flip state
		} else {
			// Quiz complete - save session
			if (sessionStartTime) {
				const session = {
					id: Date.now().toString(),
					cards: cards,
					currentIndex: cards.length - 1,
					answers: sessionAnswers, // Use the recorded answers
					startedAt: sessionStartTime.toISOString(),
					completedAt: new Date().toISOString(),
				};
				addSession(session);
			}

			toast({
				title: 'Quiz Complete!',
				description: `You got ${correctCount} correct out of ${cards.length} words.`,
			});

			// Redirect back to the appropriate page
			handleRedirect();
		}
	};

	const handleContinue = () => {
		if (quizMode === 'flashcard') {
			// For flashcard mode, don't auto-grade
			return;
		}

		// Auto-grade based on correctness
		const grade: QuizGrade = isCorrect ? 'good' : 'again';
		handleGrade(grade);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="mt-4 text-sm text-muted-foreground">
						Preparing your quiz...
					</p>
				</div>
			</div>
		);
	}

	if (!currentCard) {
		return null;
	}

	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			{/* Header */}
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="group relative bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-300/60 text-red-600 hover:from-red-500/20 hover:to-red-600/20 hover:text-red-700 hover:border-red-400/80 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-pulse backdrop-blur-sm"
								title="Exit Quiz - Return to Home"
							>
								<X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
								<span className="ml-1 text-xs font-medium">Exit</span>
								<span className="sr-only">Exit Quiz</span>
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to exit the quiz? Your progress will be
									saved, but you'll need to start over to continue studying.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Continue Quiz</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleRedirect}
									className="bg-red-600 hover:bg-red-700 text-white"
								>
									Exit Quiz
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<div>
						<p className="text-sm font-medium">
							Word {currentIndex + 1} of {cards.length}
						</p>
						<p className="text-xs text-muted-foreground">
							{currentCard.module}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Check className="h-4 w-4 text-green-600" />
						<span className="text-sm font-medium">{correctCount}</span>
					</div>
					<div className="flex items-center gap-2">
						<X className="h-4 w-4 text-red-600" />
						<span className="text-sm font-medium">{incorrectCount}</span>
					</div>
				</div>
			</div>

			{/* Progress Bar */}
			<Progress value={progressPercent} className="mb-8" />

			{/* Checking Indicator */}
			{isChecking && (
				<div className="mb-6 flex items-center justify-center gap-2 text-primary">
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
					<span className="text-sm font-medium">Checking your answer...</span>
				</div>
			)}

			{/* Quiz Content */}
			{quizMode === 'multiple-choice' && (
				<MultipleChoice
					question={currentCard.arabic}
					options={currentOptions}
					selectedAnswer={selectedAnswer}
					onSelectAnswer={handleMultipleChoiceAnswer}
					showResult={showResult}
					isChecking={isChecking}
				/>
			)}

			{quizMode === 'type-answer' && (
				<TypeAnswer
					question={currentCard.arabic}
					correctAnswer={currentCard.bangla}
					onSubmit={handleTypeAnswer}
					showResult={showResult}
					isCorrect={isCorrect}
				/>
			)}

			{quizMode === 'flashcard' && (
				<Flashcard
					arabic={currentCard.arabic}
					bangla={currentCard.bangla}
					transliteration={currentCard.transliteration}
					showTransliteration={showTransliteration}
					isFlipped={isFlipped}
					onFlip={setIsFlipped}
				/>
			)}

			{/* Action Buttons */}
			<div className="mt-8">
				{quizMode === 'flashcard' ? (
					<GradeButtons onGrade={handleGrade} />
				) : (
					showResult && (
						<Button size="lg" className="w-full" onClick={handleContinue}>
							Next Question
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					)
				)}
			</div>

			{/* Keyboard Shortcuts Hint */}
			{quizMode === 'flashcard' && (
				<Card className="mt-6 border-dashed">
					<CardContent className="p-4">
						<p className="text-center text-xs text-muted-foreground">
							Rate your recall: 1 (Again) • 2 (Hard) • 3 (Good) • 4 (Easy)
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

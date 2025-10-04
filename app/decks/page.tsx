'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getDueCards, getSessionCards } from '@/lib/spaced-repetition';
import { getCards, getDecks, setDecks } from '@/lib/storage';
import type { Deck, Card as FlashCard } from '@/lib/types';
import { BookOpen, Edit, Play, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DecksPage() {
	const { toast } = useToast();
	const [decks, setDecksState] = useState<Deck[]>([]);
	const [cards, setCards] = useState<FlashCard[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadedDecks = getDecks();
		const loadedCards = getCards();
		setDecksState(loadedDecks);
		setCards(loadedCards);
		setIsLoading(false);
	}, []);

	const getDeckStats = (deck: Deck) => {
		const deckCards = cards.filter((card) => deck.cardIds.includes(card.id));
		const dueCards = getDueCards(deckCards);
		const masteredCards = deckCards.filter((card) => card.box === 5);

		// Box distribution for Leitner System
		const boxDistribution = {
			new: deckCards.filter((card) => card.box === 1).length,
			learning: deckCards.filter((card) => card.box === 2).length,
			familiar: deckCards.filter((card) => card.box === 3).length,
			known: deckCards.filter((card) => card.box === 4).length,
			mastered: deckCards.filter((card) => card.box === 5).length,
		};

		// Calculate next review info
		const now = new Date();
		const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const nextReviewCards = deckCards.filter((card) => {
			if (!card.nextReview) return false;
			const reviewDate = new Date(card.nextReview);
			return reviewDate <= tomorrow;
		});

		// Calculate activity streak (simplified - based on last review)
		const lastReviewDates = deckCards
			.filter((card) => card.lastReviewed)
			.map((card) => new Date(card.lastReviewed!))
			.sort((a, b) => b.getTime() - a.getTime());

		const lastActivity = lastReviewDates.length > 0 ? lastReviewDates[0] : null;
		const daysSinceActivity = lastActivity
			? Math.floor(
					(now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000)
			  )
			: null;

		return {
			total: deckCards.length,
			due: dueCards.length,
			mastered: masteredCards.length,
			boxDistribution,
			nextReview: nextReviewCards.length,
			lastActivity: daysSinceActivity,
		};
	};

	const getSessionCardsForDeck = (deck: Deck) => {
		const deckCards = cards.filter((card) => deck.cardIds.includes(card.id));
		return getSessionCards(deckCards, 10);
	};

	const handleDeleteDeck = (deckId: string) => {
		if (confirm('Are you sure you want to delete this deck?')) {
			const updatedDecks = decks.filter((d) => d.id !== deckId);
			setDecks(updatedDecks);
			setDecksState(updatedDecks);
			toast({
				title: 'Deck deleted',
				description: 'The deck has been removed from your collection.',
			});
		}
	};

	const handleCreateDeck = () => {
		const deckName = prompt('Enter deck name:');
		if (!deckName || !deckName.trim()) return;

		const deckDescription = prompt('Enter deck description (optional):') || '';

		const newDeck: Deck = {
			id: Date.now().toString(),
			name: deckName.trim(),
			description: deckDescription.trim(),
			cardIds: [],
			createdAt: new Date().toISOString(),
			updatedAt: '',
		};

		const updatedDecks = [...decks, newDeck];
		setDecks(updatedDecks);
		setDecksState(updatedDecks);

		toast({
			title: 'Deck created',
			description: `"${deckName}" has been added to your collection.`,
		});
	};

	const filteredDecks = decks.filter((deck) =>
		deck.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (isLoading) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="mt-4 text-sm text-muted-foreground">Loading decks...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="mb-8 relative overflow-hidden">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />

				{/* Floating elements */}
				<div className="absolute top-2 right-4 w-1 h-1 bg-primary/30 rounded-full animate-pulse" />
				<div className="absolute top-6 right-8 w-1.5 h-1.5 bg-accent/20 rounded-full animate-pulse delay-500" />
				<div className="absolute bottom-2 left-6 w-1 h-1 bg-primary/25 rounded-full animate-pulse delay-1000" />

				<div className="relative">
					<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
						Your Decks
					</h1>
					<p className="mt-2 text-muted-foreground max-w-2xl">
						Browse and manage your vocabulary collections
					</p>

					{/* Deck indicators */}
					<div className="mt-4 flex flex-wrap gap-2">
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
							<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
							Vocabulary Collections
						</div>
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full text-xs font-medium text-green-600">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-500" />
							Progress Tracking
						</div>
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full text-xs font-medium text-blue-600">
							<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000" />
							Smart Search
						</div>
					</div>
				</div>
			</div>

			{/* Search and Actions */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1 sm:max-w-md group-search">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-search-hover:text-primary transition-colors duration-300" />
					<Input
						type="text"
						placeholder="Search decks..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 group-search-input hover:border-primary/50 focus:border-primary focus:shadow-lg transition-all duration-300 hover:scale-[1.01] focus:scale-[1.01]"
					/>
					{searchQuery && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2">
							<div className="flex items-center gap-1">
								<span className="text-xs text-muted-foreground">
									{filteredDecks.length} result
									{filteredDecks.length !== 1 ? 's' : ''}
								</span>
								<div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
							</div>
						</div>
					)}
				</div>
				<Button
					className="group-create hover:scale-105 transition-all duration-300 hover:shadow-lg"
					onClick={handleCreateDeck}
				>
					<Plus className="mr-2 h-4 w-4 group-create-hover:rotate-90 transition-transform duration-300" />
					Create Deck
				</Button>
			</div>

			{/* Decks Grid */}
			{filteredDecks.length === 0 ? (
				<Card>
					<CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
						<BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 text-lg font-semibold">No decks found</h3>
						<p className="mb-4 text-sm text-muted-foreground">
							{searchQuery
								? 'Try a different search term'
								: 'Create your first deck to get started'}
						</p>
						{!searchQuery && (
							<Button onClick={handleCreateDeck}>
								<Plus className="mr-2 h-4 w-4" />
								Create Deck
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredDecks.map((deck, index) => {
						const stats = getDeckStats(deck);
						const sessionCards = getSessionCardsForDeck(deck);
						const completionRate =
							stats.total > 0
								? Math.round((stats.mastered / stats.total) * 100)
								: 0;
						return (
							<Card
								key={deck.id}
								className="flex flex-col hover:shadow-lg transition-all duration-300 border group-deck hover:scale-[1.02] hover:border-primary/20"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="line-clamp-1">
												{deck.name}
											</CardTitle>
											<CardDescription className="mt-1 line-clamp-2">
												{deck.description}
											</CardDescription>
										</div>
										<div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:text-destructive"
												onClick={() => handleDeleteDeck(deck.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent className="flex-1">
									<div className="space-y-4">
										{/* Progress Bar */}
										<div className="space-y-3 p-4 rounded-lg bg-muted/50 border group-progress hover:bg-muted/70 transition-all duration-300">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-primary rounded-full animate-pulse group-progress-hover:scale-110 transition-transform duration-300" />
													<span className="text-sm font-semibold text-foreground group-progress-hover:text-primary transition-colors duration-300">
														Learning Progress
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-lg font-black text-primary group-progress-hover:scale-110 transition-transform duration-300">
														{completionRate}%
													</span>
													{completionRate === 100 && (
														<div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
															<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
														</div>
													)}
												</div>
											</div>
											<div className="w-full bg-muted rounded-full h-3 overflow-hidden group-progress-hover:bg-muted/80 transition-colors duration-300">
												<div
													className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 h-3 rounded-full transition-all duration-700 ease-out group-progress-hover:shadow-lg relative"
													style={{ width: `${completionRate}%` }}
												>
													<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
												</div>
											</div>
											<div className="flex items-center justify-between text-xs text-muted-foreground group-progress-hover:text-foreground/80 transition-colors duration-300">
												<span>Started</span>
												<span className="font-medium">
													{stats.mastered} of {stats.total} mastered
												</span>
												<span>Complete</span>
											</div>
										</div>

										{/* Leitner Box Distribution */}
										<div className="space-y-3 group-boxes">
											<div className="flex items-center justify-between">
												<h4 className="text-sm font-semibold text-foreground group-boxes-hover:text-primary transition-colors duration-300">
													Learning Journey
												</h4>
												<span className="text-xs text-muted-foreground group-boxes-hover:text-foreground/80 transition-colors duration-300">
													Leitner Box System
												</span>
											</div>
											<div className="grid grid-cols-5 gap-2">
												{/* Box 1 - New */}
												<div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 group-box hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-950/50">
													<div className="text-lg font-bold text-blue-700 dark:text-blue-300 group-box-hover:scale-110 transition-transform duration-300">
														{stats.boxDistribution.new}
													</div>
													<div className="text-xs text-blue-600 dark:text-blue-400 font-medium group-box-hover:text-blue-800 dark:group-box-hover:text-blue-200 transition-colors duration-300">
														New
													</div>
												</div>

												{/* Box 2 - Learning */}
												<div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 group-box hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-yellow-950/50">
													<div className="text-lg font-bold text-yellow-700 dark:text-yellow-300 group-box-hover:scale-110 transition-transform duration-300">
														{stats.boxDistribution.learning}
													</div>
													<div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium group-box-hover:text-yellow-800 dark:group-box-hover:text-yellow-200 transition-colors duration-300">
														Learning
													</div>
												</div>

												{/* Box 3 - Familiar */}
												<div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 group-box hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-orange-100 dark:hover:bg-orange-950/50">
													<div className="text-lg font-bold text-orange-700 dark:text-orange-300 group-box-hover:scale-110 transition-transform duration-300">
														{stats.boxDistribution.familiar}
													</div>
													<div className="text-xs text-orange-600 dark:text-orange-400 font-medium group-box-hover:text-orange-800 dark:group-box-hover:text-orange-200 transition-colors duration-300">
														Familiar
													</div>
												</div>

												{/* Box 4 - Known */}
												<div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 group-box hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-950/50">
													<div className="text-lg font-bold text-green-700 dark:text-green-300 group-box-hover:scale-110 transition-transform duration-300">
														{stats.boxDistribution.known}
													</div>
													<div className="text-xs text-green-600 dark:text-green-400 font-medium group-box-hover:text-green-800 dark:group-box-hover:text-green-200 transition-colors duration-300">
														Known
													</div>
												</div>

												{/* Box 5 - Mastered */}
												<div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 group-box hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50">
													<div className="text-lg font-bold text-emerald-700 dark:text-emerald-300 group-box-hover:scale-110 transition-transform duration-300">
														{stats.boxDistribution.mastered}
													</div>
													<div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium group-box-hover:text-emerald-800 dark:group-box-hover:text-emerald-200 transition-colors duration-300">
														Mastered
													</div>
												</div>
											</div>
										</div>

										{/* Review Status & Activity */}
										<div className="grid grid-cols-2 gap-3">
											{/* Next Review */}
											<div className="text-center p-3 rounded-lg bg-muted/30 border group-review hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-muted/50">
												<div className="text-xl font-bold text-foreground mb-1 group-review-hover:scale-110 transition-transform duration-300">
													{stats.nextReview}
												</div>
												<div className="text-xs font-semibold text-muted-foreground group-review-hover:text-foreground/80 transition-colors duration-300">
													{stats.nextReview === 0
														? 'All Caught Up!'
														: 'Due Tomorrow'}
												</div>
											</div>

											{/* Activity Status */}
											<div className="text-center p-3 rounded-lg bg-muted/30 border group-activity hover:scale-105 hover:shadow-md transition-all duration-300 hover:bg-muted/50">
												<div className="text-xl font-bold text-foreground mb-1 group-activity-hover:scale-110 transition-transform duration-300">
													{stats.lastActivity === null
														? '—'
														: stats.lastActivity === 0
														? 'Today'
														: `${stats.lastActivity}d`}
												</div>
												<div className="text-xs font-semibold text-muted-foreground group-activity-hover:text-foreground/80 transition-colors duration-300">
													{stats.lastActivity === null
														? 'Never Studied'
														: 'Last Activity'}
												</div>
											</div>
										</div>
									</div>

									<div className="mt-6 flex gap-2">
										<Link href={`/decks/${deck.id}`} className="flex-1">
											<Button
												className="w-full group-browse hover:scale-105 transition-all duration-300 hover:shadow-md"
												size="sm"
											>
												<BookOpen className="mr-2 h-4 w-4 group-browse-hover:scale-110 transition-transform duration-300" />
												Browse
											</Button>
										</Link>
										<Link href="/quiz?returnTo=decks" className="flex-1">
											<Button
												variant="outline"
												className="w-full group-quiz hover:scale-105 transition-all duration-300 hover:shadow-md disabled:opacity-50"
												size="sm"
												disabled={sessionCards.length === 0}
											>
												<Play className="mr-2 h-4 w-4 group-quiz-hover:scale-110 transition-transform duration-300" />
												Study
												{sessionCards.length > 0 && (
													<span className="ml-1 px-1.5 py-0.5 bg-primary/20 rounded-full text-xs font-bold animate-pulse">
														{sessionCards.length}
													</span>
												)}
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}

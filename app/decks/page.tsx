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

		return {
			total: deckCards.length,
			due: dueCards.length,
			mastered: masteredCards.length,
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
					{filteredDecks.map((deck) => {
						const stats = getDeckStats(deck);
						const sessionCards = getSessionCardsForDeck(deck);
						const completionRate =
							stats.total > 0
								? Math.round((stats.mastered / stats.total) * 100)
								: 0;
						return (
							<Card
								key={deck.id}
								className="flex flex-col hover:shadow-lg transition-all duration-200 border"
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
										<div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="w-2 h-2 bg-primary rounded-full" />
													<span className="text-sm font-semibold text-foreground">
														Learning Progress
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-lg font-black text-primary">
														{completionRate}%
													</span>
													{completionRate === 100 && (
														<div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
															<div className="w-2 h-2 bg-white rounded-full" />
														</div>
													)}
												</div>
											</div>
											<div className="w-full bg-muted rounded-full h-3 overflow-hidden">
												<div
													className="bg-primary h-3 rounded-full transition-all duration-500"
													style={{ width: `${completionRate}%` }}
												/>
											</div>
											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<span>Started</span>
												<span className="font-medium">
													{stats.mastered} of {stats.total} mastered
												</span>
												<span>Complete</span>
											</div>
										</div>

										{/* Statistics */}
										<div className="grid grid-cols-3 gap-3">
											{/* Total Words */}
											<div className="text-center p-4 rounded-xl bg-muted/30 border">
												<div className="text-2xl font-black text-foreground mb-1">
													{stats.total}
												</div>
												<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
													Total Words
												</div>
											</div>

											{/* Due Words */}
											<div className="text-center p-4 rounded-xl bg-muted/30 border">
												<div className="text-2xl font-black text-foreground mb-1">
													{stats.due}
												</div>
												<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
													Due Today
												</div>
											</div>

											{/* Mastered Words */}
											<div className="text-center p-4 rounded-xl bg-muted/30 border">
												<div className="text-2xl font-black text-foreground mb-1">
													{stats.mastered}
												</div>
												<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
													Mastered
												</div>
											</div>
										</div>
									</div>

									<div className="mt-6 flex gap-2">
										<Link href={`/decks/${deck.id}`} className="flex-1">
											<Button className="w-full" size="sm">
												<BookOpen className="mr-2 h-4 w-4" />
												Browse
											</Button>
										</Link>
										<Link href="/quiz?returnTo=decks" className="flex-1">
											<Button
												variant="outline"
												className="w-full disabled:opacity-50"
												size="sm"
												disabled={sessionCards.length === 0}
											>
												<Play className="mr-2 h-4 w-4" />
												Study
												{sessionCards.length > 0 && (
													<span className="ml-1 px-1.5 py-0.5 bg-primary/20 rounded-full text-xs font-bold">
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

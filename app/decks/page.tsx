'use client';

import { Badge } from '@/components/ui/badge';
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
import { getDueCards } from '@/lib/spaced-repetition';
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
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Your Decks</h1>
				<p className="mt-2 text-muted-foreground">
					Browse and manage your vocabulary collections
				</p>
			</div>

			{/* Search and Actions */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative flex-1 sm:max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search decks..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
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
							<Button>
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
						return (
							<Card key={deck.id} className="flex flex-col">
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="line-clamp-1">
												{deck.name}
											</CardTitle>
											<CardDescription className="mt-1 line-clamp-2">
												{deck.description}
											</CardDescription>
										</div>
										<div className="flex gap-1">
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
									<div className="space-y-3">
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Total Words</span>
											<Badge variant="secondary">{stats.total}</Badge>
										</div>
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Due Words</span>
											<Badge variant={stats.due > 0 ? 'default' : 'secondary'}>
												{stats.due}
											</Badge>
										</div>
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Mastered</span>
											<Badge
												variant="secondary"
												className="bg-green-500/10 text-green-700 dark:text-green-400"
											>
												{stats.mastered}
											</Badge>
										</div>
									</div>

									<div className="mt-4 flex gap-2">
										<Link href={`/decks/${deck.id}`} className="flex-1">
											<Button
												variant="outline"
												size="sm"
												className="w-full bg-transparent"
											>
												<BookOpen className="mr-2 h-4 w-4" />
												Browse
											</Button>
										</Link>
										<Link href="/quiz" className="flex-1">
											<Button
												size="sm"
												className="w-full"
												disabled={stats.due === 0}
											>
												<Play className="mr-2 h-4 w-4" />
												Study
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

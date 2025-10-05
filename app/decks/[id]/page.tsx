'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getDueCards } from '@/lib/spaced-repetition';
import {
	getCards,
	getDeck,
	getDecks,
	setDecks,
	updateCard,
} from '@/lib/storage';
import type { Deck, Card as FlashCard } from '@/lib/types';
import { ArrowLeft, Edit, Play, Plus, Search, Trash2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DeckDetailPage() {
	const router = useRouter();
	const params = useParams();
	const { toast } = useToast();
	const [deck, setDeck] = useState<Deck | null>(null);
	const [cards, setCards] = useState<FlashCard[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterBox, setFilterBox] = useState<string>('all');
	const [isLoading, setIsLoading] = useState(true);
	const [dueCards, setDueCards] = useState<FlashCard[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [allCards, setAllCards] = useState<FlashCard[]>([]);
	const [availableCards, setAvailableCards] = useState<FlashCard[]>([]);

	useEffect(() => {
		const deckId = params.id as string;
		const loadedDeck = getDeck(deckId);

		if (!loadedDeck) {
			toast({
				title: 'Deck not found',
				description: 'The requested deck could not be found.',
				variant: 'destructive',
			});
			router.push('/decks');
			return;
		}

		const allCardsData = getCards();
		const deckCards = allCardsData.filter((card) =>
			loadedDeck.cardIds.includes(card.id)
		);
		const availableCardsData = allCardsData.filter(
			(card) => !loadedDeck.cardIds.includes(card.id)
		);

		const dueCardsForDeck = getDueCards(deckCards);

		setDeck(loadedDeck);
		setCards(deckCards);
		setAllCards(allCardsData);
		setAvailableCards(availableCardsData);
		setDueCards(dueCardsForDeck);
		setIsLoading(false);
	}, [params.id, router, toast]);

	const filteredCards = cards.filter((card) => {
		const matchesSearch =
			card.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
			card.bangla.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesBox = filterBox === 'all' || card.box.toString() === filterBox;

		return matchesSearch && matchesBox;
	});

	const getBoxLabel = (box: number) => {
		const labels = {
			1: 'New',
			2: 'Learning',
			3: 'Familiar',
			4: 'Known',
			5: 'Mastered',
		};
		return labels[box as keyof typeof labels] || 'Unknown';
	};

	const getBoxColor = (box: number) => {
		const colors = {
			1: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
			2: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
			3: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
			4: 'bg-green-500/10 text-green-700 dark:text-green-400',
			5: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
		};
		return colors[box as keyof typeof colors] || '';
	};

	const handleStudyNow = () => {
		if (dueCards.length === 0) {
			toast({
				title: 'No cards to study',
				description: 'All cards in this deck are up to date. Come back later!',
				variant: 'default',
			});
			return;
		}

		// Navigate to quiz page with deck ID as return parameter
		router.push(`/quiz?returnTo=deck&deckId=${deck?.id}`);
	};

	const handleEditDeck = () => {
		const newName = prompt('Enter new deck name:', deck?.name || '');
		if (!newName || !newName.trim()) return;

		const newDescription =
			prompt('Enter new deck description:', deck?.description || '') || '';

		if (deck) {
			const updatedDeck = {
				...deck,
				name: newName.trim(),
				description: newDescription.trim(),
			};

			// Update deck in storage
			const allDecks = getDecks();
			const updatedDecks = allDecks.map((d) =>
				d.id === deck.id ? updatedDeck : d
			);
			setDecks(updatedDecks);
			setDeck(updatedDeck);

			// Update module field for all cards in this deck
			deck.cardIds.forEach((cardId) => {
				updateCard(cardId, {
					module: newName.trim(),
				});
			});

			// Update local cards state to reflect the change
			setCards((prevCards) =>
				prevCards.map((card) =>
					deck.cardIds.includes(card.id)
						? { ...card, module: newName.trim() }
						: card
				)
			);

			toast({
				title: 'Deck updated',
				description:
					'Deck details and all card modules have been updated successfully.',
			});
		}
	};

	const handleAddCard = (cardId: string) => {
		if (!deck) return;

		const updatedDeck = {
			...deck,
			cardIds: [...deck.cardIds, cardId],
		};

		const allDecks = getDecks();
		const updatedDecks = allDecks.map((d) =>
			d.id === deck.id ? updatedDeck : d
		);
		setDecks(updatedDecks);
		setDeck(updatedDeck);

		// Update the card's module to match the deck name
		updateCard(cardId, {
			module: deck.name,
		});

		// Update local state
		const addedCard = allCards.find((c) => c.id === cardId);
		if (addedCard) {
			const updatedCard = { ...addedCard, module: deck.name };
			setCards((prev) => [...prev, updatedCard]);
			setAvailableCards((prev) => prev.filter((c) => c.id !== cardId));
		}

		toast({
			title: 'Card added',
			description: 'Card has been added to this deck.',
		});
	};

	const handleRemoveCard = (cardId: string) => {
		if (!deck) return;

		const updatedDeck = {
			...deck,
			cardIds: deck.cardIds.filter((id) => id !== cardId),
		};

		const allDecks = getDecks();
		const updatedDecks = allDecks.map((d) =>
			d.id === deck.id ? updatedDeck : d
		);
		setDecks(updatedDecks);
		setDeck(updatedDeck);

		// Update local state
		const removedCard = allCards.find((c) => c.id === cardId);
		if (removedCard) {
			setCards((prev) => prev.filter((c) => c.id !== cardId));
			setAvailableCards((prev) => [...prev, removedCard]);
		}

		toast({
			title: 'Card removed',
			description: 'Card has been removed from this deck.',
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="mt-4 text-sm text-muted-foreground">Loading deck...</p>
				</div>
			</div>
		);
	}

	if (!deck) return null;

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
					<Button
						variant="ghost"
						onClick={() => router.push('/decks')}
						className="mb-4 group-back hover:scale-105 transition-all duration-300 hover:shadow-md"
					>
						<ArrowLeft className="mr-2 h-4 w-4 group-back-hover:scale-110 transition-transform duration-300" />
						Back to Decks
					</Button>

					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
								{deck.name}
							</h1>
							<p className="mt-2 text-muted-foreground max-w-2xl">
								{deck.description}
							</p>

							{/* Deck indicators */}
							<div className="mt-4 flex flex-wrap gap-2">
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
									<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
									{cards.length} Words
								</div>
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 rounded-full text-xs font-medium text-orange-600">
									<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-500" />
									{dueCards.length} Due Today
								</div>
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full text-xs font-medium text-green-600">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-1000" />
									{cards.filter((c) => c.box === 5).length} Mastered
								</div>
								<div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full text-xs font-medium text-blue-600">
									<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000" />
									Vocabulary Deck
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
							<div className="flex gap-2">
								<Button
									variant="outline"
									className="group-edit hover:scale-105 transition-all duration-300 hover:shadow-md flex-1 sm:flex-none"
									onClick={handleEditDeck}
								>
									<Edit className="mr-2 h-4 w-4 group-edit-hover:rotate-12 transition-transform duration-300" />
									Edit Deck
								</Button>
								<Button
									variant={isEditing ? 'default' : 'outline'}
									className="group-edit hover:scale-105 transition-all duration-300 hover:shadow-md flex-1 sm:flex-none"
									onClick={() => setIsEditing(!isEditing)}
								>
									<Plus className="mr-2 h-4 w-4 group-edit-hover:rotate-12 transition-transform duration-300" />
									{isEditing ? 'Done Editing' : 'Add Cards'}
								</Button>
							</div>
							<Button
								className="group-study hover:scale-105 transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
								onClick={handleStudyNow}
								disabled={dueCards.length === 0}
							>
								<Play className="mr-2 h-4 w-4 group-study-hover:scale-110 transition-transform duration-300" />
								Study Now
								{dueCards.length > 0 && (
									<span className="ml-2 px-2 py-0.5 bg-primary-foreground/20 rounded-full text-xs font-bold">
										{dueCards.length}
									</span>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1 group-search">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-search-hover:text-primary transition-colors duration-300" />
					<Input
						type="text"
						placeholder="Search cards..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 group-search-input hover:border-primary/50 focus:border-primary focus:shadow-lg transition-all duration-300 hover:scale-[1.01] focus:scale-[1.01]"
					/>
					{searchQuery && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2">
							<div className="flex items-center gap-1">
								<span className="text-xs text-muted-foreground">
									{filteredCards.length} result
									{filteredCards.length !== 1 ? 's' : ''}
								</span>
								<div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
							</div>
						</div>
					)}
				</div>
				<Select value={filterBox} onValueChange={setFilterBox}>
					<SelectTrigger className="w-full sm:w-[180px] group-filter hover:border-primary/50 transition-all duration-300 hover:scale-[1.01]">
						<SelectValue placeholder="Filter by box" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Boxes</SelectItem>
						<SelectItem value="1">Box 1 - New</SelectItem>
						<SelectItem value="2">Box 2 - Learning</SelectItem>
						<SelectItem value="3">Box 3 - Familiar</SelectItem>
						<SelectItem value="4">Box 4 - Known</SelectItem>
						<SelectItem value="5">Box 5 - Mastered</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Stats */}
			<div className="mb-6 grid gap-4 sm:grid-cols-5">
				{[1, 2, 3, 4, 5].map((box, index) => {
					const count = cards.filter((c) => c.box === box).length;
					const boxColors = {
						1: 'from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-700',
						2: 'from-yellow-50 to-yellow-100/50 border-yellow-200/50 text-yellow-700',
						3: 'from-orange-50 to-orange-100/50 border-orange-200/50 text-orange-700',
						4: 'from-green-50 to-green-100/50 border-green-200/50 text-green-700',
						5: 'from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-700',
					};
					const dotColors = {
						1: 'bg-blue-500',
						2: 'bg-yellow-500',
						3: 'bg-orange-500',
						4: 'bg-green-500',
						5: 'bg-emerald-500',
					};
					return (
						<Card
							key={box}
							className={`group-stats hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20 ${
								boxColors[box as keyof typeof boxColors]
							}`}
							style={{ animationDelay: `${index * 100}ms` }}
						>
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div
											className={`w-2 h-2 ${
												dotColors[box as keyof typeof dotColors]
											} rounded-full animate-pulse`}
										/>
										<p className="text-sm font-semibold text-muted-foreground group-stats-hover:text-foreground/80 transition-colors duration-300">
											{getBoxLabel(box)}
										</p>
									</div>
								</div>
								<p className="text-2xl font-black group-stats-hover:scale-110 transition-transform duration-300">
									{count}
								</p>
								<div className="mt-2 w-full bg-muted/50 rounded-full h-1.5 group-stats-hover:bg-muted/80 transition-colors duration-300">
									<div
										className={`bg-gradient-to-r ${
											boxColors[box as keyof typeof boxColors].split(' ')[0]
										} h-1.5 rounded-full transition-all duration-500 ease-out`}
										style={{
											width: `${
												cards.length > 0 ? (count / cards.length) * 100 : 0
											}%`,
										}}
									/>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Available Cards (when editing) */}
			{isEditing && availableCards.length > 0 && (
				<div className="mb-6">
					<h3 className="text-lg font-semibold mb-4 text-foreground">
						Available Cards ({availableCards.length})
					</h3>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{availableCards.slice(0, 12).map((card, index) => (
							<Card
								key={card.id}
								className="group-card hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border-2 hover:border-primary/20"
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<CardContent className="p-4">
									<div className="flex items-center justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-3">
												<p
													className="arabic-text text-lg font-bold group-card-hover:text-primary transition-colors duration-300"
													dir="rtl"
												>
													{card.arabic}
												</p>
												<span className="text-muted-foreground group-card-hover:text-foreground/80 transition-colors duration-300">
													→
												</span>
												<p className="text-base group-card-hover:text-foreground transition-colors duration-300">
													{card.bangla}
												</p>
											</div>
											{card.transliteration && (
												<p className="mt-1 text-sm text-muted-foreground group-card-hover:text-foreground/70 transition-colors duration-300">
													{card.transliteration}
												</p>
											)}
										</div>
										<Button
											size="sm"
											className="group-add hover:scale-110 transition-all duration-300"
											onClick={() => handleAddCard(card.id)}
										>
											<Plus className="h-4 w-4 group-add-hover:rotate-90 transition-transform duration-300" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					{availableCards.length > 12 && (
						<p className="text-sm text-muted-foreground mt-2">
							Showing first 12 cards. Use search to find specific cards.
						</p>
					)}
				</div>
			)}

			{/* Cards List */}
			{filteredCards.length === 0 ? (
				<Card className="group-empty hover:shadow-lg transition-all duration-300">
					<CardContent className="flex min-h-[200px] items-center justify-center p-8 text-center">
						<div>
							<div className="w-16 h-16 mx-auto mb-4 bg-muted/30 rounded-full flex items-center justify-center group-empty-hover:bg-muted/50 transition-all duration-300">
								<Search className="h-8 w-8 text-muted-foreground group-empty-hover:text-primary transition-colors duration-300" />
							</div>
							<h3 className="text-lg font-semibold mb-2 group-empty-hover:text-foreground transition-colors duration-300">
								{searchQuery
									? 'No cards match your search'
									: 'No cards in this deck'}
							</h3>
							<p className="text-sm text-muted-foreground group-empty-hover:text-foreground/80 transition-colors duration-300">
								{searchQuery
									? 'Try adjusting your search terms'
									: 'Add some vocabulary to get started'}
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{filteredCards.map((card, index) => (
						<Card
							key={card.id}
							className="group-card hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border-2 hover:border-primary/20"
							style={{ animationDelay: `${index * 50}ms` }}
						>
							<CardContent className="p-4">
								<div className="flex items-center justify-between gap-4">
									<div className="flex flex-1 items-center gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-3">
												<p
													className="arabic-text text-xl font-bold group-card-hover:text-primary transition-colors duration-300"
													dir="rtl"
												>
													{card.arabic}
												</p>
												<span className="text-muted-foreground group-card-hover:text-foreground/80 transition-colors duration-300">
													→
												</span>
												<p className="text-lg group-card-hover:text-foreground transition-colors duration-300">
													{card.bangla}
												</p>
											</div>
											{card.transliteration && (
												<p className="mt-1 text-sm text-muted-foreground group-card-hover:text-foreground/70 transition-colors duration-300">
													{card.transliteration}
												</p>
											)}
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge
											className={`${getBoxColor(
												card.box
											)} group-card-hover:scale-105 transition-transform duration-300`}
										>
											{getBoxLabel(card.box)}
										</Badge>
										<div className="flex gap-1 opacity-0 group-card-hover:opacity-100 transition-opacity duration-300">
											{isEditing ? (
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-destructive hover:text-destructive group-delete hover:bg-red-50 transition-all duration-300 hover:scale-110"
													onClick={() => handleRemoveCard(card.id)}
												>
													<X className="h-4 w-4 group-delete-hover:rotate-12 transition-transform duration-300" />
												</Button>
											) : (
												<>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 group-edit hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110"
													>
														<Edit className="h-4 w-4 group-edit-hover:rotate-12 transition-transform duration-300" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-destructive hover:text-destructive group-delete hover:bg-red-50 transition-all duration-300 hover:scale-110"
													>
														<Trash2 className="h-4 w-4 group-delete-hover:rotate-12 transition-transform duration-300" />
													</Button>
												</>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

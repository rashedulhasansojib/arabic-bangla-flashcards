'use client';

import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { initializeDefaultData } from '@/lib/init-data';
import { getDueCards } from '@/lib/spaced-repetition';
import { calculateProgress, getCards } from '@/lib/storage';
import type { Card as FlashCard, Progress } from '@/lib/types';
import { BookOpen, Clock, Flame, Play, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
	const [dueCards, setDueCards] = useState<FlashCard[]>([]);
	const [progress, setProgress] = useState<Progress | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Initialize default data on first load
		initializeDefaultData();

		// Load data
		const cards = getCards();
		const due = getDueCards(cards);
		const prog = calculateProgress(); // Use calculateProgress for accurate stats

		setDueCards(due);
		setProgress(prog);
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="mt-4 text-sm text-muted-foreground">
						Loading your flashcards...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{/* Hero Section */}
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
					Ready to learn Arabic?
				</h1>
				<p className="mt-4 text-lg text-muted-foreground">
					Master vocabulary with intelligent spaced repetition
				</p>
			</div>

			{/* Quick Stats */}
			<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Due Words"
					value={dueCards.length}
					icon={Clock}
					description="Words ready to review"
				/>
				<StatCard
					title="Current Streak"
					value={progress?.currentStreak || 0}
					icon={Flame}
					description="Days in a row"
				/>
				<StatCard
					title="Total Words"
					value={progress?.totalCards || 0}
					icon={BookOpen}
					description="In your collection"
				/>
				<StatCard
					title="Mastered"
					value={progress?.masteredCards || 0}
					icon={Target}
					description="Words you know well"
				/>
			</div>

			{/* Main Action Card */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Start Your Study Session</CardTitle>
					<CardDescription>
						{dueCards.length > 0
							? `You have ${dueCards.length} words ready to review`
							: 'Great job! No words due right now'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 sm:flex-row">
						<Link href="/quiz" className="flex-1">
							<Button
								size="lg"
								className="w-full"
								disabled={dueCards.length === 0}
							>
								<Play className="mr-2 h-5 w-5" />
								Start Quiz
							</Button>
						</Link>
						<Link href="/decks" className="flex-1">
							<Button
								size="lg"
								variant="outline"
								className="w-full bg-transparent"
							>
								<BookOpen className="mr-2 h-5 w-5" />
								Browse Decks
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>

			{/* Progress Overview */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Learning Progress</CardTitle>
						<CardDescription>Your vocabulary journey</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-muted-foreground">New Words</span>
									<span className="font-medium">{progress?.newCards || 0}</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-secondary">
									<div
										className="h-full bg-blue-500 transition-all"
										style={{
											width: `${
												((progress?.newCards || 0) /
													(progress?.totalCards || 1)) *
												100
											}%`,
										}}
									/>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Learning</span>
									<span className="font-medium">
										{progress?.learningCards || 0}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-secondary">
									<div
										className="h-full bg-yellow-500 transition-all"
										style={{
											width: `${
												((progress?.learningCards || 0) /
													(progress?.totalCards || 1)) *
												100
											}%`,
										}}
									/>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Mastered</span>
									<span className="font-medium">
										{progress?.masteredCards || 0}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-secondary">
									<div
										className="h-full bg-green-500 transition-all"
										style={{
											width: `${
												((progress?.masteredCards || 0) /
													(progress?.totalCards || 1)) *
												100
											}%`,
										}}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>Your study statistics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<TrendingUp className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm font-medium">Total Reviews</p>
										<p className="text-xs text-muted-foreground">All time</p>
									</div>
								</div>
								<p className="text-2xl font-bold">
									{progress?.totalReviews || 0}
								</p>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Flame className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm font-medium">Longest Streak</p>
										<p className="text-xs text-muted-foreground">
											Best performance
										</p>
									</div>
								</div>
								<p className="text-2xl font-bold">
									{progress?.longestStreak || 0}
								</p>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Target className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm font-medium">Accuracy Rate</p>
										<p className="text-xs text-muted-foreground">
											Overall performance
										</p>
									</div>
								</div>
								<p className="text-2xl font-bold">
									{progress?.accuracyRate || 0}%
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

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
		<div className="mx-auto max-w-7xl px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
			{/* Hero Section */}
			<div className="relative mb-6 sm:mb-8 text-center overflow-hidden">
				{/* Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />

				{/* Floating Elements */}
				<div className="absolute top-4 left-4 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
				<div className="absolute top-8 right-8 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-1000" />
				<div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse delay-500" />
				<div className="absolute bottom-8 right-4 w-1 h-1 bg-accent/25 rounded-full animate-pulse delay-1500" />

				<div className="relative">
					<h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
						Ready to learn Arabic?
					</h1>
					<p className="mt-2 text-base text-muted-foreground sm:mt-4 sm:text-lg max-w-2xl mx-auto">
						Master vocabulary with intelligent spaced repetition
					</p>

					{/* Visual Indicators */}
					<div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
							<div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
							Spaced Repetition
						</div>
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full text-xs font-medium text-accent-foreground">
							<div className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse delay-500" />
							Progress Tracking
						</div>
						<div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full text-xs font-medium text-green-600">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-1000" />
							Mobile Friendly
						</div>
					</div>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="mb-6 grid gap-3 sm:mb-8 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
			<Card className="mb-6 sm:mb-8 group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors duration-200">
						Start Your Study Session
					</CardTitle>
					<CardDescription className="text-sm">
						{dueCards.length > 0
							? `You have ${dueCards.length} words ready to review`
							: 'Great job! No words due right now'}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
						<Link href="/quiz" className="flex-1">
							<Button
								size="lg"
								className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group-hover:animate-pulse"
								disabled={dueCards.length === 0}
							>
								<Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
								Start Quiz
								{dueCards.length > 0 && (
									<span className="ml-2 px-2 py-0.5 bg-primary-foreground/20 rounded-full text-xs font-bold">
										{dueCards.length}
									</span>
								)}
							</Button>
						</Link>
						<Link href="/decks" className="flex-1">
							<Button
								size="lg"
								variant="outline"
								className="w-full h-12 text-base font-semibold bg-transparent hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
							>
								<BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
								Browse Decks
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>

			{/* Progress Overview */}
			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
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

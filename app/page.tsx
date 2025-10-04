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

			{/* Main Action Card - Study Focus */}
			<Card className="mb-6 sm:mb-8 group hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 hover:border-primary/40">
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

			{/* Progress Overview */}
			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<Card className="group-progress hover:shadow-lg transition-all duration-300 border-2 bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-blue-50/50 dark:from-blue-950/20 dark:via-blue-950/10 dark:to-blue-950/20 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700">
					<CardHeader>
						<CardTitle className="group-progress-hover:text-blue-600 dark:group-progress-hover:text-blue-400 transition-colors duration-300">
							Learning Progress
						</CardTitle>
						<CardDescription className="group-progress-hover:text-blue-700/80 dark:group-progress-hover:text-blue-300/80 transition-colors duration-300">
							Your vocabulary journey
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-muted-foreground group-new-hover:text-blue-600 dark:group-new-hover:text-blue-400 transition-colors duration-300">
										New Words
									</span>
									<span className="font-medium group-new-hover:scale-110 transition-transform duration-300">
										{progress?.newCards || 0}
									</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full bg-muted group-new-hover:bg-muted/80 transition-colors duration-300">
									<div
										className="h-full bg-gradient-to-r from-blue-500 via-blue-500/90 to-blue-500/80 transition-all duration-700 ease-out group-new-hover:shadow-lg relative"
										style={{
											width: `${
												((progress?.newCards || 0) /
													(progress?.totalCards || 1)) *
												100
											}%`,
										}}
									>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
									</div>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-muted-foreground group-learning-hover:text-yellow-600 dark:group-learning-hover:text-yellow-400 transition-colors duration-300">
										Learning
									</span>
									<span className="font-medium group-learning-hover:scale-110 transition-transform duration-300">
										{progress?.learningCards || 0}
									</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full bg-muted group-learning-hover:bg-muted/80 transition-colors duration-300">
									<div
										className="h-full bg-gradient-to-r from-yellow-500 via-yellow-500/90 to-yellow-500/80 transition-all duration-700 ease-out group-learning-hover:shadow-lg relative"
										style={{
											width: `${
												((progress?.learningCards || 0) /
													(progress?.totalCards || 1)) *
												100
											}%`,
										}}
									>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
									</div>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-muted-foreground group-mastered-hover:text-green-600 dark:group-mastered-hover:text-green-400 transition-colors duration-300">
										Mastered
									</span>
									<span className="font-medium group-mastered-hover:scale-110 transition-transform duration-300">
										{progress?.masteredCards || 0}
									</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full bg-muted group-mastered-hover:bg-muted/80 transition-colors duration-300">
									<div
										className="h-full bg-gradient-to-r from-green-500 via-green-500/90 to-green-500/80 transition-all duration-700 ease-out group-mastered-hover:shadow-lg relative"
										style={{
											width: `${
												((progress?.masteredCards || 0) /
													(progress?.totalCards || 1)) *
												100
											}%`,
										}}
									>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="group-activity hover:shadow-lg transition-all duration-300 border-2 bg-gradient-to-br from-green-50/50 via-green-50/30 to-green-50/50 dark:from-green-950/20 dark:via-green-950/10 dark:to-green-950/20 border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700">
					<CardHeader>
						<CardTitle className="group-activity-hover:text-green-600 dark:group-activity-hover:text-green-400 transition-colors duration-300">
							Recent Activity
						</CardTitle>
						<CardDescription className="group-activity-hover:text-green-700/80 dark:group-activity-hover:text-green-300/80 transition-colors duration-300">
							Your study statistics
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{/* Total Reviews */}
							<div className="flex items-center justify-between group-review-item hover:bg-muted/30 p-3 rounded-lg transition-all duration-300">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-review-item-hover:bg-primary/20 group-review-item-hover:scale-110 transition-all duration-300">
										<TrendingUp className="h-5 w-5 text-primary group-review-item-hover:scale-110 transition-transform duration-300" />
									</div>
									<div>
										<p className="text-sm font-medium group-review-item-hover:text-primary transition-colors duration-300">
											Total Reviews
										</p>
										<p className="text-xs text-muted-foreground group-review-item-hover:text-foreground/80 transition-colors duration-300">
											All time
										</p>
									</div>
								</div>
								<p className="text-2xl font-bold group-review-item-hover:scale-110 transition-transform duration-300">
									{progress?.totalReviews || 0}
								</p>
							</div>

							{/* Longest Streak */}
							<div className="flex items-center justify-between group-streak-item hover:bg-muted/30 p-3 rounded-lg transition-all duration-300">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-streak-item-hover:bg-primary/20 group-streak-item-hover:scale-110 transition-all duration-300">
										<Flame className="h-5 w-5 text-primary group-streak-item-hover:scale-110 transition-transform duration-300" />
									</div>
									<div>
										<p className="text-sm font-medium group-streak-item-hover:text-primary transition-colors duration-300">
											Longest Streak
										</p>
										<p className="text-xs text-muted-foreground group-streak-item-hover:text-foreground/80 transition-colors duration-300">
											Best performance
										</p>
									</div>
								</div>
								<p className="text-2xl font-bold group-streak-item-hover:scale-110 transition-transform duration-300">
									{progress?.longestStreak || 0}
								</p>
							</div>

							{/* Accuracy Rate */}
							<div className="flex items-center justify-between group-accuracy-item hover:bg-muted/30 p-3 rounded-lg transition-all duration-300">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-accuracy-item-hover:bg-primary/20 group-accuracy-item-hover:scale-110 transition-all duration-300">
										<Target className="h-5 w-5 text-primary group-accuracy-item-hover:scale-110 transition-transform duration-300" />
									</div>
									<div>
										<p className="text-sm font-medium group-accuracy-item-hover:text-primary transition-colors duration-300">
											Accuracy Rate
										</p>
										<p className="text-xs text-muted-foreground group-accuracy-item-hover:text-foreground/80 transition-colors duration-300">
											Overall performance
										</p>
									</div>
								</div>
								<p className="text-2xl font-bold group-accuracy-item-hover:scale-110 transition-transform duration-300">
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

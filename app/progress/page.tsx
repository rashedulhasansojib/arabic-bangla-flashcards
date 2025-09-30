'use client';

import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { getCards, getProgress, getSessions } from '@/lib/storage';
import type { Card as FlashCard, Progress, QuizSession } from '@/lib/types';
import {
	Award,
	Calendar,
	Clock,
	Flame,
	Target,
	TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProgressPage() {
	const [progress, setProgress] = useState<Progress | null>(null);
	const [cards, setCards] = useState<FlashCard[]>([]);
	const [sessions, setSessions] = useState<QuizSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadedProgress = getProgress();
		const loadedCards = getCards();
		const loadedSessions = getSessions();

		// Update progress stats
		const totalCards = loadedCards.length;
		const masteredCards = loadedCards.filter((c) => c.box === 5).length;
		const learningCards = loadedCards.filter(
			(c) => c.box > 1 && c.box < 5
		).length;
		const newCards = loadedCards.filter(
			(c) => c.box === 1 && !c.lastReviewed
		).length;

		const updatedProgress = {
			...loadedProgress,
			totalCards,
			masteredCards,
			learningCards,
			newCards,
		};

		setProgress(updatedProgress);
		setCards(loadedCards);
		setSessions(loadedSessions);
		setIsLoading(false);
	}, []);

	const getAccuracyRate = () => {
		if (!cards.length) return 0;
		const totalReviews = cards.reduce(
			(sum, card) => sum + card.correctCount + card.incorrectCount,
			0
		);
		const correctReviews = cards.reduce(
			(sum, card) => sum + card.correctCount,
			0
		);
		return totalReviews > 0
			? Math.round((correctReviews / totalReviews) * 100)
			: 0;
	};

	const getRecentSessions = () => {
		return sessions
			.sort(
				(a, b) =>
					new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
			)
			.slice(0, 5);
	};

	if (isLoading || !progress) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					<p className="mt-4 text-sm text-muted-foreground">
						Loading progress...
					</p>
				</div>
			</div>
		);
	}

	const accuracyRate = getAccuracyRate();
	const recentSessions = getRecentSessions();

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
				<p className="mt-2 text-muted-foreground">
					Track your learning journey and achievements
				</p>
			</div>

			{/* Key Metrics */}
			<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Current Streak
								</p>
								<p className="mt-2 text-3xl font-bold">
									{progress.currentStreak}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									days in a row
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
								<Flame className="h-6 w-6 text-orange-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Longest Streak
								</p>
								<p className="mt-2 text-3xl font-bold">
									{progress.longestStreak}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									best performance
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<Award className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Total Reviews
								</p>
								<p className="mt-2 text-3xl font-bold">
									{progress.totalReviews}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">all time</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<TrendingUp className="h-6 w-6 text-primary" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Accuracy Rate
								</p>
								<p className="mt-2 text-3xl font-bold">{accuracyRate}%</p>
								<p className="mt-1 text-xs text-muted-foreground">
									overall performance
								</p>
							</div>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
								<Target className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Learning Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Learning Distribution</CardTitle>
						<CardDescription>Words by mastery level</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="mb-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 rounded-full bg-blue-500" />
										<span className="text-sm font-medium">New Words</span>
									</div>
									<span className="text-sm font-bold">{progress.newCards}</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-secondary">
									<div
										className="h-full bg-blue-500 transition-all"
										style={{
											width: `${
												(progress.newCards / progress.totalCards) * 100
											}%`,
										}}
									/>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 rounded-full bg-yellow-500" />
										<span className="text-sm font-medium">Learning</span>
									</div>
									<span className="text-sm font-bold">
										{progress.learningCards}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-secondary">
									<div
										className="h-full bg-yellow-500 transition-all"
										style={{
											width: `${
												(progress.learningCards / progress.totalCards) * 100
											}%`,
										}}
									/>
								</div>
							</div>

							<div>
								<div className="mb-2 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 rounded-full bg-green-500" />
										<span className="text-sm font-medium">Mastered</span>
									</div>
									<span className="text-sm font-bold">
										{progress.masteredCards}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-secondary">
									<div
										className="h-full bg-green-500 transition-all"
										style={{
											width: `${
												(progress.masteredCards / progress.totalCards) * 100
											}%`,
										}}
									/>
								</div>
							</div>

							<div className="pt-4">
								<div className="flex items-center justify-between rounded-lg bg-muted p-4">
									<span className="font-medium">Total Words</span>
									<span className="text-2xl font-bold">
										{progress.totalCards}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Sessions */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Sessions</CardTitle>
						<CardDescription>Your latest study activities</CardDescription>
					</CardHeader>
					<CardContent>
						{recentSessions.length === 0 ? (
							<div className="flex min-h-[200px] items-center justify-center text-center">
								<div>
									<Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										No sessions yet
									</p>
									<p className="mt-1 text-xs text-muted-foreground">
										Start studying to see your progress here
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-3">
								{recentSessions.map((session) => {
									// Calculate accuracy from session data
									const totalAnswers = session.cards ? session.cards.length : 0;
									const correctAnswers = session.answers
										? session.answers.filter((a) => a.correct).length
										: 0;
									const accuracy =
										totalAnswers > 0
											? Math.round((correctAnswers / totalAnswers) * 100)
											: 0;

									return (
										<div
											key={session.id}
											className="flex items-center justify-between rounded-lg border p-4"
										>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<p className="text-sm font-medium">
														{new Date(session.startedAt).toLocaleDateString(
															'en-US',
															{
																month: 'short',
																day: 'numeric',
																year: 'numeric',
															}
														)}
													</p>
												</div>
												<p className="mt-1 text-xs text-muted-foreground">
													{correctAnswers} / {totalAnswers} correct
												</p>
											</div>
											<Badge
												variant={
													accuracy >= 80
														? 'default'
														: accuracy >= 60
														? 'secondary'
														: 'destructive'
												}
											>
												{accuracy}%
											</Badge>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Achievements */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Achievements</CardTitle>
					<CardDescription>Milestones you have reached</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="flex items-center gap-3 rounded-lg border p-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Award className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">First Steps</p>
								<p className="text-xs text-muted-foreground">
									Complete 10 reviews
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3 rounded-lg border p-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Flame className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">On Fire</p>
								<p className="text-xs text-muted-foreground">7 day streak</p>
							</div>
						</div>

						<div className="flex items-center gap-3 rounded-lg border p-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Target className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">Sharpshooter</p>
								<p className="text-xs text-muted-foreground">90% accuracy</p>
							</div>
						</div>

						<div className="flex items-center gap-3 rounded-lg border p-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<TrendingUp className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium">Dedicated</p>
								<p className="text-xs text-muted-foreground">
									100 total reviews
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

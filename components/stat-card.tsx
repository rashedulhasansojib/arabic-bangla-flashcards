import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	description?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

export function StatCard({
	title,
	value,
	icon: Icon,
	description,
	trend,
}: StatCardProps) {
	// Define colors based on title
	const getCardColors = (title: string) => {
		switch (title) {
			case 'Due Words':
				return {
					bg: 'bg-red-50 dark:bg-red-950/30',
					border: 'border-red-200 dark:border-red-800',
					text: 'text-red-700 dark:text-red-300',
					iconBg: 'bg-red-100 dark:bg-red-900/50',
					iconColor: 'text-red-600 dark:text-red-400',
					hoverBg: 'hover:bg-red-100 dark:hover:bg-red-950/50',
					hoverBorder: 'hover:border-red-300 dark:hover:border-red-700',
				};
			case 'Current Streak':
				return {
					bg: 'bg-orange-50 dark:bg-orange-950/30',
					border: 'border-orange-200 dark:border-orange-800',
					text: 'text-orange-700 dark:text-orange-300',
					iconBg: 'bg-orange-100 dark:bg-orange-900/50',
					iconColor: 'text-orange-600 dark:text-orange-400',
					hoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-950/50',
					hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-700',
				};
			case 'Total Words':
				return {
					bg: 'bg-blue-50 dark:bg-blue-950/30',
					border: 'border-blue-200 dark:border-blue-800',
					text: 'text-blue-700 dark:text-blue-300',
					iconBg: 'bg-blue-100 dark:bg-blue-900/50',
					iconColor: 'text-blue-600 dark:text-blue-400',
					hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-950/50',
					hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
				};
			case 'Mastered':
				return {
					bg: 'bg-green-50 dark:bg-green-950/30',
					border: 'border-green-200 dark:border-green-800',
					text: 'text-green-700 dark:text-green-300',
					iconBg: 'bg-green-100 dark:bg-green-900/50',
					iconColor: 'text-green-600 dark:text-green-400',
					hoverBg: 'hover:bg-green-100 dark:hover:bg-green-950/50',
					hoverBorder: 'hover:border-green-300 dark:hover:border-green-700',
				};
			default:
				return {
					bg: 'bg-muted/30',
					border: 'border',
					text: 'text-foreground',
					iconBg: 'bg-primary/10',
					iconColor: 'text-primary',
					hoverBg: 'hover:bg-muted/50',
					hoverBorder: 'hover:border-primary/20',
				};
		}
	};

	const colors = getCardColors(title);

	return (
		<Card
			className={`group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 ${colors.bg} ${colors.border} ${colors.hoverBg} ${colors.hoverBorder}`}
		>
			<CardContent className="p-6">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<p
							className={`text-sm font-medium group-hover:${colors.text.replace(
								'text-',
								'text-'
							)} transition-colors duration-200`}
						>
							{title}
						</p>
						<p
							className={`mt-2 text-3xl font-bold ${colors.text} group-hover:scale-110 transition-all duration-300`}
						>
							{value}
						</p>
						{description && (
							<p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-200">
								{description}
							</p>
						)}
					</div>
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.iconBg} group-hover:scale-110 transition-all duration-300`}
					>
						<Icon
							className={`h-6 w-6 ${colors.iconColor} group-hover:scale-110 transition-all duration-300`}
						/>
					</div>
				</div>
				{trend && (
					<div className="mt-4 flex items-center gap-1 text-xs">
						<span
							className={`font-semibold ${
								trend.isPositive ? 'text-green-600' : 'text-red-600'
							}`}
						>
							{trend.isPositive ? '+' : ''}
							{trend.value}%
						</span>
						<span className="text-muted-foreground">from last week</span>
					</div>
				)}

				{/* Progress Indicator for streaks */}
				{title === 'Current Streak' &&
					typeof value === 'number' &&
					value > 0 && (
						<div className="mt-3 w-full bg-muted rounded-full h-1.5">
							<div
								className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500 ease-out"
								style={{ width: `${Math.min((value / 30) * 100, 100)}%` }}
							/>
						</div>
					)}
			</CardContent>
		</Card>
	);
}

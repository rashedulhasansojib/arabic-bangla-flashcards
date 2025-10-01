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
	return (
		<Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20">
			<CardContent className="p-6">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<p className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
							{title}
						</p>
						<p className="mt-2 text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
							{value}
						</p>
						{description && (
							<p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-200">
								{description}
							</p>
						)}
					</div>
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
						<Icon className="h-6 w-6 text-primary group-hover:text-primary/80 transition-all duration-300" />
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

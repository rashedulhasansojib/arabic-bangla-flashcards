'use client';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { BarChart3, BookOpen, Home, Menu, Play, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
	{
		href: '/',
		label: 'Home',
		icon: Home,
		description: 'Start learning',
		shortLabel: 'Home',
	},
	{
		href: '/quiz',
		label: 'Start Quiz',
		icon: Play,
		description: 'Begin study session',
		shortLabel: 'Quiz',
	},
	{
		href: '/decks',
		label: 'Vocabulary',
		icon: BookOpen,
		description: 'Browse word collections',
		shortLabel: 'Words',
	},
	{
		href: '/progress',
		label: 'Progress',
		icon: BarChart3,
		description: 'Track your learning',
		shortLabel: 'Stats',
	},
	{
		href: '/settings',
		label: 'Settings',
		icon: Settings,
		description: 'Customize experience',
		shortLabel: 'Settings',
	},
];

export function Navigation() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="border-b border-border bg-card sticky top-0 z-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Title */}
					<div className="flex items-center gap-2 group-logo">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-logo-hover:scale-110 group-logo-hover:shadow-xl transition-all duration-300">
							<span className="text-xl font-bold group-logo-hover:animate-pulse">
								ع
							</span>
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-semibold group-logo-hover:text-primary transition-colors duration-300">
								Arabic Words
							</h1>
							<p className="text-xs text-muted-foreground group-logo-hover:text-foreground/80 transition-colors duration-300">
								Learn vocabulary with spaced repetition
							</p>
						</div>
						<div className="block sm:hidden">
							<h1 className="text-lg font-semibold group-logo-hover:text-primary transition-colors duration-300">
								Arabic Words
							</h1>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden',
										isActive
											? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md'
									)}
									title={item.description}
								>
									{/* Active indicator */}
									{isActive && (
										<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
									)}
									<Icon
										className={cn(
											'h-4 w-4 relative z-10 transition-all duration-300',
											isActive && 'animate-pulse',
											'group-hover:scale-110'
										)}
									/>
									<span className="relative z-10 font-semibold">
										{item.shortLabel}
									</span>

									{/* Hover effect */}
									{!isActive && (
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									)}
								</Link>
							);
						})}
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden">
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 group hover:bg-accent/50 transition-all duration-300"
								>
									<Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
									<span className="sr-only">Open menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								side="right"
								className="w-80 bg-gradient-to-b from-background to-accent/5"
							>
								<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
								<div className="flex flex-col space-y-6 mt-8">
									<div className="flex items-center gap-3 pb-4 border-b group-logo">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-logo-hover:scale-110 transition-all duration-300">
											<span className="text-2xl font-bold">ع</span>
										</div>
										<div>
											<h2 className="text-lg font-semibold group-logo-hover:text-primary transition-colors duration-300">
												Arabic Words
											</h2>
											<p className="text-sm text-muted-foreground">
												Master Arabic vocabulary
											</p>
										</div>
									</div>

									<nav className="flex flex-col space-y-1">
										{navItems.map((item, index) => {
											const Icon = item.icon;
											const isActive = pathname === item.href;
											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() => setIsOpen(false)}
													className={cn(
														'group-nav flex items-center gap-4 rounded-lg px-4 py-4 text-base font-medium transition-all duration-300 hover:scale-[1.02] relative overflow-hidden',
														isActive
															? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg'
															: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md'
													)}
													style={{ animationDelay: `${index * 100}ms` }}
												>
													{/* Active indicator */}
													{isActive && (
														<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
													)}
													<Icon
														className={cn(
															'h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300',
															isActive && 'animate-pulse',
															'group-nav-hover:scale-110'
														)}
													/>
													<div className="flex-1 relative z-10">
														<div className="font-semibold group-nav-hover:text-primary transition-colors duration-300">
															{item.label}
														</div>
														<div className="text-xs text-muted-foreground mt-0.5 group-nav-hover:text-foreground/80 transition-colors duration-300">
															{item.description}
														</div>
													</div>

													{/* Hover effect */}
													{!isActive && (
														<div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-0 group-nav-hover:opacity-100 transition-opacity duration-300" />
													)}
												</Link>
											);
										})}
									</nav>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}

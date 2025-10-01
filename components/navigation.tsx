'use client';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { BarChart3, BookOpen, Home, Menu, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
	{ href: '/', label: 'Home', icon: Home },
	{ href: '/decks', label: 'Decks', icon: BookOpen },
	{ href: '/progress', label: 'Progress', icon: BarChart3 },
	{ href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="border-b border-border bg-card sticky top-0 z-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Title */}
					<div className="flex items-center gap-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<span className="text-xl font-bold">ع</span>
						</div>
						<div className="hidden sm:block">
							<h1 className="text-lg font-semibold">Arabic Words</h1>
							<p className="text-xs text-muted-foreground">
								Learn vocabulary with spaced repetition
							</p>
						</div>
						<div className="block sm:hidden">
							<h1 className="text-lg font-semibold">Arabic Words</h1>
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
										'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
									)}
								>
									<Icon className="h-4 w-4" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden">
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="h-10 w-10">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Open menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-80">
								<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
								<div className="flex flex-col space-y-4 mt-8">
									<div className="flex items-center gap-3 pb-4 border-b">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
											<span className="text-xl font-bold">ع</span>
										</div>
										<div>
											<h2 className="text-lg font-semibold">Arabic Words</h2>
											<p className="text-sm text-muted-foreground">
												Learn vocabulary
											</p>
										</div>
									</div>

									<nav className="flex flex-col space-y-2">
										{navItems.map((item) => {
											const Icon = item.icon;
											const isActive = pathname === item.href;
											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() => setIsOpen(false)}
													className={cn(
														'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors',
														isActive
															? 'bg-primary text-primary-foreground'
															: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
													)}
												>
													<Icon className="h-5 w-5" />
													<span>{item.label}</span>
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

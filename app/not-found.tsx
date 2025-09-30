'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Page Not Found</CardTitle>
					<CardDescription>
						The page you're looking for doesn't exist.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center">
						<p className="text-6xl">😕</p>
						<p className="mt-4 text-sm text-muted-foreground">
							Looks like you took a wrong turn!
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Link href="/">
							<Button className="w-full">
								<Home className="mr-2 h-4 w-4" />
								Go Home
							</Button>
						</Link>
						<Button variant="outline" onClick={() => window.history.back()}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Go Back
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

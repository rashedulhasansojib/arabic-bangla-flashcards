import type React from "react"
import type { Metadata } from "next"
import { Geist as Geist_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

const geistSans = Geist_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: "Arabic Flashcards - Learn with Spaced Repetition",
  description: "Master Arabic vocabulary with an intelligent spaced repetition system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="flashcards-theme">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>{children}</main>
            </div>
            <Toaster />
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navbar from "@/components/Navbar"
import type React from "react"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "সাহায্য | কমিউনিটি ক্রাইম রিপোর্টিং",
  description: "সজাগ অপরাধ প্রতিবেদনের মাধ্যমে সম্প্রদায়ের ক্ষমতায়ন",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <header className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2e335a] via-[#1c1b33] to-[#8b1e1e] z-0" />
              <div className="relative z-10 container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-white">সাহায্য</h1>
                <p className="text-gray-200 mt-2">সজাগ অপরাধ প্রতিবেদনের মাধ্যমে সম্প্রদায়ের ক্ষমতায়ন</p>
              </div>
              <Navbar />
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

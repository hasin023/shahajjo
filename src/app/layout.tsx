import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navbar from "@/components/Navbar"
import type React from "react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast";
import LoadUser from "@/components/LoadUser";
import Image from "next/image"

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
          <LoadUser />
          <div className="min-h-screen flex flex-col">
            <header className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#a9b2f7] via-[#504d8e] to-[#1e8b4a] z-0" />
              <div className="flex items-center justify-start relative z-10 mx-auto px-4 py-2 gap-2">
                <Image src="/logo.png" className="h-12 w-12" alt="Shahajjo Logo" height={120} width={120} priority />
                <h3 className="text-4xl text-gray-50 font-semibold">সাহায্য</h3>
              </div>
              <Navbar />
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

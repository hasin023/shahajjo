"use client"

import { useState } from "react"
import { CrimeCard } from "./CrimeCard"
import type { CrimePost } from "@/types/crime"

const dummyPosts: CrimePost[] = [
    {
        id: "1",
        title: "গুলশান-২ মার্কেটে ডাকাতি",
        description:
            "একদল সশস্ত্র ব্যক্তি গুলশান-২ মার্কেটে একটি গয়নার দোকান লুট করেছে। পুলিশ ঘটনাটি তদন্ত করছে।",
        location: "গুলশান-২, ঢাকা",
        type: "ডাকাতি",
        severity: "high",
        timestamp: new Date("2024-02-09T10:00:00"),
        author: {
            name: "উদ্বিগ্ননাগরিক",
            avatar: "/placeholder.svg",
            isVerified: true,
        },
        votes: 156,
        comments: 23,
        awards: ["Helpful", "Urgent"],
        images: ["/placeholder.svg"],
        status: "investigating",
    },
    {
        id: "2",
        title: "মিরপুরে ছিনতাই",
        description:
            "মিরপুর ১০ নম্বরে এক ব্যক্তিকে ছিনতাইকারীরা আক্রমণ করে তার মোবাইল ফোন এবং মানিব্যাগ নিয়ে গেছে।",
        location: "মিরপুর, ঢাকা",
        type: "ছিনতাই",
        severity: "medium",
        timestamp: new Date("2024-03-15T18:30:00"),
        author: {
            name: "সচেতনবাসী",
            avatar: "/placeholder.svg",
            isVerified: false,
        },
        votes: 89,
        comments: 12,
        awards: ["Informative"],
        images: ["/placeholder.svg"],
        status: "verified",
    },
    {
        id: "3",
        title: "ধানমন্ডিতে গাড়ি চুরি",
        description:
            "ধানমন্ডি ২৭ নম্বর রোডে একটি পার্ক করা গাড়ি চুরি হয়েছে। পুলিশ সিসিটিভি ফুটেজ পর্যালোচনা করছে।",
        location: "ধানমন্ডি, ঢাকা",
        type: "গাড়ি চুরি",
        severity: "high",
        timestamp: new Date("2024-01-22T05:45:00"),
        author: {
            name: "নিরাপত্তাপ্রেমী",
            avatar: "/placeholder.svg",
            isVerified: true,
        },
        votes: 120,
        comments: 30,
        awards: ["Important"],
        images: ["/placeholder.svg"],
        status: "investigating",
    },
    {
        id: "4",
        title: "বনানীতে মাদক উদ্ধার",
        description:
            "বনানী এলাকায় একটি বাড়িতে অভিযান চালিয়ে বিপুল পরিমাণ মাদক উদ্ধার করেছে র‍্যাব।",
        location: "বনানী, ঢাকা",
        type: "মাদক",
        severity: "high",
        timestamp: new Date("2024-04-10T14:20:00"),
        author: {
            name: "সতর্কপ্রতিবেশী",
            avatar: "/placeholder.svg",
            isVerified: false,
        },
        votes: 200,
        comments: 45,
        awards: ["Brave"],
        images: ["/placeholder.svg"],
        status: "resolved",
    },
]

interface CrimeFeedProps {
    searchQuery: string
    selectedDivision: string
    selectedCrimeType: string
    selectedSort: string
}

export default function CrimeFeed({
    searchQuery,
    selectedDivision,
    selectedCrimeType,
    selectedSort,
}: CrimeFeedProps) {
    const [votedPosts, setVotedPosts] = useState<Record<string, "up" | "down" | null>>({})

    const handleVote = (postId: string, direction: "up" | "down") => {
        setVotedPosts((prev) => ({
            ...prev,
            [postId]: prev[postId] === direction ? null : direction,
        }))
    }

    // Filter posts based on search query, division, and crime type
    const filteredPosts = dummyPosts.filter((post) => {
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase()
            const titleMatch = post.title.toLowerCase().includes(searchLower)
            const descriptionMatch = post.description.toLowerCase().includes(searchLower)
            if (!titleMatch && !descriptionMatch) return false
        }

        if (selectedDivision !== "All" && !post.location.includes(selectedDivision)) {
            return false
        }

        if (selectedCrimeType !== "All" && post.type !== selectedCrimeType) {
            return false
        }

        return true
    })

    // Sort filtered posts
    const sortedPosts = filteredPosts.sort((a, b) => {
        switch (selectedSort) {
            case "Most Recent":
                return b.timestamp.getTime() - a.timestamp.getTime()
            case "Most Upvoted":
                return b.votes - a.votes
            case "Highest Verification Score":
                return Number(b.author.isVerified) - Number(a.author.isVerified)
            default:
                return 0
        }
    })

    return (
        <section className="space-y-6">
            {sortedPosts.map((post) => (
                <article key={post.id}>
                    <CrimeCard post={post} onVote={handleVote} votedPosts={votedPosts} />
                </article>
            ))}
            {sortedPosts.length === 0 && (
                <article className="text-center py-8 text-muted-foreground">
                    No crimes found matching your criteria
                </article>
            )}
        </section>
    )
}
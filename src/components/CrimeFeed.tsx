"use client"

import { useState, useMemo } from "react"
import { CrimeCard } from "./CrimeCard"
import { crimeReports } from "@/libs/dummy-data"

interface CrimeFeedProps {
    searchQuery: string
    selectedDivision: string
    selectedCrimeType: string
    selectedSort: string
}

export default function CrimeFeed({ searchQuery, selectedDivision, selectedCrimeType, selectedSort }: CrimeFeedProps) {
    const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({})

    const handleVote = (reportId: string, direction: "up" | "down") => {
        setUserVotes((prev) => ({
            ...prev,
            [reportId]: prev[reportId] === direction ? null : direction,
        }))
    }

    const filteredAndSortedReports = useMemo(() => {
        return crimeReports
            .filter((report) => {
                const matchesSearch = searchQuery
                    ? report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    report.description.toLowerCase().includes(searchQuery.toLowerCase())
                    : true
                const matchesDivision = selectedDivision === "All" || report.location_name.includes(selectedDivision)
                const matchesType = selectedCrimeType === "All" || report.status === selectedCrimeType
                return matchesSearch && matchesDivision && matchesType
            })
            .sort((a, b) => {
                switch (selectedSort) {
                    case "Most Recent":
                        return b.createdAt.getTime() - a.createdAt.getTime()
                    case "Most Upvoted":
                        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
                    case "Highest Verification Score":
                        return Number(b.verified) - Number(a.verified)
                    default:
                        return 0
                }
            })
    }, [searchQuery, selectedDivision, selectedCrimeType, selectedSort])

    return (
        <section className="space-y-6">
            {filteredAndSortedReports.map((report) => (
                <CrimeCard key={report.id} report={report} onVote={handleVote} userVote={userVotes[report.id]} />
            ))}
            {filteredAndSortedReports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No crimes found matching your criteria</div>
            )}
        </section>
    )
}


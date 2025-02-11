"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DetailedCrimeCard } from "@/components/DetailedCrimeCard"
import { CommentsSection } from "@/components/CommentsSection"
import { crimeReports } from "@/libs/dummy-data"
import type { ICrimeReport } from "@/types"
import { Sidebar } from "@/components/Sidebar"

// This would typically come from an API call
const fetchReportDetails = async (id: string): Promise<ICrimeReport> => {
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const report = crimeReports.find((r) => r._id === id)
    if (!report) throw new Error("Report not found")
    return report
}

interface Comment {
    id: string
    author: string
    content: string
    createdAt: Date
}

export default function ReportDetailsPage() {
    const { crimeReportId } = useParams()
    const [report, setReport] = useState<ICrimeReport | null>(null)
    const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
    const [comments, setComments] = useState<Comment[]>([])

    useEffect(() => {
        const loadReport = async () => {
            try {
                const reportData = await fetchReportDetails(crimeReportId as string)
                setReport(reportData)
                // In a real app, you'd fetch comments from an API
                setComments(
                    reportData.comments.map((_, index) => ({
                        id: `comment-${index}`,
                        author: `User${index + 1}`,
                        content: `This is comment ${index + 1} for the crime report.`,
                        createdAt: new Date(reportData.createdAt.getTime() + index * 60000), // Add minutes to simulate different times
                    })),
                )
            } catch (error) {
                console.error("Failed to load report:", error)
            }
        }
        loadReport()
    }, [crimeReportId])

    const handleVote = (reportId: string, direction: "up" | "down") => {
        setUserVote((prev) => (prev === direction ? null : direction))
        // In a real app, you'd send this vote to an API
    }

    const handleCommentSubmit = (content: string) => {
        const newCommentObj: Comment = {
            id: `comment-${comments.length + 1}`,
            author: "CurrentUser", // In a real app, this would be the logged-in user
            content: content,
            createdAt: new Date(),
        }
        setComments((prev) => [...prev, newCommentObj])
        // In a real app, you'd send this comment to an API
    }

    if (!report) return <div>Loading...</div>

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 container mx-auto p-4 space-y-6">
                <DetailedCrimeCard report={report} onVote={handleVote} userVote={userVote} />
                <CommentsSection comments={comments} onCommentSubmit={handleCommentSubmit} />
            </main>
        </div>

    )
}


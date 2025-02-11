"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DetailedCrimeCard } from "@/components/DetailedCrimeCard"
import { CommentsSection } from "@/components/CommentsSection"
import { Sidebar } from "@/components/Sidebar"
import type { IComment, ICrimeReport } from "@/types"
import toast from "react-hot-toast"

export default function ReportDetailsPage() {
    const { crimeReportId } = useParams()
    const [report, setReport] = useState<ICrimeReport | null>(null)
    const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null)
    const [comments, setComments] = useState<IComment[]>([])
    const [isAuthor, setIsAuthor] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const loadReport = async () => {
            try {
                const response = await fetch(`/api/report/${crimeReportId}`)
                if (!response.ok) throw new Error("Failed to fetch report")
                const data = await response.json()
                setReport(data.report)
                setComments(data.comments)
                setIsAuthor(data.isAuthor)
            } catch (error) {
                console.error("Failed to load report:", error)
                toast.error("Failed to load the report. Please try again.")
            }
        }
        loadReport()
    }, [crimeReportId, toast])

    const handleVote = async (reportId: string, direction: "upvote" | "downvote") => {
        try {
            const response = await fetch(`/api/report/${reportId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ direction }),
            })
            if (!response.ok) throw new Error("Failed to submit vote")
            const updatedReport = await response.json()
            setReport(updatedReport)
            // setUserVote(direction)
        } catch (error) {
            console.error("Failed to submit vote:", error)
            toast({
                title: "Error",
                description: "Failed to submit your vote. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleCommentSubmit = async (content: string) => {
        try {
            const response = await fetch(`/api/report/${crimeReportId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            })
            if (!response.ok) throw new Error("Failed to submit comment")
            const newComment = await response.json()
            setComments((prev) => [...prev, newComment])
        } catch (error) {
            console.error("Failed to submit comment:", error)
            toast({
                title: "Error",
                description: "Failed to submit your comment. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleEdit = () => {
        router.push(`/report/edit/${crimeReportId}`)
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                const response = await fetch(`/api/user/report`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reportId: crimeReportId }),
                })

                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || "Failed to delete report")
                }

                toast.success("Report deleted successfully.")
                router.push("/")
            } catch (error) {
                console.error("Failed to delete report:", error)
                toast.error("Failed to delete the report.")
            }
        }
    }

    if (!report) return <div>Loading...</div>

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 container mx-auto p-4 space-y-6">
                <DetailedCrimeCard
                    report={report}
                    onVote={handleVote}
                    userVote={userVote}
                    isAuthor={isAuthor}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <CommentsSection comments={comments} onCommentSubmit={handleCommentSubmit} />
            </main>
        </div>
    )
}


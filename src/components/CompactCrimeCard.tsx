"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MapPin, AlertTriangle, Shield, Clock, CircleCheckBig } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ICrimeReport } from "@/types"

const statusIcons = {
    verified: Shield,
    investigating: Clock,
    resolved: CircleCheckBig,
    "not verified": AlertTriangle,
}

const statusColors = {
    verified: "text-green-500",
    investigating: "text-yellow-500",
    resolved: "text-blue-500",
    "not verified": "text-red-500",
}

interface CompactCrimeCardProps {
    report: ICrimeReport
    onVote: (reportId: string, direction: "upvote" | "downvote") => void
    userVote: "upvote" | "downvote" | null
}

export function CompactCrimeCard({ report, onVote, userVote }: CompactCrimeCardProps) {
    const StatusIcon = statusIcons[report.status as keyof typeof statusIcons]
    const voteCount = report.upvotes - report.downvotes

    return (
        <Card className="hover:bg-accent/50 transition-colors">
            <Link href={`/${report._id}`}>
                <div className="flex items-center p-2 gap-4">
                    {/* Vote buttons */}
                    <div className="flex flex-col items-center gap-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault()
                                onVote(report._id, "upvote")
                            }}
                            className={`p-0.5 rounded-sm transition-colors ${userVote === "upvote" ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            <ArrowBigUp className="h-4 w-4" />
                        </motion.button>
                        <span className="text-xs font-medium">{voteCount}</span>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault()
                                onVote(report._id, "downvote")
                            }}
                            className={`p-0.5 rounded-sm transition-colors ${userVote === "downvote" ? "text-destructive" : "text-muted-foreground"
                                }`}
                        >
                            <ArrowBigDown className="h-4 w-4" />
                        </motion.button>
                    </div>

                    {/* Thumbnail */}
                    {report.images && report.images.length > 0 && (
                        <div className="w-16 h-16 flex-shrink-0">
                            <img
                                src={report.images[0] || "/placeholder.svg"}
                                alt=""
                                className="w-full h-full object-cover rounded-md"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className={`${statusColors[report.status as keyof typeof statusColors]}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {report.status}
                            </Badge>
                            <span>Posted by {report.reportedBy}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(report.createdAt))} ago</span>
                        </div>
                        <h3 className="font-medium mt-1 truncate">{report.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {report.location_name}
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {report.comments.length} comments
                            </div>
                            <div className="flex items-center gap-1">
                                <Share2 className="h-3 w-3" />
                                Share
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    )
}


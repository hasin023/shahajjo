"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MapPin, AlertTriangle, Shield, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ICrimeReport } from "@/types"

const statusIcons = {
    verified: Shield,
    investigating: AlertTriangle,
    resolved: Clock,
    "not verified": AlertTriangle,
}

const statusColors = {
    verified: "text-green-500",
    investigating: "text-yellow-500",
    resolved: "text-muted-foreground",
    "not verified": "text-red-500",
}

interface CompactCrimeCardProps {
    report: ICrimeReport
    onVote: (reportId: string, direction: "up" | "down") => void
    userVote: "up" | "down" | null
}

export function CompactCrimeCard({ report, onVote, userVote }: CompactCrimeCardProps) {
    const StatusIcon = statusIcons[report.status]
    const voteCount = report.upvotes - report.downvotes

    return (
        <Card className="hover:bg-accent/50 transition-colors">
            <Link href={`/${report.id}`}>
                <div className="flex items-center p-2 gap-4">
                    {/* Vote buttons */}
                    <div className="flex flex-col items-center gap-1">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault()
                                onVote(report.id, "up")
                            }}
                            className={`p-0.5 rounded-sm transition-colors ${userVote === "up" ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            <ArrowBigUp className="h-4 w-4" />
                        </motion.button>
                        <span className="text-xs font-medium">{voteCount}</span>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault()
                                onVote(report.id, "down")
                            }}
                            className={`p-0.5 rounded-sm transition-colors ${userVote === "down" ? "text-destructive" : "text-muted-foreground"
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
                            <Badge variant="secondary" className={`${statusColors[report.status]}`}>
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


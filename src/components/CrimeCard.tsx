"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

interface CrimeCardProps {
    report: ICrimeReport
    onVote: (reportId: string, direction: "upvote" | "downvote") => void
    userVote: "upvote" | "downvote" | null
}

export function CrimeCard({ report, onVote, userVote }: CrimeCardProps) {
    const StatusIcon = statusIcons[report.status as keyof typeof statusIcons]

    return (
        <Card className="crime-card hover:border-primary transition-colors duration-200">
            <div className="flex">
                {/* Vote Column */}
                <div className="flex flex-col items-center p-2 bg-muted rounded-l-lg">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onVote(report._id, "upvote")}
                        className={`p-1 rounded-full transition-colors ${userVote === "upvote" ? "text-primary" : "text-muted-foreground"
                            }`}
                    >
                        <ArrowBigUp className="h-6 w-6" />
                    </motion.button>
                    <span className="font-bold text-sm py-1">{report.upvotes - report.downvotes}</span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onVote(report._id, "downvote")}
                        className={`p-1 rounded-full transition-colors ${userVote === "downvote" ? "text-destructive" : "text-muted-foreground"
                            }`}
                    >
                        <ArrowBigDown className="h-6 w-6" />
                    </motion.button>
                </div>

                {/* Content Column */}
                <div className="flex-1 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={report.author?.avatar || `https://avatar.vercel.sh/${report.reportedBy}`} />
                                <AvatarFallback>{report.reportedBy[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                                Reported by {report.author?.name} {formatDistanceToNow(new Date(report.createdAt))} ago
                            </span>
                        </div>
                        <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location_name}
                        </Badge>
                    </div>

                    {/* Title and Description */}
                    <Link href={`/${report._id}`} className="block group">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-200">
                            {report.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground line-clamp-3">{report.description}</p>
                    </Link>

                    {/* Images */}
                    {report.images && report.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {report.images.slice(0, 2).map((image, index) => (
                                <img
                                    key={index}
                                    src={image || "/placeholder.svg"}
                                    alt={`Evidence ${index + 1}`}
                                    className="rounded-md object-cover w-full h-32"
                                />
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                            <Link href={`/${report._id}`}>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    {report.comments.length} Comments
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                        <Badge variant="secondary" className={`gap-1 ${statusColors[report.status as keyof typeof statusColors]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    )
}


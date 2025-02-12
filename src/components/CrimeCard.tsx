"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MessageSquare, Share2, MapPin, AlertTriangle, Shield, Clock, CircleCheckBig, ImageIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { ICrimeReport, IVote } from "@/types"
import { useEffect, useState } from "react"
import CardVoteVertical from "./CardVoteVertical"

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
}

export function CrimeCard({ report }: CrimeCardProps) {
    const StatusIcon = statusIcons[report.status as keyof typeof statusIcons]
    const additionalImages = report.images ? report.images.length - 2 : 0

    return (
        <Card className="crime-card hover:border-primary transition-colors duration-200">
            <div className="flex">
                {/* Vote Column */}
                <CardVoteVertical report={report} />

                {/* Content Column */}
                <div className="flex-1 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 ring-2 ring-primary/10">
                                <AvatarImage src={report.author?.avatar || `https://avatar.vercel.sh/${report.reportedBy}`} />
                                <AvatarFallback>{report.reportedBy[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                                Reported by{" "}
                                <span className="font-medium text-foreground">
                                    {report.author?.name}
                                </span>{" "}
                                {formatDistanceToNow(new Date(report.createdAt))} ago
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
                        <div className="mt-4 relative">
                            <div className="grid grid-cols-2 gap-2">
                                {report.images.slice(0, 2).map((image, index) => (
                                    <div key={index} className="relative aspect-video">
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={`Evidence ${index + 1}`}
                                            className="rounded-md object-cover w-full h-full"
                                        />
                                        {index === 1 && additionalImages > 0 && (
                                            <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center">
                                                <div className="text-white flex items-center gap-2">
                                                    <ImageIcon className="h-5 w-5" />
                                                    <span className="font-medium">+{additionalImages} more</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                            <Link href={`/${report._id}`}>
                                <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
                                    <MessageSquare className="h-4 w-4" />
                                    {report.comments.length} Comments
                                </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                        <Badge 
                            variant="secondary" 
                            className={`gap-1 ${statusColors[report.status as keyof typeof statusColors]}`}
                        >
                            <StatusIcon className="h-3 w-3" />
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CrimeCard;
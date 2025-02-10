"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowBigUp,
    ArrowBigDown,
    MessageSquare,
    Share2,
    Award,
    MapPin,
    AlertTriangle,
    Shield,
    Clock,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { CrimePost, CrimeStatus } from "@/types"

const statusIcons: Record<CrimeStatus, React.ElementType> = {
    verified: Shield,
    investigating: AlertTriangle,
    resolved: Clock,
}

const statusColors: Record<CrimeStatus, string> = {
    verified: "text-success",
    investigating: "text-yellow-500",
    resolved: "text-muted-foreground",
}

interface CrimeCardProps {
    post: CrimePost
    onVote: (postId: string, direction: "up" | "down") => void
    votedPosts: Record<string, "up" | "down" | null>
}

export function CrimeCard({ post, onVote, votedPosts }: CrimeCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Card className="crime-card">
            <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onVote(post.id, "up")}
                        className={`p-1 rounded-full transition-colors ${votedPosts[post.id] === "up" ? "text-primary" : "text-muted-foreground"
                            }`}
                    >
                        <ArrowBigUp className="h-6 w-6" />
                    </motion.button>
                    <span className="font-bold">
                        {post.votes + (votedPosts[post.id] === "up" ? 1 : votedPosts[post.id] === "down" ? -1 : 0)}
                    </span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onVote(post.id, "down")}
                        className={`p-1 rounded-full transition-colors ${votedPosts[post.id] === "down" ? "text-destructive" : "text-muted-foreground"
                            }`}
                    >
                        <ArrowBigDown className="h-6 w-6" />
                    </motion.button>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm font-medium">
                                    {post.author.name}
                                    {post.author.isVerified && (
                                        <Badge variant="secondary" className="ml-2">
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(post.timestamp)} ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                                <MapPin className="h-3 w-3" />
                                {post.location}
                            </Badge>
                            {post.status && (
                                <Badge variant="secondary" className={`gap-1 ${statusColors[post.status]}`}>
                                    {React.createElement(statusIcons[post.status], { className: "h-3 w-3" })}
                                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Title and Description */}
                    <div>
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p className="mt-2 text-muted-foreground">{post.description}</p>
                    </div>

                    {/* Images */}
                    {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {post.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image || "/placeholder.svg"}
                                    alt={`Evidence ${index + 1}`}
                                    className="rounded-lg object-cover w-full h-48"
                                />
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setIsExpanded(!isExpanded)}>
                                <MessageSquare className="h-4 w-4" />
                                {post.comments} Comments
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            {post.awards.map((award, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                    <Award className="h-3 w-3" />
                                    {award}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Expanded Comments Section */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Separator className="my-4" />
                                <div className="space-y-4">
                                    {/* Add comments here */}
                                    <p className="text-center text-muted-foreground">No comments yet</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    )
}


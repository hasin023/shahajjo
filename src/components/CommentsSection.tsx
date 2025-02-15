"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { CommentWithAuthorProps } from "@/types"

interface CommentsSectionProps {
    comments: CommentWithAuthorProps[]
    onCommentSubmit: (content: string) => void
}

export function CommentsSection({ comments, onCommentSubmit }: CommentsSectionProps) {
    const [newComment, setNewComment] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return
        onCommentSubmit(newComment)
        setNewComment("")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-2">
                    <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <Button type="submit">Post Comment</Button>
                </form>
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-4 rounded border p-1 bg-white bg-opacity-10">
                            <Avatar>
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.author}`} />
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">{comment.authorName}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                                    </span>
                                </div>
                                <p className="mt-1">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}


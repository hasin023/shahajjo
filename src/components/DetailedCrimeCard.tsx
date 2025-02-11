"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    MapPin,
    AlertTriangle,
    Shield,
    Clock,
    ArrowBigUp,
    ArrowBigDown,
    Calendar,
    MoreVertical,
    CircleCheckBig,
    Image,
    Video,
    ZoomInIcon,
    ZoomOutIcon,
    Edit,
    Trash,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import type { ICrimeReport } from "@/types"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import ReactPlayer from "react-player"

const statusIcons = {
    verified: Shield,
    investigating: Clock,
    resolved: CircleCheckBig,
    "not verified": AlertTriangle,
}

const statusColors = {
    verified: "bg-green-500",
    investigating: "bg-yellow-500",
    resolved: "bg-blue-500",
    "not verified": "bg-red-500",
}

interface DetailedCrimeCardProps {
    report: ICrimeReport
    onVote: (reportId: string, direction: "upvote" | "downvote") => void
    userVote: "upvote" | "downvote" | null
    isAuthor: boolean
    onEdit: () => void
    onDelete: () => void
}

export function DetailedCrimeCard({ report, onVote, userVote, isAuthor, onEdit, onDelete }: DetailedCrimeCardProps) {
    const StatusIcon = statusIcons[report.status as keyof typeof statusIcons]
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    const images = report.images || []
    const videos = report.videos || []

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold">{report.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                            Reported by {report.author?.name} • {formatDistanceToNow(new Date(report.createdAt))} ago
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="outline"
                            className={`${statusColors[report.status as keyof typeof statusColors]} text-white px-2 py-1`}
                        >
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                        {isAuthor && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-500">
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg">{report.description}</p>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Reported on {format(new Date(report.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>

                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative aspect-square cursor-pointer overflow-hidden rounded-md"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Evidence ${index + 1}`}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Image className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {videos.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mt-4">
                            Video clips ({videos.length})
                        </h3>
                        <p className="text-muted-foreground">
                            {report.videoDescription}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {videos.map((video, index) => (
                                <div key={index} className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                                    <ReactPlayer
                                        url={video}
                                        width="100%"
                                        height="100%"
                                        controls
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center space-x-4 mt-4">
                    <button
                        onClick={() => onVote(report._id, "upvote")}
                        className={`flex items-center space-x-1 ${userVote === "upvote" ? "text-green-500" : "text-muted-foreground"}`}
                    >
                        <ArrowBigUp className="w-5 h-5" />
                        <span>{report.upvotes}</span>
                    </button>
                    <button
                        onClick={() => onVote(report._id, "downvote")}
                        className={`flex items-center space-x-1 ${userVote === "downvote" ? "text-red-500" : "text-muted-foreground"}`}
                    >
                        <ArrowBigDown className="w-5 h-5" />
                        <span>{report.downvotes}</span>
                    </button>
                </div>
            </CardContent>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={images.map((image) => ({ src: image }))}
                plugins={[Zoom]}
                zoom={{
                    maxZoomPixelRatio: 5,
                    zoomInMultiplier: 2,
                }}
                carousel={{
                    preload: 3,
                }}
                render={{
                    iconZoomIn: () => <ZoomInIcon />,
                    iconZoomOut: () => <ZoomOutIcon />,
                }}
            />
        </Card>
    )
}


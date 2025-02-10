import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, Shield, Clock, ArrowBigUp, ArrowBigDown, Calendar } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import type { ICrimeReport } from "@/types"

const statusIcons = {
    verified: Shield,
    investigating: AlertTriangle,
    resolved: Clock,
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
    onVote: (reportId: string, direction: "up" | "down") => void
    userVote: "up" | "down" | null
}

export function DetailedCrimeCard({ report, onVote, userVote }: DetailedCrimeCardProps) {
    const StatusIcon = statusIcons[report.status]

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold">{report.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                            Reported by {report.reportedBy} • {formatDistanceToNow(new Date(report.createdAt))} ago
                        </p>
                    </div>
                    <Badge variant="outline" className={`${statusColors[report.status]} text-white px-2 py-1`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
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
                {report.images && report.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {report.images.map((image, index) => (
                            <img
                                key={index}
                                src={image || "/placeholder.svg"}
                                alt={`Evidence ${index + 1}`}
                                className="rounded-md object-cover w-full h-48"
                            />
                        ))}
                    </div>
                )}
                <div className="flex items-center space-x-4 mt-4">
                    <button
                        onClick={() => onVote(report.id, "up")}
                        className={`flex items-center space-x-1 ${userVote === "up" ? "text-green-500" : "text-muted-foreground"}`}
                    >
                        <ArrowBigUp className="w-5 h-5" />
                        <span>{report.upvotes}</span>
                    </button>
                    <button
                        onClick={() => onVote(report.id, "down")}
                        className={`flex items-center space-x-1 ${userVote === "down" ? "text-red-500" : "text-muted-foreground"}`}
                    >
                        <ArrowBigDown className="w-5 h-5" />
                        <span>{report.downvotes}</span>
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}


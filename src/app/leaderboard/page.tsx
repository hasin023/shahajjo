import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const dummyLeaderboardData = [
    { id: 1, name: "John Doe", avatar: "/placeholder.svg", reports: 15, score: 120 },
    { id: 2, name: "Jane Smith", avatar: "/placeholder.svg", reports: 12, score: 95 },
    { id: 3, name: "Bob Johnson", avatar: "/placeholder.svg", reports: 10, score: 80 },
    { id: 4, name: "Alice Brown", avatar: "/placeholder.svg", reports: 8, score: 65 },
    { id: 5, name: "Charlie Davis", avatar: "/placeholder.svg", reports: 6, score: 50 },
]

export default function Leaderboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Community Leaderboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dummyLeaderboardData.map((user, index) => (
                            <div key={user.id} className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-8">
                                    <span
                                        className={`text-lg font-semibold ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : ""}`}
                                    >
                                        {index + 1}
                                    </span>
                                </div>
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.reports} reports</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{user.score}</p>
                                    <p className="text-sm text-muted-foreground">points</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


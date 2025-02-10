"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { userUserLoaded, useUser } from "@/hooks/user";

import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';
import { toPng } from '@dicebear/converter';
import { useRouter } from "next/navigation"

const dummyUser = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg",
    bio: "Concerned citizen and active community member.",
    reportsCount: 15,
    upvotes: 87,
    downvotes: 3,
    verificationScore: 0.92,
    achievements: [
        { name: "First Report", description: "Submitted your first crime report" },
        { name: "Vigilant Citizen", description: "Submitted 10 verified reports" },
        { name: "Community Guardian", description: "Reached a 90% verification score" },
    ],
}

const dummyReports = [
    { id: 1, title: "Robbery at Main Street", date: "2023-05-15", status: "Verified" },
    { id: 2, title: "Vehicle Break-in at Central Park", date: "2023-05-14", status: "Under Investigation" },
    { id: 3, title: "Vandalism at City Hall", date: "2023-05-10", status: "Resolved" },
]

const dummyActivityData = [
    { name: "Jan", reports: 4 },
    { name: "Feb", reports: 3 },
    { name: "Mar", reports: 2 },
    { name: "Apr", reports: 5 },
    { name: "May", reports: 1 },
]

export default function Profile() {
    const [activeTab, setActiveTab] = useState("overview")
    const [user, setUser] = useUser();
    const [userLoaded, _] = userUserLoaded();
    const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
    const router = useRouter();

    useEffect(() => {
        async function generateAvatar() {
            if (!user) return;

            const avatar = createAvatar(shapes, {
                seed: user.name,
            });
            const svg = avatar.toString();
            const png = await toPng(svg);
            const avatarUri = await png.toDataUri();
            setAvatarUrl(avatarUri);
        }

        generateAvatar();
    }, [user?.name]);

    if (!userLoaded) return <div className="text-center">Loading...</div>;
    if (!user) return <div className="text-center">Not logged in</div>;

    const handleVerify = async () => {
        router.push("/verify");
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{user.email}</CardDescription>
                        <Badge
                            variant={user.isVerified ? "secondary" : "destructive"}
                            className={`${user.isVerified ? "bg-green-500 text-white hover:bg-green-500" : ""}`}
                        >
                            {user.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                    </div>

                    <div className="flex gap-2 items-center justify-end mt-4">
                        <Button variant="outline">Edit Profile</Button>
                        {!user.isVerified && <Button onClick={handleVerify} variant="default">Verify</Button>}
                    </div>

                </CardHeader>
                <CardContent>
                    <p className="mb-4">{dummyUser.bio}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{dummyUser.reportsCount}</p>
                            <p className="text-muted-foreground">Reports</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dummyUser.upvotes}</p>
                            <p className="text-muted-foreground">Upvotes</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{dummyUser.downvotes}</p>
                            <p className="text-muted-foreground">Downvotes</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{(dummyUser.verificationScore * 100).toFixed(0)}%</p>
                            <p className="text-muted-foreground">Verification Score</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reports">My Reports</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dummyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="reports" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reports">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Crime Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {dummyReports.map((report) => (
                                    <li key={report.id} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <p className="font-semibold">{report.title}</p>
                                            <p className="text-sm text-muted-foreground">{report.date}</p>
                                        </div>
                                        <Badge>{report.status}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="achievements">
                    <Card>
                        <CardHeader>
                            <CardTitle>Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {dummyUser.achievements.map((achievement, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{achievement.name}</p>
                                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}


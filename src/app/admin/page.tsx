"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

const crimeData = [
    { name: "Jan", crimes: 65 },
    { name: "Feb", crimes: 59 },
    { name: "Mar", crimes: 80 },
    { name: "Apr", crimes: 81 },
    { name: "May", crimes: 56 },
    { name: "Jun", crimes: 55 },
]

const userEngagementData = [
    { name: "Reports", value: 400 },
    { name: "Comments", value: 300 },
    { name: "Upvotes", value: 300 },
    { name: "Downvotes", value: 200 },
]

const crimeTypeData = [
    { name: "Theft", value: 400 },
    { name: "Assault", value: 300 },
    { name: "Burglary", value: 300 },
    { name: "Vandalism", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="crimes">Crimes</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Reports</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">1,234</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">567</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Verification Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">78%</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="crimes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crime Trends</CardTitle>
                            <CardDescription>Monthly crime reports over the past 6 months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={crimeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="crimes" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Crime Types</CardTitle>
                            <CardDescription>Distribution of reported crime types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={crimeTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {crimeTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Engagement</CardTitle>
                            <CardDescription>User activity breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={userEngagementData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}


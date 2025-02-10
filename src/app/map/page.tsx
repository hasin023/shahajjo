"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { addDays } from "date-fns"
import { Sidebar } from "@/components/Sidebar"

const crimeTypes = ["All", "Theft", "Assault", "Burglary", "Vandalism", "Fraud"]

export default function CrimeMap() {
    const [crimeType, setCrimeType] = useState("All")
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 7),
    })

    const handleFilter = () => {
        console.log("Filtering map with:", { crimeType, dateRange })
        // Here you would typically update the map based on the selected filters
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
                <div className="container mx-auto py-6 px-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Filter Crimes</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <Select onValueChange={setCrimeType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select crime type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {crimeTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
                            <Button onClick={handleFilter}>Apply Filters</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Crime Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[600px] w-full rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2675472236477!2d90.38542661492145!3d23.739261184593593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b7a55cd36f%3A0xfcc5b021faff43ea!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1629308474173!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}


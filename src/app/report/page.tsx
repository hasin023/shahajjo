"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { MapProvider } from "@/components/MapProvider"
import AutoCompleteInput from "@/components/AutoCompleteInput"
import { Address } from "@/types"
import toast from "react-hot-toast"
import { Sidebar } from "@/components/Sidebar"

export default function ReportCrime() {
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [description, setDescription] = useState("")
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [address, setAddress] = useState<Address | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const formData = new FormData(e.target as HTMLFormElement);
            formData.append("description", description);
            formData.append("location_name", address?.name || "");
            formData.append("lat", address?.location.lat.toString() || "");
            formData.append("lng", address?.location.lng.toString() || "");
            fetch("/api/user/report", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) toast.error(data.error)
                    else {
                        toast.success("Report submitted successfully!");
                        (e.target as HTMLFormElement).reset();
                    }
                });
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit report. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const generateDescription = async () => {
        if (!image) return

        setIsGeneratingDescription(true)
        // Simulate API call to AI service
        setTimeout(() => {
            setDescription(
                "AI-generated description: A suspicious activity was observed in the uploaded image. The scene appears to show...",
            )
            setIsGeneratingDescription(false)
        }, 3000)
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
                <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Report a Crime</CardTitle>
                    <CardDescription>Provide details about the incident you witnessed</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="Enter crime title" required />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the crime..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="division">Division</Label>
                                <Select>
                                    <SelectTrigger id="division">
                                        <SelectValue placeholder="Select division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dhaka">Dhaka</SelectItem>
                                        <SelectItem value="chittagong">Chittagong</SelectItem>
                                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="district">District</Label>
                                <Select>
                                    <SelectTrigger id="district">
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dhaka-city">Dhaka City</SelectItem>
                                        <SelectItem value="gazipur">Gazipur</SelectItem>
                                        <SelectItem value="narayanganj">Narayanganj</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="crimeTime">Crime Time</Label>
                            <Input id="crimeTime" type="datetime-local" required />
                        </div>
                        <div>
                            <Label htmlFor="image">Upload Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                required
                            />
                        </div>
                        {image && (
                            <Button type="button" onClick={generateDescription} disabled={isGeneratingDescription}>
                                {isGeneratingDescription ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Description...
                                    </>
                                ) : (
                                    "Generate AI Description"
                                )}
                            </Button>
                        )}
                        <div>
                            <Label htmlFor="video">Upload Video (Optional)</Label>
                            <Input id="video" type="file" accept="video/*" />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Report"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
            </main>
        </div>
    )
}


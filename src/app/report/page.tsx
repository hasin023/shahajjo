"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ReportCrime() {
    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [description, setDescription] = useState("")
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            alert("Crime reported successfully!")
        }, 2000)
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
        <div className="max-w-7xl mx-auto space-y-6">
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
    )
}


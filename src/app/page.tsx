"use client"

import { useState } from "react"
import { CrimeCard } from "@/components/CrimeCard"
import { CompactCrimeCard } from "@/components/CompactCrimeCard"
import { Sidebar } from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Card, CardContent } from "@/components/ui/card"
import { addDays } from "date-fns"
import { Filter, SlidersHorizontal, LayoutList, LayoutGrid } from "lucide-react"
import { crimeReports } from "@/libs/dummy-data"

const divisions = ["All", "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]
const crimeTypes = ["All", "Theft", "Robbery", "Assault", "Burglary", "Vandalism", "Fraud", "Accident"]
const sortOptions = ["Most Recent", "Most Upvoted", "Highest Verification Score"]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDivision, setSelectedDivision] = useState("All")
  const [selectedCrimeType, setSelectedCrimeType] = useState("All")
  const [selectedSort, setSelectedSort] = useState("Most Recent")
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"full" | "compact">("full")
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({})

  const handleVote = (reportId: string, direction: "up" | "down") => {
    setUserVotes((prev) => ({
      ...prev,
      [reportId]: prev[reportId] === direction ? null : direction,
    }))
  }

  const filteredReports = crimeReports.filter((report) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const titleMatch = report.title.toLowerCase().includes(searchLower)
      const descriptionMatch = report.description.toLowerCase().includes(searchLower)
      if (!titleMatch && !descriptionMatch) return false
    }

    if (selectedDivision !== "All" && !report.location_name.includes(selectedDivision)) {
      return false
    }

    if (selectedCrimeType !== "All" && report.status !== selectedCrimeType) {
      return false
    }

    return true
  })

  const sortedReports = filteredReports.sort((a, b) => {
    switch (selectedSort) {
      case "Most Recent":
        return b.createdAt.getTime() - a.createdAt.getTime()
      case "Most Upvoted":
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      case "Highest Verification Score":
        return Number(b.verified) - Number(a.verified)
      default:
        return 0
    }
  })

  const CrimeCardComponent = viewMode === "full" ? CrimeCard : CompactCrimeCard

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search crimes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "full" ? "compact" : "full")}
              >
                {viewMode === "full" ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </Button>
            </div>

            {showFilters && (
              <Card className="animate-in">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((division) => (
                          <SelectItem key={division} value={division}>
                            {division}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedCrimeType} onValueChange={setSelectedCrimeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Crime Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {crimeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <div className="sm:col-span-2 md:col-span-3">
                      <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {sortedReports.map((report) => (
              <CrimeCardComponent key={report.id} report={report} onVote={handleVote} userVote={userVotes[report.id]} />
            ))}
            {sortedReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No crimes found matching your criteria</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


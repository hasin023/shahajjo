"use client"

import { useState } from "react"
import CrimeFeed from "@/components/CrimeFeed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, SlidersHorizontal, X } from "lucide-react"

const divisions = ["All", "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"]
const crimeTypes = ["All", "Theft", "Robbery", "Assault", "Burglary", "Vandalism", "Fraud", "Accident"]
const sortOptions = ["Most Recent", "Most Upvoted", "Highest Verification Score"]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDivision, setSelectedDivision] = useState("All")
  const [selectedCrimeType, setSelectedCrimeType] = useState("All")
  const [selectedSort, setSelectedSort] = useState("Most Recent")
  const [showFilters, setShowFilters] = useState(false)

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleClearFilters = () => {
    setSelectedDivision("All")
    setSelectedCrimeType("All")
    setSelectedSort("Most Recent")
  }

  const hasActiveFilters = selectedDivision !== "All" || selectedCrimeType !== "All" || selectedSort !== "Most Recent"

  return (
    <main className="container py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search crimes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-20"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-10 top-1/2 -translate-y-1/2"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="gap-2"
              variant={hasActiveFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 text-xs bg-primary-foreground text-primary px-1.5 rounded-full">
                  {
                    [
                      selectedDivision !== "All",
                      selectedCrimeType !== "All",
                      selectedSort !== "Most Recent",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <Card className="animate-in slide-in-from-top-4 duration-200">
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
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <CrimeFeed
          searchQuery={searchQuery}
          selectedDivision={selectedDivision}
          selectedCrimeType={selectedCrimeType}
          selectedSort={selectedSort}
        />
      </div>
    </main>
  )
}
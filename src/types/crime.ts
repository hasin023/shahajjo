export type CrimeSeverity = "low" | "medium" | "high"
export type CrimeStatus = "verified" | "investigating" | "resolved"

export interface Author {
    name: string
    avatar: string
    isVerified: boolean
}

export interface CrimePost {
    id: string
    title: string
    description: string
    location: string
    type: string
    severity: CrimeSeverity
    timestamp: Date
    author: Author
    votes: number
    comments: number
    awards: string[]
    images?: string[]
    status: CrimeStatus
}


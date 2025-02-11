import { dbConnect } from "@/db/mongodb/connect"
import CrimeReport from "@/db/mongodb/models/CrimeReport"
import User from "@/db/mongodb/models/User"
import UserInfo from "@/db/mongodb/models/UserInfo"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        let limit = Number.parseInt(searchParams.get("limit") || "10", 10)
        let page = Number.parseInt(searchParams.get("page") || "1", 10)
        const search = searchParams.get("search") || ""
        const sort = searchParams.get("sort") || "Most Recent"

        page = Math.max(1, page)
        limit = Math.max(1, Math.min(limit, 20))
        const skip = (page - 1) * limit

        await dbConnect()

        // Build the query
        const query: any = {}
        if (search) {
            query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
        }

        // Determine sort order
        let sortOrder: any = {}
        switch (sort) {
            case "Most Recent":
                sortOrder = { createdAt: -1 }
                break
            case "Most Upvoted":
                sortOrder = { upvotes: -1 }
                break
            case "Highest Verification Score":
                sortOrder = { verified: -1 }
                break
            default:
                sortOrder = { createdAt: -1 }
        }

        const reports = await CrimeReport.find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOrder)
            .lean()

        const authorIds = [...new Set(reports.map(report => report.reportedBy))]

        // Fetch authors' names
        const authors = await User.find({ _id: { $in: authorIds } })
            .select('_id name')
            .lean()

        // Fetch authors' avatars
        const userInfos = await UserInfo.find({
            userId: { $in: authorIds.map(id => id.toString()) }
        })
            .select('userId avatar')
            .lean()

        // Create maps for easy lookup
        const authorMap = new Map(authors.map(author => [author._id.toString(), author.name]))
        const avatarMap = new Map(userInfos.map(info => [info.userId, info.avatar]))

        // Combine reports with author name and avatar
        const contents = reports.map(report => ({
            ...report,
            author: {
                name: authorMap.get(report.reportedBy.toString()) || 'Unknown',
                avatar: avatarMap.get(report.reportedBy.toString()) || ''
            }
        }))

        const totalItems = await CrimeReport.countDocuments(query)

        return NextResponse.json({
            contents,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        })
    } catch (error) {
        console.error("Error: ", error)
        return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
    }
}


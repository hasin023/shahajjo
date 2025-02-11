import { dbConnect } from "@/db/mongodb/connect"
import CrimeReport from "@/db/mongodb/models/CrimeReport"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        let limit = Number.parseInt(searchParams.get("limit") || "10", 10)
        let page = Number.parseInt(searchParams.get("page") || "1", 10)
        const search = searchParams.get("search") || ""
        const sort = searchParams.get("sort") || "Most Recent"

         // Geolocation search params
        const lat = parseFloat(searchParams.get("lat") || "0");
        const lng = parseFloat(searchParams.get("lng") || "0");
        const radius = parseFloat(searchParams.get("radius") || "0"); // In kilometers

        page = Math.max(1, page)
        limit = Math.max(1, Math.min(limit, 20))
        const skip = (page - 1) * limit

        await dbConnect()

        // Build the query
        const query: any = {}
        if (search) {
            query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
        }

        if (lat && lng && radius > 0) {
            query.location = {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius / 6378.1], // Convert radius to radians (Earth radius ≈ 6378.1 km)
                },
            };
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

        const contents = await CrimeReport.find(query).skip(skip).limit(limit).sort(sortOrder)

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


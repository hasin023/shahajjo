import { dbConnect } from "@/db/mongodb/connect"
import Comment from "@/db/mongodb/models/Comment"
import CrimeReport from "@/db/mongodb/models/CrimeReport"
import { getAuth } from "@/libs/auth";
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {

        const loggedInUser = await getAuth(request);

        await dbConnect()
        const report = await CrimeReport.findById(params.id)
        if (!report) {
            return NextResponse.json({ error: "Report not found" }, { status: 404 })
        }

        const comments = await Comment.find({ crimeReportId: params.id }).sort({ createdAt: -1 })
        const isAuthor = loggedInUser.id === report.reportedBy.toString()

        return NextResponse.json({
            report,
            comments,
            isAuthor
        })
    } catch (error) {
        console.error("Error: ", error)
        return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
    }
}


import { dbConnect } from '@/db/mongodb/connect';
import Comment from '@/db/mongodb/models/Comment';
import CrimeReport from '@/db/mongodb/models/CrimeReport';
import Vote from '@/db/mongodb/models/Vote';
import { getAuth } from '@/libs/auth';
import { FILE_DOMAIN } from '@/libs/const';
import { uploadFile } from '@/libs/file-upload';
import { NextResponse, NextRequest } from 'next/server';
import crypto from 'node:crypto';

export async function GET(request: NextRequest) {
    try {
        const loggedInUser = await getAuth(request);
        if (!loggedInUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect()

        const reports = await CrimeReport.find({ reportedBy: loggedInUser.id }).sort({ createdAt: -1 });

        return NextResponse.json({ reports })
    } catch (error) {
        console.error("Error: ", error)
        return NextResponse.json({ error: "Something went wrong..." }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const loggedInUser = await getAuth(request);
        if (!loggedInUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!loggedInUser.isVerified) return NextResponse.json({ error: 'You need to be verified to post' }, { status: 403 });

        const formData = await request.formData();
        const reportedBy = loggedInUser.id;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location_name = formData.get('location_name') as string;
        const crimeTime = formData.get('crimeTime') as string;
        const lat = formData.get('lat');
        const lng = formData.get('lng');
        const images = formData.getAll('images') as File[];
        const videos = formData.getAll('videos') as File[];
        const videoDescription = formData.get('videoDescription') as string;

        if (!title || !description || !location_name || !location_name)
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

        let imageUrls: string[] = [];
        if (images.length !== 0 && images[0].size) imageUrls = await uploadAllImagesParallel(images);
        let videoUrls: string[] = [];
        if (videos.length !== 0 && videos[0].size) videoUrls = await uploadAllImagesParallel(videos);

        await dbConnect();
        const report = await CrimeReport.create({
            reportedBy,
            title,
            description,
            location_name,
            videoDescription,
            crimeTime: new Date(crimeTime),
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            images: imageUrls,
            videos: videoUrls,
        });
        await report.save();
        return NextResponse.json({ message: 'Report created successfully' });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
    try {
        const loggedInUser = await getAuth(request)
        if (!loggedInUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        if (!loggedInUser.isVerified)
            return NextResponse.json({ error: "You need to be verified to edit reports" }, { status: 403 })

        const formData = await request.formData()
        const reportId = formData.get("reportId") as string
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const location_name = formData.get("location_name") as string
        const crimeTime = formData.get("crimeTime") as string
        const lat = formData.get("lat")
        const lng = formData.get("lng")
        const images = formData.getAll("images") as File[]
        const videos = formData.getAll("videos") as File[]
        const videoDescription = formData.get("videoDescription") as string

        if (!reportId) return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });

        await dbConnect();
        const report = await CrimeReport.findById(reportId);
        if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

        if (report.reportedBy.toString() !== loggedInUser.id)
            return NextResponse.json({ error: 'Unauthorized to edit this report' }, { status: 403 });

        let imageUrls: string[] = report.images || []
        if (images.length !== 0 && images[0].size) {
            const newImageUrls = await uploadAllImagesParallel(images)
            imageUrls = [...imageUrls, ...newImageUrls]
        }

        let videoUrls: string[] = report.videos || []
        if (videos.length !== 0 && videos[0].size) {
            const newVideoUrls = await uploadAllImagesParallel(videos)
            videoUrls = [...videoUrls, ...newVideoUrls]
        }

        report.title = title || report.title
        report.description = description || report.description
        report.location_name = location_name || report.location_name
        report.crimeTime = crimeTime ? new Date(crimeTime) : report.crimeTime
        report.location = lat && lng ? { type: "Point", coordinates: [Number(lng), Number(lat)] } : report.location
        report.images = imageUrls
        report.videos = videoUrls
        report.updatedAt = new Date()
        report.videoDescription = videoDescription || report.videoDescription

        await report.save();
        return NextResponse.json({ message: 'Report updated successfully' });

    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}


async function uploadAllImagesParallel(images: File[]): Promise<string[]> {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const uploadPromises = images.map(async (file) => {
        const fileExtension = file.name.split(".").pop();
        const name = `report_${crypto.randomBytes(12).toString("hex")}.${fileExtension}`;
        try {
            await uploadFile(file, name); // Wait for the upload to complete
            return `${protocol}://${FILE_DOMAIN}/${name}`;
        } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            return null; // Return null in case of error
        }
    });
    // Wait for all uploads to finish and filter out any null values
    const imageUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);
    return imageUrls;
}


export async function DELETE(request: NextRequest) {
    try {
        const { reportId } = await request.json();
        if (!reportId) return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });

        const loggedInUser = await getAuth(request);
        if (!loggedInUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!loggedInUser.isVerified) return NextResponse.json({ error: 'You need to be verified to delete post' }, { status: 403 });

        await dbConnect();
        await CrimeReport.findByIdAndDelete(reportId);
        await Comment.deleteMany({ reportId });
        await Vote.deleteMany({ reportId });

        return NextResponse.json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

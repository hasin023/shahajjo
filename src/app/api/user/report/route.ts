import { dbConnect } from '@/db/mongodb/connect';
import CrimeReport from '@/db/mongodb/models/CrimeReport';
import { getAuth } from '@/libs/auth';
import { FILE_DOMAIN } from '@/libs/const';
import { uploadFile } from '@/libs/file-upload';
import { NextResponse, NextRequest } from 'next/server';
import crypto from 'node:crypto';

export async function POST(request: NextRequest) {
    try {
        const loggedInUser = await getAuth(request);
        if (!loggedInUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const formData = await request.formData();
        const reportedBy = loggedInUser.id;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location_name = formData.get('location_name') as string;
        const crimeTime = formData.get('crimeTime') as string;
        const lat = formData.get('lat');
        const lng = formData.get('lng');
        const images = formData.getAll('images') as File[];

        if (!title || !description || !location_name || !location_name || !images) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const imageUrls = await uploadAllImagesParallel(images);
        console.log(imageUrls);
        await dbConnect();
        const report = await CrimeReport.create({
            reportedBy,
            title,
            description,
            location_name,
            crimeTime: new Date(crimeTime),
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            images: imageUrls
        });
        await report.save();
        return NextResponse.json({ error: false, message: 'Report created successfully' });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}


async function uploadAllImagesParallel(images: File[]): Promise<string[]> {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const uploadPromises = images.map(async (file) => {
        const fileExtension = file.name.split(".").pop();
        const name = `${crypto.randomBytes(12).toString("hex")}.${fileExtension}`;
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

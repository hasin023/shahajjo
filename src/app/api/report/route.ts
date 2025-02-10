import { dbConnect } from '@/db/mongodb/connect';
import CrimeReport from '@/db/mongodb/models/CrimeReport';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        let limit = parseInt(searchParams.get('limit') || '50', 10);
        let page = parseInt(searchParams.get('page') || '1', 10);
        page = Math.max(1, page);
        limit = Math.max(1, limit);
        // Calculate the number of items to skip
        const skip = (page - 1) * limit;
        
        await dbConnect();

        const contents = await CrimeReport.find()
        .skip(skip)
        .limit(limit)
        .sort({ created_at: 1 });

        const totalItems = await CrimeReport.countDocuments();

        return NextResponse.json({
            contents,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        });
        
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

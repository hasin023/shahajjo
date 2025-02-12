import Comment from '@/db/mongodb/models/Comment';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { reportId } = await request.json();
        if (!reportId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        const comments = await Comment.find({ crimeReportId: reportId });
        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

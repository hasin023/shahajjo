import { dbConnect } from '@/db/mongodb/connect';
import Comment from '@/db/mongodb/models/Comment';
import { getAuth } from '@/libs/auth';
import { Content } from 'next/font/google';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const loggedInUser = await getAuth(request);
        if (!loggedInUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { reportId, replyOf, content } = await request.json();
        if (!reportId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        await dbConnect();
        const comment = await Comment.create({
            crimeReportId: reportId,
            author: loggedInUser.id,
            content,
            replyOf: replyOf || null,
        });
        return NextResponse.json({ comment });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

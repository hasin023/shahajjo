import { dbConnect } from '@/db/mongodb/connect';
import NotificationSubscription from '@/db/mongodb/models/NotificationSubscription';
import { getAuth } from '@/libs/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { subscription } = await request.json();
        const loggedInUser = await getAuth(request);
        const userId = loggedInUser?.id;

        if (!userId || !subscription)
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

        await dbConnect();
        const sub = NotificationSubscription.findOneAndUpdate(
            { userId },
            { subscription },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

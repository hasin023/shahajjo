import { getAuth } from '@/libs/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

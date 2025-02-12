import CrimeReport from '@/db/mongodb/models/CrimeReport';
import { getAuth } from '@/libs/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { reportId } = await request.json();
        const loggedInUser = await getAuth(request);

        if (!reportId) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        if (!loggedInUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (loggedInUser.role != 'admin') return NextResponse.json({ error: 'Authorized for Admin' }, { status: 403 });
        await CrimeReport.findByIdAndDelete(reportId);
        return NextResponse.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

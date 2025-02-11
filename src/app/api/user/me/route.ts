import UserInfo from '@/db/mongodb/models/UserInfo';
import { getAuth } from '@/libs/auth';
import { uploadFile } from '@/libs/file-upload';
import { NextResponse, NextRequest } from 'next/server';
import crypto from 'node:crypto';

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


export async function PUT(request: NextRequest) {
    try {
        const user = await getAuth(request);
        if (!user)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const formData = await request.formData();
        const avatarImg = formData.get('avatar') as File;
        const bio = formData.get('bio') as string;
        if (!avatarImg && !bio)
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        // Update user info
        const fileExtension = avatarImg.name.split(".").pop();
        const name = `user_${crypto.randomBytes(12).toString("hex")}.${fileExtension}`;
        const avatar = avatarImg ? await uploadFile(avatarImg, name) : '';

        const userInfo = await UserInfo.updateOne({ userId: user.id }, { $set: {
            email: user.email,
            avatar,
            bio,
        } }, {upsert: true });
        return NextResponse.json({ message: "Updated" });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

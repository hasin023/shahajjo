import { dbConnect } from '@/db/mongodb/connect';
import User from '@/db/mongodb/models/User';
import { getAuth } from '@/libs/auth';
import { logger } from '@/libs/logger';
import { sendOTP } from '@/libs/otp';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const loggedInUser = await getAuth(request);
        if (!loggedInUser)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
        await dbConnect();
        const user = await User.findById(loggedInUser.id)
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        if(!user.phoneNumber) return NextResponse.json({ error: "No phone number added yet" }, {status: 401})
        if(user.otpExpiresAt > new Date()) return NextResponse.json({ error: "OTP has not expired yet" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 360000);
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        sendOTP(otp, user.phoneNumber)
        .then((res) => res.json())
        .then((data) => console.log(`Otp Sent: ${JSON.stringify(data)}`))
        .catch((err) => console.log(err));

    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

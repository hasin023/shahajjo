import { dbConnect } from '@/db/mongodb/connect';
import User from '@/db/mongodb/models/User';
import { getAuth } from '@/libs/auth';
import { isPhoneNo, parsePhoneNumber, sendOTP } from '@/libs/otp';
import { NextResponse, NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const { phoneNumber } = await request.json();
        if (!phoneNumber || !isPhoneNo(phoneNumber)) return NextResponse.json({ error: 'Missing or invalid phone number' }, { status: 400 });
        const loggedInUser = await getAuth(request);
        if (!loggedInUser)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const user = await User.findById(loggedInUser.id)
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const newPhoneNumber = parsePhoneNumber(phoneNumber);
        if (user.phoneNumber == newPhoneNumber) return NextResponse.json({ error: 'Phone number is same as before' }, { status: 404 });
        user.phoneNumber = newPhoneNumber;
        user.isVerified = false;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 360000);

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;

        await user.save();

        sendOTP(otp, newPhoneNumber)
            .then((res) => res.json())
            .then((data) => console.log(`Otp Sent: ${JSON.stringify(data)}`))
            .catch((err) => console.log(err));


        return NextResponse.json({ error: false, message: 'Phone number updated successfully' });
    } catch (error) {
        console.error('Error: ', error);
        return NextResponse.json({ error: 'Something went wrong...' }, { status: 500 });
    }
}

import { Model, model, models, Schema } from 'mongoose';

export interface IUser {
    name: string,
    email: string,
    phoneNumber?: string,
    password: string,
    isVerified:boolean,
    otp: string;
    otpExpiresAt: Date;
    role: string,
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, required: true, default: 'user' },
    otp: { type: String, default: '' },
    otpExpiresAt: { type: Date, default: new Date() },
});

const User = models?.user as Model<IUser> || model('user', UserSchema);

export default User;
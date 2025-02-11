export interface IUser {
    name: string,
    email: string,
    phoneNumber?: string,
    password: string,
    isVerified: boolean,
    otp: string;
    otpExpiresAt: Date;
    role: string,
}

export interface IUserInfo {
    userId: string;
    email: string;
    avatar?: string;
    bio?: string;
    address?: string;
}

export interface ICrimeReport {
    id: string;
    title: string;
    description: string;
    location_name: string,
    location: {
        type: string,
        coordinates: number[],
    },
    images: string[],
    videos: string[],
    reportedBy: string,
    upvotes: number,
    downvotes: number
    comments: string[],
    verified: boolean,
    status: 'verified' | 'investigating' | 'resolved' | 'not verified',
    crimeTime: Date,
    updatedAt: Date,
    createdAt: Date
}

export interface IComment {
    author: string;
    content: string;
    replyOf: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface IVote {
    reportId: string;
    userId: string;
    vote: 'upvote' | 'downvote';
    createdAt: Date;
    updatedAt: Date;
}

export type Address = {
    location: { lat: number, lng: number };
    name?: string;
}
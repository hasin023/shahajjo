import { IUserInfo } from '@/types';
import { Model, model, models, Schema } from 'mongoose';

const UserInfoSchema = new Schema<IUserInfo>({
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    reportsCount: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
});

const UserInfo = models?.userInfo as Model<IUserInfo> || model('userInfo', UserInfoSchema);

export default UserInfo;
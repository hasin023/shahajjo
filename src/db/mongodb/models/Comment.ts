import { IComment } from '@/types';
import { Model, model, models, Schema } from 'mongoose';

const CommentSchema = new Schema<IComment>({
    author: { type: String, required: true },
    content: { type: String, required: true },
    replyOf: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Comment = models?.comment as Model<IComment> || model('comment', CommentSchema);

export default Comment;
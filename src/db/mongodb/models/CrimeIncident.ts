import { Model, model, models, Schema } from 'mongoose';

export interface ICrimeReport {

}

const CrimeReportSchema = new Schema<ICrimeReport>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }], // Image URLs
    reportedBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
    upvotes: { type: Number, default: 0 }, // Number of upvotes
    downvotes: { type: Number, default: 0 }, // Number of downvotes
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    verified: { type: Boolean, default: false }, // Admin verification status
    createdAt: { type: Date, default: Date.now }
});

const CrimeReport = models?.crimeReport as Model<ICrimeReport> || model('crimeReport', CrimeReportSchema);

export default CrimeReport;
import { ICrimeReport } from '@/types';
import { Model, model, models, Schema } from 'mongoose';


const CrimeReportSchema = new Schema<ICrimeReport>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location_name: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' }, // 'location.type' must be 'Point'
        coordinates: { type: [Number], required: true, },
      },
    images: [{ type: String }], // Image URLs
    videos: [{ type: String }], // Video URLs
    reportedBy: { type: String, ref: "user", required: true },
    upvotes: { type: Number, default: 0 }, // Number of upvotes
    downvotes: { type: Number, default: 0 }, // Number of downvotes
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    verified: { type: Boolean, default: false }, // Admin verification status
    crimeTime: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['verified', 'investigating', 'resolved', 'not verified'], default: 'not verified' },
    createdAt: { type: Date, default: Date.now }
});
CrimeReportSchema.index({ location: '2dsphere' });
CrimeReportSchema.index({ title: 'text', description: 'text', location_name: 'text' });

const CrimeReport = models?.crimeReport as Model<ICrimeReport> || model('crimeReport', CrimeReportSchema);

export default CrimeReport;
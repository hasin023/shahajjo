import { Model, model, models, Schema } from 'mongoose';

export interface ICrimeReport {

}

const CrimeReportSchema = new Schema<ICrimeReport>({
});

const CrimeReport = models?.crimeReport as Model<ICrimeReport> || model('crimeReport', CrimeReportSchema);

export default CrimeReport;
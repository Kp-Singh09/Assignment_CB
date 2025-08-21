import mongoose from 'mongoose';

const ConcernTreatmentSchema = new mongoose.Schema({
  concern: { type: mongoose.Schema.Types.ObjectId, ref: 'Concern', required: true },
  treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment', required: true },
});

export default mongoose.models.ConcernTreatment ||
  mongoose.model('ConcernTreatment', ConcernTreatmentSchema);

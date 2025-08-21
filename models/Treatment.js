import mongoose from 'mongoose';

const TreatmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Treatment || mongoose.model('Treatment', TreatmentSchema);

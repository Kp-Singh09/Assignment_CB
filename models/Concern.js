import mongoose from 'mongoose';

const ConcernSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Concern || mongoose.model('Concern', ConcernSchema);

import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  clinic_name: { type: String, required: true },
  package_name: { type: String, required: true },
  treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment', required: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);

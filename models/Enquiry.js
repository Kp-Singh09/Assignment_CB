import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  message: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

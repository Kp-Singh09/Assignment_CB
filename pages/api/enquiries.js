import dbConnect from '../../lib/dbConnect';
import Enquiry from '../../models/Enquiry';
import { z } from 'zod';

const enquirySchema = z.object({
  package_id: z.string().min(1),
  user_name: z.string().min(2),
  user_email: z.string().email(),
  message: z.string().max(500).optional(),
});

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const parse = enquirySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }
    const { package_id, user_name, user_email, message } = req.body;
    const enquiry = await Enquiry.create({ package: package_id, user_name, user_email, message });
    return res.status(201).json(enquiry);
  }

  if (req.method === 'GET') {
    const enquiries = await Enquiry.find({}).populate('package');
    return res.json(enquiries);
  }
  return res.status(405).end();
}

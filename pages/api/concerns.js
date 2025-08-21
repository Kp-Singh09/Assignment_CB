import dbConnect from '../../lib/dbConnect';
import Concern from '../../models/Concern';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const concerns = await Concern.find({}).sort({ name: 1 });
      return res.status(200).json(concerns);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch concerns' });
    }
  }

  return res.status(405).end();
}
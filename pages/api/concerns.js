import dbConnect from '../../lib/dbConnect';
import Concern from '../../models/Concern';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Find all concerns in the database and sort them alphabetically
      const concerns = await Concern.find({}).sort({ name: 1 });
      return res.status(200).json(concerns);
    } catch (error) {
      console.error("API Error fetching concerns:", error);
      return res.status(500).json({ error: 'Failed to fetch concerns' });
    }
  }

  // If the request method is not GET, return an error
  return res.status(405).json({ error: 'Method not allowed' });
}
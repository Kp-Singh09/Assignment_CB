import dbConnect from '../../lib/dbConnect';
import Concern from '../../models/Concern';
import ConcernTreatment from '../../models/ConcernTreatment';
import Package from '../../models/Package';

export default async function handler(req, res) {
  await dbConnect();
  const concernQuery = req.query.concern?.trim() || '';
  if (!concernQuery) return res.status(400).json({ error: 'Concern required' });

  // Create a case-insensitive regular expression from the user's query
  const queryRegex = new RegExp(`^${concernQuery}$`, 'i');

  // Search for a concern where the name OR one of the synonyms matches the query
  const concern = await Concern.findOne({
    $or: [
      { name: queryRegex },
      { synonyms: queryRegex }
    ]
  });

  if (!concern) return res.json({ concern: null, treatments: [], packages: [] });

  const concernTreatments = await ConcernTreatment.find({ concern: concern._id }).populate('treatment');
  const treatments = concernTreatments.map(ct => ct.treatment);

  const packages = await Package.find({ treatment: { $in: treatments.map(t => t._id) } }).populate('treatment');

  res.json({
    // Return the official concern name, even if a synonym was used
    concern: { name: concern.name }, 
    treatments,
    packages
  });
}
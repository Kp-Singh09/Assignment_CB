import dbConnect from '../../lib/dbConnect';
import Concern from '../../models/Concern';
import ConcernTreatment from '../../models/ConcernTreatment';
import Treatment from '../../models/Treatment';
import Package from '../../models/Package';

export default async function handler(req, res) {
  await dbConnect();
  const concernQuery = req.query.concern?.trim() || '';
  if (!concernQuery) return res.status(400).json({ error: 'Concern required' });

  // Perform a case-insensitive search using a regular expression
  const concern = await Concern.findOne({ name: { $regex: `^${concernQuery}$`, $options: 'i' } });

  if (!concern) return res.json({ concern: null, treatments: [], packages: [] });

  const concernTreatments = await ConcernTreatment.find({ concern: concern._id }).populate('treatment');
  const treatments = concernTreatments.map(ct => ct.treatment);

  // Get all packages for these treatments
  const packages = await Package.find({ treatment: { $in: treatments.map(t => t._id) } })
    .populate('treatment');

  res.json({
    concern,
    treatments,
    packages
  });
}
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().max(500, 'Message too long (max 500 characters)').optional(),
});

export default function PackageCard({ pkg }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleEnquire(e) {
    e.preventDefault();
    const parse = enquirySchema.safeParse(form);
    if (!parse.success) {
      const fieldErrors = {};
      parse.error.errors.forEach(err => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      toast.error('Please fix the form errors');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg._id,
          user_name: form.name,
          user_email: form.email,
          message: form.message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success('Enquiry submitted successfully!');
      } else {
        toast.error('Failed to submit enquiry');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Enquiry Sent!</h3>
        <p className="text-green-700 text-sm">Thank you! The clinic will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="mb-4">
          <p className="text-sm text-gray-500">{pkg.clinic_name}</p>
          <h3 className="text-lg font-bold text-gray-800">{pkg.package_name}</h3>
        </div>
        
        <div className="bg-teal-50 text-teal-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
          {pkg.treatment.name}
        </div>

        <p className="text-3xl font-bold text-teal-600 mb-4">
          ₹{pkg.price.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full bg-teal-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors duration-200"
        >
          {showForm ? 'Close Form' : 'Enquire Now'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleEnquire} className="space-y-4">
             <input
                type="text"
                required
                placeholder="Your Name"
                // Added text-gray-800 to control the typed text color
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 text-gray-800`}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
             <input
                type="email"
                required
                placeholder="Your Email"
                // Added text-gray-800 to control the typed text color
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 text-gray-800`}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
             <textarea
                placeholder="Message (optional)"
                rows={3}
                // Added text-gray-800 to control the typed text color
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 text-gray-800`}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Confirm Enquiry'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import PackageCard from '../components/PackageCard';
import toast from 'react-hot-toast';

const slideshowImages = [
  '/hero-bg.jpg',
  '/hero-bg-1.jpg',
  '/hero-bg-2.jpg',
  '/hero-bg-3.jpg',
  '/hero-bg-4.jpg',
];

export default function Home() {
  const [concern, setConcern] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predefinedConcerns, setPredefinedConcerns] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const res = await fetch('/api/concerns');
        const data = await res.json();
        setPredefinedConcerns(data);
      } catch (error) { console.error("Failed to fetch concerns", error); }
    };
    fetchConcerns();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!concern.trim()) {
      toast.error('Please enter a concern');
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/search?concern=${encodeURIComponent(concern.trim())}`);
      const data = await res.json();
      if (data.concern && data.packages.length > 0) {
        toast.success(`Found results for "${concern}"`);
      } else {
        toast.error(`No treatments found for "${concern}"`);
      }
      setResult(data);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-white">
          <div className="w-full md:w-1/2 flex flex-col justify-center py-8">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                Find expert care for your skin & hair.
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {/* Changed "we'll" to "we&rsquo;ll" */}
                Tell us your concern, and we&rsquo;ll connect you with top-rated clinics and personalized treatment packages.
              </p>
              <form onSubmit={handleSearch} className="space-y-4">
                <input
                  className="w-full p-4 text-black text-base border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-colors"
                  placeholder="e.g., fine lines & wrinkles"
                  value={concern}
                  onChange={e => setConcern(e.target.value)}
                  disabled={isLoading}
                />
                {predefinedConcerns.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {predefinedConcerns.map(suggestion => (
                      <button
                        key={suggestion._id}
                        type="button"
                        onClick={() => setConcern(suggestion.name)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-teal-100 hover:text-teal-800 transition-colors"
                      >
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg shadow-teal-500/20"
                >
                  {isLoading ? 'Searching...' : 'Search Now'}
                </button>
              </form>
            </div>
          </div>

          <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-full relative overflow-hidden">
            {slideshowImages.map((src, index) => (
              <div
                key={src}
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
                style={{ 
                  backgroundImage: `url(${src})`,
                  opacity: index === currentImageIndex ? 1 : 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      )}

      <div ref={resultsRef}>
        {result && !isLoading && (
          <div id="results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {result.concern && result.packages.length > 0 ? (
              <div className="space-y-10">
                <div className="text-center">
                   {/* Changed quotes to &ldquo; and &rdquo; */}
                  <h2 className="text-3xl font-bold text-gray-800">Results for &ldquo;{result.concern.name}&rdquo;</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {result.packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-500">
                  {/* Changed "couldn't" and quotes */}
                  We couldn&rsquo;t find any packages for &ldquo;{concern}&rdquo;. Please try another concern.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
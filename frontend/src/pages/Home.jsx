import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      //const response = await axios.get('/api/experiences');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/experiences`);
      if (response.data && response.data.data) {
        setExperiences(response.data.data);
      } else if (Array.isArray(response.data)) {
        setExperiences(response.data);
      } else {
        setExperiences([]);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to load experiences. Please try again later.');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (experience) => {
    if (experience.slots?.length && experience.slots[0].price)
      return experience.slots[0].price;
    if (experience.price) return experience.price;
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
        <div className="animate-pulse text-slate-700 text-lg font-medium">
          Loading experiences...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white px-4 text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={fetchExperiences}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium shadow"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!Array.isArray(experiences) || experiences.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
          Discover Amazing Experiences
        </h1>
        <p className="text-slate-600 text-lg mb-12">
          Book unique activities and create unforgettable memories.
        </p>
        <p className="text-slate-500 mb-4">No experiences available right now.</p>
        <button
          onClick={fetchExperiences}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium shadow"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-3">
          Discover Amazing Experiences
        </h1>
        <p className="text-slate-600 text-lg">
          Book unique activities and create unforgettable memories.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((experience) => {
          const price = getPrice(experience);
          return (
            <div
              key={experience._id || experience.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="overflow-hidden relative">
                <img
                  src={experience.images?.[0]?.url || '/placeholder-image.jpg'}
                  alt={experience.images?.[0]?.alt || experience.title}
                  className="w-full h-52 object-cover transform group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  {experience.category || 'Adventure'}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-1">
                    {experience.title || 'Untitled Experience'}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {experience.description || 'No description available.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>📍 {experience.location || 'Unknown'}</span>
                  <span>⏱️ {experience.duration || 'N/A'} hrs</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-grey-200">
                    ${price}
                  </span>
                  <Link
                    to={`/experience/${experience._id || experience.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/experiences/${id}`);
      setExperience(response.data.data);
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    const bookingData = {
      experienceId: id,
      slotDate: selectedSlot.date,
      slotStartTime: selectedSlot.startTime,
      participants,
      experience,
    };

    navigate('/checkout', { state: bookingData });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading experience details...</div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">Experience not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        {/* Header Image */}
        <img
          src={experience.images[0]?.url || '/placeholder-image.jpg'}
          alt={experience.title}
          className="w-full h-72 md:h-[450px] object-cover"
        />

        {/* Content Section */}
        <div className="p-8">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
              <div className="flex items-center flex-wrap gap-4 text-gray-600 text-sm">
                <span>📍 {experience.location}</span>
                <span>⏱️ {experience.duration} hrs</span>
                <span>🎯 {experience.difficulty}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-500 mt-4 md:mt-0">
              ₹{experience.slots?.[0]?.price || 0} per person
            </div>
          </div>

          <p className="text-gray-700 mb-10 leading-relaxed">{experience.description}</p>

          {/* Two-column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">What's Included</h3>
              <ul className="space-y-2">
                {experience.includes?.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-yellow-500 mr-2 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Requirements</h3>
              <ul className="space-y-2">
                {experience.requirements?.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-yellow-500 mr-2 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Booking Card */}
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Available Slots</h3>

              {/* Participants Dropdown */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Participants
                </label>
                <select
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slot Selection */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {experience.slots?.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSlot?.date === slot.date &&
                      selectedSlot?.startTime === slot.startTime
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(slot.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ₹{slot.price * participants}
                        </div>
                        <div className="text-sm text-gray-500">
                          {slot.maxParticipants - slot.bookedParticipants} spots left
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedSlot}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  selectedSlot
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Access denied. Admin rights required.');
      navigate('/');
    }
  }, [user, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    title: 'Sunset Kayaking',
    description: 'Beautiful kayaking experience at sunset',
    category: 'Adventure',
    location: 'Miami Beach, FL',
    duration: '2',
    difficulty: 'Easy',
    price: '65',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchExperiences();
    }
  }, [user]);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get('/api/experiences');
      setExperiences(response.data.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const experienceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        duration: parseInt(formData.duration),
        difficulty: formData.difficulty,
        includes: ['Equipment', 'Guide', 'Safety briefing'],
        requirements: ['Basic swimming skills', 'Comfortable clothing'],
        images: [{ url: formData.imageUrl, alt: formData.title }],
        slots: [{
          date: new Date(Date.now() + 86400000), // Tomorrow
          startTime: "16:00",
          endTime: "18:00",
          maxParticipants: 10,
          bookedParticipants: 0,
          price: parseInt(formData.price)
        }],
        rating: 4.5,
        reviewCount: 0
      };

      await axios.post('/api/admin/experiences', experienceData);
      alert('✅ Experience added successfully!');
      setShowForm(false);
      fetchExperiences();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Adventure',
        location: '',
        duration: '',
        difficulty: 'Easy',
        price: '',
        imageUrl: ''
      });
    } catch (error) {
      console.error('Error adding experience:', error);
      alert('❌ Failed to add experience: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteExperience = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await axios.delete(`/api/admin/experiences/${id}`);
        alert('✅ Experience deleted!');
        fetchExperiences();
      } catch (error) {
        alert('❌ Failed to delete experience');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                {showForm ? 'Cancel' : '➕ Add Experience'}
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Add Experience Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Add New Experience</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Experience title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Food">Food</option>
                  <option value="Nature">Nature</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="65"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Describe the experience..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Add Experience
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Experiences List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">Manage Experiences ({experiences.length})</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Loading experiences...</div>
          ) : experiences.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No experiences yet. Click "Add Experience" to create your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {experiences.map((experience) => (
                    <tr key={experience._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={experience.images[0]?.url}
                          alt={experience.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{experience.title}</div>
                        <div className="text-sm text-gray-500">{experience.location}</div>
                        <div className="text-xs text-gray-400">{experience.category} • {experience.duration}h</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-green-600">
                          ${experience.slots?.[0]?.price || experience.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteExperience(experience._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
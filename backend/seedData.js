const mongoose = require('mongoose');
const Experience = require('./models/Experience');
require('dotenv').config();

const sampleExperiences = [
  {
    title: "Sunset Kayaking Adventure",
    description: "Paddle through calm waters as you watch the sun dip below the horizon. Perfect for beginners and experienced kayakers alike.",
    category: "Adventure",
    location: "Miami Beach, FL",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        alt: "Kayaking at sunset"
      }
    ],
    duration: 2,
    difficulty: "Easy",
    includes: ["Kayak rental", "Life jacket", "Guide", "Bottled water"],
    excludes: ["Transportation", "Meals"],
    requirements: ["Swimming skills recommended", "Comfortable clothing"],
    slots: [
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        startTime: "16:00",
        endTime: "18:00",
        maxParticipants: 10,
        bookedParticipants: 2,
        price: 65
      },
      {
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        startTime: "16:00",
        endTime: "18:00",
        maxParticipants: 10,
        bookedParticipants: 5,
        price: 65
      }
    ],
    rating: 4.8,
    reviewCount: 124,
    featured: true
  },
  {
    title: "Mountain Hiking Expedition",
    description: "Challenge yourself with this breathtaking hike through scenic mountain trails with panoramic views.",
    category: "Nature",
    location: "Rocky Mountains, CO",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        alt: "Mountain hiking"
      }
    ],
    duration: 6,
    difficulty: "Difficult",
    includes: ["Professional guide", "Hiking poles", "Lunch", "First aid"],
    excludes: ["Hiking boots", "Backpack"],
    requirements: ["Good physical condition", "Hiking experience"],
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "08:00",
        endTime: "14:00",
        maxParticipants: 8,
        bookedParticipants: 3,
        price: 120
      }
    ],
    rating: 4.9,
    reviewCount: 89,
    featured: true
  },
  {
    title: "Wine Tasting Tour",
    description: "Explore local vineyards and sample award-winning wines with expert sommeliers.",
    category: "Food",
    location: "Napa Valley, CA",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        alt: "Wine tasting"
      }
    ],
    duration: 4,
    difficulty: "Easy",
    includes: ["Wine tasting", "Cheese platter", "Vineyard tour", "Expert guide"],
    excludes: ["Transportation", "Additional purchases"],
    requirements: ["Must be 21 or older", "ID required"],
    slots: [
      {
        date: new Date(Date.now() + 86400000),
        startTime: "13:00",
        endTime: "17:00",
        maxParticipants: 15,
        bookedParticipants: 8,
        price: 85
      }
    ],
    rating: 4.7,
    reviewCount: 203,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Experience.deleteMany({});
    console.log('Cleared existing experiences');

    // Insert sample data
    await Experience.insertMany(sampleExperiences);
    console.log('Sample experiences added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
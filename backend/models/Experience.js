const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  bookedParticipants: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  }
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter experience title'],
    trim: true,
    maxLength: [100, 'Experience title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter experience description']
  },
  category: {
    type: String,
    required: [true, 'Please enter experience category'],
    enum: ['Adventure', 'Cultural', 'Food', 'Nature', 'Urban']
  },
  location: {
    type: String,
    required: [true, 'Please enter experience location']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  duration: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult'],
    default: 'Moderate'
  },
  includes: [String],
  excludes: [String],
  requirements: [String],
  slots: [slotSchema],
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
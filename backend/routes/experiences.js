const express = require('express');
const Experience = require('../models/Experience');
const router = express.Router();

// Get all experiences
// Get all experiences
router.get('/', async (req, res) => {
  try {
    // Include slots but only with price information
    const experiences = await Experience.find().select('title description category location images duration difficulty rating reviewCount featured slots.price');
    
    // If no experiences in database, return sample data
    if (!experiences || experiences.length === 0) {
      console.log('No experiences in database');
      return res.json({
        success: true,
        data: []
      });
    }
    
    res.json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: []
    });
  }
});

// Get single experience with slots
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
        data: null
      });
    }

    // Filter available slots (not fully booked)
    const availableSlots = experience.slots.filter(slot => 
      slot.bookedParticipants < slot.maxParticipants
    );

    res.json({
      success: true,
      data: {
        ...experience.toObject(),
        slots: availableSlots
      }
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
});

module.exports = router;
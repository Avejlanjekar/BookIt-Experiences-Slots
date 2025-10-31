const express = require('express');
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');
const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      experienceId,
      slotDate,
      slotStartTime,
      participants,
      customerInfo,
      promoCode
    } = req.body;

    // Get experience and slot
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    const slot = experience.slots.find(s => 
      s.date.toISOString() === new Date(slotDate).toISOString() &&
      s.startTime === slotStartTime
    );

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'Slot not available'
      });
    }

    // Check availability
    if (slot.bookedParticipants + participants > slot.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Not enough spots available'
      });
    }

    // Calculate amounts
    const totalAmount = slot.price * participants;
    let discountAmount = 0;
    let finalAmount = totalAmount;

    // Apply promo code if provided (simplified)
    if (promoCode === 'SAVE10') {
      discountAmount = totalAmount * 0.1;
      finalAmount = totalAmount - discountAmount;
    } else if (promoCode === 'FLAT100') {
      discountAmount = 100;
      finalAmount = totalAmount - discountAmount;
    }

    // Create booking
    const booking = await Booking.create({
      experience: experienceId,
      user: req.user.id,
      slot: {
        date: slotDate,
        startTime: slotStartTime,
        endTime: slot.endTime
      },
      participants,
      customerInfo,
      totalAmount,
      discountAmount,
      finalAmount,
      promoCode: promoCode || undefined
    });

    // Update slot booked participants
    slot.bookedParticipants += participants;
    await experience.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('experience', 'title images location');
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
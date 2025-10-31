const express = require('express');
const PromoCode = require('../models/PromoCode');
const router = express.Router();

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      active: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!promoCode) {
      return res.json({
        success: false,
        message: 'Invalid or expired promo code'
      });
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return res.json({
        success: false,
        message: 'Promo code usage limit exceeded'
      });
    }

    // Check minimum amount
    if (totalAmount < promoCode.minAmount) {
      return res.json({
        success: false,
        message: `Minimum amount of $${promoCode.minAmount} required`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = totalAmount * (promoCode.discountValue / 100);
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount;
      }
    } else {
      discount = promoCode.discountValue;
    }

    res.json({
      success: true,
      data: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discountAmount: discount,
        finalAmount: totalAmount - discount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
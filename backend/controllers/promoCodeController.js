import PromoCode from '../models/promoCodeModel.js';

// Create a new promo code (admin only)
export const createPromoCode = async (req, res) => {
  try {
    const promoCodeData = req.body;
    
    // Check if promo code already exists
    const existingPromoCode = await PromoCode.findOne({ code: promoCodeData.code.toUpperCase() });
    if (existingPromoCode) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }
    
    // Create new promo code
    const promoCode = new PromoCode({
      ...promoCodeData,
      code: promoCodeData.code.toUpperCase()
    });
    
    await promoCode.save();
    
    res.status(201).json({
      success: true,
      message: 'Promo code created successfully',
      promoCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create promo code',
      error: error.message
    });
  }
};

// Get all promo codes (admin only)
export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json({
      success: true,
      count: promoCodes.length,
      promoCodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get promo codes',
      error: error.message
    });
  }
};

// Get a specific promo code by ID (admin only)
export const getPromoCodeById = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }
    
    res.status(200).json({
      success: true,
      promoCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get promo code',
      error: error.message
    });
  }
};

// Update a promo code (admin only)
export const updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    
    const promoCode = await PromoCode.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Promo code updated successfully',
      promoCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update promo code',
      error: error.message
    });
  }
};

// Delete a promo code (admin only)
export const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Promo code deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete promo code',
      error: error.message
    });
  }
};

// Validate a promo code (for users)
export const validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }
    
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    
    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promo code'
      });
    }
    
    // Check usage limit
    if (promoCode.usageLimit !== null && promoCode.usageCount >= promoCode.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Promo code usage limit reached'
      });
    }
    
    // Check minimum order amount
    if (orderAmount && promoCode.minOrderAmount > orderAmount) {
      return res.status(400).json({
        success: false,
        message: `Order amount must be at least ${promoCode.minOrderAmount} to use this promo code`
      });
    }
    
    // Calculate discount
    let discountAmount;
    if (promoCode.isPercentage) {
      discountAmount = (orderAmount * promoCode.discount) / 100;
      
      // Apply maximum discount cap if specified
      if (promoCode.maxDiscountAmount && discountAmount > promoCode.maxDiscountAmount) {
        discountAmount = promoCode.maxDiscountAmount;
      }
    } else {
      discountAmount = promoCode.discount;
    }
    
    // Increment usage count
    promoCode.usageCount += 1;
    await promoCode.save();
    
    res.status(200).json({
      success: true,
      message: 'Promo code applied successfully',
      promoCode: {
        code: promoCode.code,
        discount: promoCode.discount,
        isPercentage: promoCode.isPercentage,
        discountAmount: discountAmount.toFixed(2),
        description: promoCode.description
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code',
      error: error.message
    });
  }
};

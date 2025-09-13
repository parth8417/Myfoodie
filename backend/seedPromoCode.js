import mongoose from 'mongoose';
import PromoCode from './models/promoCodeModel.js';
import { connectDB } from './config/db.js';
import 'dotenv/config';

// Connect to MongoDB
connectDB();

// Set end date for promo codes (6 months from now)
const endDate = new Date();
endDate.setMonth(endDate.getMonth() + 6);

// Sample promo codes
const promoCodes = [
  {
    code: 'WELCOME10',
    discount: 10,
    isPercentage: true,
    minOrderAmount: 0,
    maxDiscountAmount: 100,
    endDate: endDate,
    isActive: true,
    description: 'Get 10% off on your first order'
  },
  {
    code: 'SAVE20',
    discount: 20,
    isPercentage: true,
    minOrderAmount: 500,
    maxDiscountAmount: 200,
    endDate: endDate,
    isActive: true,
    description: 'Get 20% off on orders above ₹500 (up to ₹200)'
  },
  {
    code: 'FLAT50',
    discount: 50,
    isPercentage: false,
    minOrderAmount: 300,
    maxDiscountAmount: null,
    endDate: endDate,
    isActive: true,
    description: 'Flat ₹50 off on orders above ₹300'
  }
];

// Function to seed promo codes
const seedPromoCodes = async () => {
  try {
    // Delete existing promo codes
    await PromoCode.deleteMany({});
    console.log('All existing promo codes deleted');
    
    // Insert new promo codes
    const createdPromoCodes = await PromoCode.insertMany(promoCodes);
    console.log(`${createdPromoCodes.length} promo codes created successfully`);
    
    process.exit();
  } catch (error) {
    console.error(`Error seeding promo codes: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedPromoCodes();

import express from 'express';
import { 
  createPromoCode, 
  getAllPromoCodes, 
  getPromoCodeById, 
  updatePromoCode, 
  deletePromoCode, 
  validatePromoCode 
} from '../controllers/promoCodeController.js';
import { protect, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/validate', validatePromoCode);

// Admin routes
router.post('/', protect, adminMiddleware, createPromoCode);
router.get('/', protect, adminMiddleware, getAllPromoCodes);
router.get('/:id', protect, adminMiddleware, getPromoCodeById);
router.put('/:id', protect, adminMiddleware, updatePromoCode);
router.delete('/:id', protect, adminMiddleware, deletePromoCode);

export default router;

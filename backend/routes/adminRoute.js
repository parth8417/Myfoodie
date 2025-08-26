import express from 'express';
import { getAdminSummary } from '../controllers/adminController.js';

const adminRouter = express.Router();

// GET /api/admin/summary - Get admin dashboard summary
adminRouter.get("/summary", getAdminSummary);

export default adminRouter;

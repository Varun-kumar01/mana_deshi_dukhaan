import express from 'express';
import { validateCoupon, getCoupons } from '../controllers/couponController.js';

const router = express.Router();
router.get('/validate', validateCoupon);
router.get('/', getCoupons);

export default router;

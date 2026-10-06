import express from 'express';
import { checkPincode, getAllPincodes } from '../controllers/pincodeController.js';

const router = express.Router();
router.get('/check/:pincode', checkPincode);
router.get('/', getAllPincodes);

export default router;

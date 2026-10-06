import express from 'express';
import {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:identifier', getOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;

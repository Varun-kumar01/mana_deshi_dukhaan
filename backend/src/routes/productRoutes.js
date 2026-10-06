import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getInventory,
  updateVariantStock
} from '../controllers/productController.js';

const router = express.Router();

router.get('/inventory', getInventory);
router.post('/bulk', bulkUploadProducts);
router.patch('/variants/:variantId/stock', updateVariantStock);

router.get('/', getProducts);
router.get('/:identifier', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

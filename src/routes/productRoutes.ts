import { Router } from 'express';
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
  searchProducts,
} from '../controller/productController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequestBody, validateQueryParams } from '../middleware/validationMiddleware';

const router = Router();

router.get('/All-Products', getAllProducts);
router.post('/Create-Products', authenticateToken, validateRequestBody(['name', 'categories', 'buy_price', 'sell_price', 'stock']), createProduct);
router.delete('/Delete-Products', authenticateToken, validateRequestBody(['id']), deleteProduct);
router.put('/Edit-Products', authenticateToken, validateRequestBody(['id', 'name', 'categories', 'buy_price', 'sell_price', 'stock']), editProduct);
router.get('/Detail-Products', validateQueryParams(['id']), getProductDetail);
router.get('/Search-Products', validateQueryParams(['query']), searchProducts);

export default router;
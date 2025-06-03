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
import { authorizeRoles } from '../middleware/authorizeRoles';
import { createProductSchema, deleteProductSchema, updateProductSchema } from '../Schemas/productSchemas'; 

const router = Router();

router.get('/All-Products', getAllProducts);
router.post('/Create-Products', authenticateToken, authorizeRoles('ADMIN'), validateRequestBody(createProductSchema), createProduct); 
router.delete('/Delete-Products', authenticateToken, authorizeRoles('ADMIN'), validateRequestBody(deleteProductSchema), deleteProduct); 
router.put('/Edit-Products', authenticateToken, authorizeRoles('ADMIN'), validateRequestBody(updateProductSchema), editProduct); 
router.get('/Detail-Products', validateQueryParams(['id']), getProductDetail);
router.get('/Search-Products', validateQueryParams(['query']), searchProducts);

export default router;
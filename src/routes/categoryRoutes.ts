import { Router } from 'express';
import { addCategory, deleteCategory, getAllCategories, getCategoryById } from '../controller/categoryController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequestBody, validatePathParams } from '../middleware/validationMiddleware';

const router = Router();

router.post('/add-categories', authenticateToken, validateRequestBody(['categories']), addCategory);
router.delete('/delete-categories', authenticateToken, validateRequestBody(['id', 'categories']), deleteCategory);
router.get('/All-categories', getAllCategories);
router.get('/:id', validatePathParams(['id']), getCategoryById); // Using :id for path parameter

export default router;
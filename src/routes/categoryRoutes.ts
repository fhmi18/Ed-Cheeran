import { Router } from 'express';
import { addCategory, deleteCategory, getAllCategories, getCategoryById } from '../controller/categoryController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequestBody, validatePathParams } from '../middleware/validationMiddleware';
import { z } from 'zod';

const addCategorySchema = z.object({
  categories: z.array(z.string())
});

const deleteCategorySchema = z.object({
  id: z.string(),
  categories: z.array(z.string())
});

const router = Router();

router.post('/add-categories', authenticateToken, validateRequestBody(addCategorySchema), addCategory);
router.delete('/delete-categories', authenticateToken, validateRequestBody(deleteCategorySchema), deleteCategory);
router.get('/All-categories', getAllCategories);
router.get('/:id', validatePathParams(['id']), getCategoryById); 

export default router;
import { Router } from 'express';
import { getBestSellingItems, getCustomerFavoriteItems } from '../controller/recommendController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateQueryParams, validatePathParams } from '../middleware/validationMiddleware';

const router = Router();

router.get('/best-items', authenticateToken, getBestSellingItems);
router.get('/favorite-Customer/:id', authenticateToken, validatePathParams(['id']), getCustomerFavoriteItems);

export default router;
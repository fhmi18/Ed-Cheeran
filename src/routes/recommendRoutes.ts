import { Router } from 'express';
import { getBestSellingItems } from '../controller/recommendController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/best-items', authenticateToken, getBestSellingItems);

export default router;
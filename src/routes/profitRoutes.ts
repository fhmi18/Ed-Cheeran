import { Router } from 'express';
import { getDailyProfit, getWeeklyProfit, getMonthlyProfit } from '../controller/profitController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateQueryParams } from '../middleware/validationMiddleware';

const router = Router();

router.get('/Daily', authenticateToken, validateQueryParams(['date']), getDailyProfit);
router.get('/Weekly', authenticateToken, validateQueryParams(['start_date', 'end_date']), getWeeklyProfit);
router.get('/Monthly', authenticateToken, validateQueryParams(['month']), getMonthlyProfit);

export default router;
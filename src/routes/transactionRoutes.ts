import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/authorizeRoles';
import { validateRequestBody, validateQueryParams } from '../middleware/validationMiddleware';
import { createTransaction, getAllTransactions, getTransactionDetail } from '../controller/transactionController';
import { createTransactionSchema } from '../Schemas/transactionSchemas';

const router = Router();
router.post('/create', authenticateToken, authorizeRoles('KASIR', 'ADMIN'), validateRequestBody(createTransactionSchema), createTransaction);
router.get('/all', authenticateToken, authorizeRoles('ADMIN', 'KASIR'), getAllTransactions);
router.get('/detail/:id', authenticateToken, authorizeRoles('ADMIN', 'KASIR'), getTransactionDetail);

export default router;
import { Router } from 'express';
import { register, login, logout } from '../controller/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const router = Router();

router.post('/Register', validateRequestBody(['nama', 'password']), register);
router.post('/Login', validateRequestBody(['nama', 'password']), login);
router.post('/Logout', authenticateToken, logout);

export default router;
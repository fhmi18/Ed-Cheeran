import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controller/authController'; 
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';

const router = Router();

router.post('/Register', validateRequestBody(['nama', 'email', 'password', 'confirm']), register); 
router.post('/Login', validateRequestBody(['email', 'password']), login);
router.post('/Logout', authenticateToken, logout);
router.post('/Refresh-Token', validateRequestBody(['refreshToken']), refreshToken); 

export default router;
import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controller/authController'; 
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequestBody } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../Schemas/authSchemas';

const router = Router();

router.post('/Register', validateRequestBody(registerSchema), register);
router.post('/Login', validateRequestBody(loginSchema), login);
router.post('/Logout', authenticateToken, logout);
router.post('/Refresh-Token', validateRequestBody(refreshTokenSchema), refreshToken);

export default router;
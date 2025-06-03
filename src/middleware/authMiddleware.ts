import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../handler/errorHandler';
import { AuthRequest } from '../types/authTypes';

export const authenticateToken = (req: AuthRequest, _res: unknown, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  jwt.verify(token, process.env.ACCESS_KEY as string, (err, user) => {
   if (err instanceof jwt.TokenExpiredError) {
        return next(new AppError('Forbidden: Token Expired', 403));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Forbidden: Invalid Token', 403));
    }
  
    req.user = user as { id: number; role: string };
    next();
  });
};
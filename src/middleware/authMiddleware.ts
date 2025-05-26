import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../handler/errorHandler';
import { AuthRequest } from '../types/authTypes';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  jwt.verify(token, process.env.ACCESS_KEY as string, (err, user) => {
    if (err) {
      return next(new AppError('Forbidden', 403));
    }
    req.user = user as { id: number };
    next();
  });
};
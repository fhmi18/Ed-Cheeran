import { Request, Response, NextFunction } from 'express';
import { AppError } from '../handler/errorHandler';
import { AuthRequest } from '../types/authTypes';

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('User role not found or unauthorized', 403));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have permission to perform this action', 403));
    }
    next();
  };
};
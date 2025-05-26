import { Request, Response, NextFunction } from 'express';
import { AppError } from '../handler/errorHandler';

export const validateRequestBody = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return next(new AppError(`Missing required field: ${field}`, 400));
      }
    }
    next();
  };
};

export const validateQueryParams = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.query[field]) {
        return next(new AppError(`Missing required query parameter: ${field}`, 400));
      }
    }
    next();
  };
};

export const validatePathParams = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.params[field]) {
        return next(new AppError(`Missing required path parameter: ${field}`, 400));
      }
    }
    next();
  };
};
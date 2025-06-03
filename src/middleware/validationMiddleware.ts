import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod'; 
import { AppError } from '../handler/errorHandler';
import { catchAsync } from '../utils/catchAsync';

export const validateRequestBody = (schema: ZodSchema) => { 
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); 
      next();
    } catch (error: any) {
      return next(new AppError(`Invalid request body: ${error.errors.map((e: any) => e.message).join(', ')}`, 400));
    }
  });
};

export const validateQueryParams = (fields: string[]) => { 
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.query[field]) {
        return next(new AppError(`Missing required query parameter: ${field}`, 400));
      }
    }
    next();
  });
};

export const validatePathParams = (fields: string[]) => { 
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (!req.params[field]) {
        return next(new AppError(`Missing required path parameter: ${field}`, 400));
      }
    }
    next();
  });
};
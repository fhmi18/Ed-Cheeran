import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import jwt from 'jsonwebtoken'; 
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err); 

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') { 
      statusCode = 400;
      message = `Duplicate field value: ${err.meta?.target}`;
    } 
    if (err.code === 'P2025') { 
      statusCode = 404;
      message = `Record not found: ${err.meta?.cause || 'The requested resource does not exist.'}`;
    } 
    if (err.code === 'P2003') { 
      statusCode = 400;
      message = `Foreign key constraint failed: ${err.meta?.field_name || ''}`;
    } 
    if (err.code === 'P2014') { 
      statusCode = 400;
      message = `Relation violation: ${err.meta?.relation_name || ''}`;
    }
    if (err.code === 'P2016') { 
      statusCode = 400;
      message = `Query error: ${err.meta?.details || ''}`;
    }
    
  }
  if (err instanceof jwt.NotBeforeError) {
    statusCode = 403;
    message = 'Token not active yet';
  }
  if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 403;
    message = 'Invalid Token';
  }
  if (err instanceof jwt.TokenExpiredError) {
    statusCode = 403;
    message = 'Token Expired';
  }

  res.status(statusCode).json({
    message,
    statusCode,
  });
};
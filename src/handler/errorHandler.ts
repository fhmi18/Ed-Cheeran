import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); 
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server ERROR';

  if (err.code === 'P2002') { 
    return res.status(400).json({
      message: `Duplicate field value: ${err.meta?.target}`,
      statusCode: 400,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid Token', statusCode: 401 });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token Expired', statusCode: 401 });
  }

  res.status(statusCode).json({
    message,
    statusCode,
  });
};
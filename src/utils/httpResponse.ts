import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, message: string, data: any = null) => {
  res.status(statusCode).json({
    message,
    ...(data && { data }),
  });
};

export const sendError = (res: Response, statusCode: number, message: string, error: any = null) => {
  res.status(statusCode).json({
    message,
    statusCode,
    ...(error && { error }),
  });
};
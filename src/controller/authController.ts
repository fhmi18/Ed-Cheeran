import { Request, Response, NextFunction } from 'express';
import * as authQueries from '../queries/authQueries';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { sendSuccess } from '../utils/httpResponse';
import { AuthRequest } from '../types/authTypes';
import { AppError } from '../handler/errorHandler';
import { catchAsync } from '../utils/catchAsync'; 
import jwt from 'jsonwebtoken';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { nama, email, password, confirm } = req.body; 
  if (password !== confirm) {
    return next(new AppError('Password and confirm password do not match', 400));
  }
  const user = await authQueries.registerUser(nama, email, password);
  sendSuccess(res, 201, 'register berhasil', { 'id-Register': user.id, nama: user.username, email: user.email });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await authQueries.loginUser(email, password);

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  sendSuccess(res, 200, 'Login berhasil', {
    'id-Login': user.id,
    nama: user.username,
    email: user.email,
    accessToken,
    refreshToken,
  });
});

export const logout = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  sendSuccess(res, 200, 'berhasil Logout');
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh Token is required', 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY as string) as { id: number };
    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id); 

    sendSuccess(res, 200, 'Token refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error instanceof jwt.NotBeforeError) {
      return next(new AppError('Refresh Token not active yet', 403));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid Refresh Token', 403));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Refresh Token Expired', 403));
    }
    next(error); 
  }
});
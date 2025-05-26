import { Request, Response, NextFunction } from 'express';
import * as authQueries from '../queries/authQueries';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/httpResponse';
import { AuthRequest } from '../types/authTypes';
import { AppError } from '../handler/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nama, password } = req.body;
    const user = await authQueries.registerUser(nama, password);
    sendSuccess(res, 201, 'register berhasil', { 'id-Register': user.id, nama: user.username, password: 'password' }); 
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      return next(new AppError('Username already exists', 400));
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nama, password } = req.body;
    const user = await authQueries.loginUser(nama, password);

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    sendSuccess(res, 200, 'Login berhasil', {
      'id-Login': user.id,
      nama: user.username,
      password: 'password', 
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  sendSuccess(res, 200, 'berhasil Logout');
};
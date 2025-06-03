import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';
dotenv.config();

const ACCESS_KEY = process.env.ACCESS_KEY as string;
const REFRESH_KEY = process.env.REFRESH_KEY as string;

export const generateAccessToken = (user: { id: number; role: string }) => {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_KEY, { expiresIn: '15m' });
};


export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ id: userId }, REFRESH_KEY, { expiresIn: '7d' }); 
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_KEY);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_KEY);
};
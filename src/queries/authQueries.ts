// src/queries/authQueries.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../handler/errorHandler';

const prisma = new PrismaClient();
const saltRounds = 4;

export const registerUser = async (username: string, passwordPlain: string) => {
  const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);
  return prisma.user.create({
    data: {
      username,
      email: `${username}@gmail.com`,
      password: hashedPassword,
    },
  });
};

export const loginUser = async (username: string, passwordPlain: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(passwordPlain, user.password))) {
    return null;
  }
  return user;
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCategory = async (categories: string, description?: string) => {
  return prisma.category.create({
    data: {
      categories,
      description,
    },
  });
};

export const deleteCategory = async (id: number) => {
  return prisma.category.delete({
    where: { id },
  });
};

export const findAllCategories = async () => {
  return prisma.category.findMany();
};

export const findCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
  });
};
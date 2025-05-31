import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      categories: true,
    },
  });
};

export const createProduct = async (name: string, categoryName: string, buy_price: number, sell_price: number, stock: number) => {
  let category = await prisma.category.findFirst({
    where: { categories: categoryName },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { categories: categoryName, description: `Auto-created category for ${categoryName}` },
    });
  }

  return prisma.product.create({
    data: {
      name,
      categoryId: category.id,
      buy_price,
      sell_price,
      stock,
    },
    include: {
      categories: true,
    },
  });
};

export const deleteProduct = async (id: number, name:string) => {
  return prisma.product.delete({
    where: { id, name },
  });
};

export const updateProduct = async (id: number, name: string, categoryName: string, buy_price: number, sell_price: number, stock: number) => {
  let category = await prisma.category.findFirst({
    where: { categories: categoryName },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { categories: categoryName, description: `Auto-created category for ${categoryName}` },
    });
  }

  return prisma.product.update({
    where: { id },
    data: {
      name,
      categoryId: category.id,
      buy_price,
      sell_price,
      stock,
    },
    include: {
      categories: true,
    },
  });
};

export const findProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });
};

export const searchProducts = async (query: string) => {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { categories: { categories: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      categories: true,
    },
  });
};
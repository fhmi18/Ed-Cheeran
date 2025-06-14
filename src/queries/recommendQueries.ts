import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findBestSellingProducts = async (limit: number = 10) => {
  const bestSelling = await prisma.transactionItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: limit,
  });

  const productDetails = await Promise.all(
    bestSelling.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });
      return {
        product_id: item.productId,
        product_name: product?.name || 'Unknown Product',
        total_sold: item._sum.quantity || 0,
      };
    })
  );

  return productDetails;
};

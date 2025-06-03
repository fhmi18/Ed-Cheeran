import prisma from '../utils/prisma';
import { AppError } from '../handler/errorHandler';

interface TransactionItemInput {
  productId: number;
  quantity: number;
}

export const createTransaction = async (items: TransactionItemInput[]) => {
  let totalPayment = 0; 
  let totalProfit = 0;  
  const transactionItemsData = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new AppError(`Product with ID ${item.productId} not found`, 404);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`, 400);
    }

    const itemSellPrice = product.sell_price; 
    const itemBuyPrice = product.buy_price; 
    const itemTotalSellPrice = itemSellPrice * item.quantity;
    const itemProfit = (itemSellPrice - itemBuyPrice) * item.quantity; 

    totalPayment += itemTotalSellPrice;
    totalProfit += itemProfit;

    transactionItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: itemSellPrice, 
    });

    // Kurangi stok produk
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: product.stock - item.quantity },
    });
  }

  const newTransaction = await prisma.transaction.create({
    data: {
      invoice: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`, 
      date: new Date(),
      total: totalPayment, 
      items: {
        createMany: {
          data: transactionItemsData,
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return newTransaction;
};

export const findAllTransactions = async () => {
  const transactions = await prisma.transaction.findMany({
    include: {
      items: {
        include: {
          product: true, 
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions.map(transaction => {
    let transactionProfit = 0;
    const itemsWithDetails = transaction.items.map(item => {
      const profitPerItem = (item.price - item.product.buy_price) * item.quantity;
      transactionProfit += profitPerItem;
      return {
        productId: item.productId,
        product_name: item.product.name,
        quantity: item.quantity,
        price_per_unit: item.price, 
        item_total_price: item.price * item.quantity, 
        item_profit: profitPerItem, 
      };
    });

    return {
      id: transaction.id,
      invoice: transaction.invoice,
      date: transaction.date,
      total_payment: transaction.total, 
      total_profit_from_transaction: transactionProfit, 
      items: itemsWithDetails,
    };
  });
};

export const findTransactionById = async (id: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!transaction) {
    return null;
  }

  let transactionProfit = 0;
  const itemsWithDetails = transaction.items.map(item => {
    const profitPerItem = (item.price - item.product.buy_price) * item.quantity;
    transactionProfit += profitPerItem;
    return {
      productId: item.productId,
      product_name: item.product.name,
      quantity: item.quantity,
      price_per_unit: item.price, 
      item_total_price: item.price * item.quantity, 
      item_profit: profitPerItem, 
    };
  });

  return {
    id: transaction.id,
    invoice: transaction.invoice,
    date: transaction.date,
    total_payment: transaction.total,
    total_profit_from_transaction: transactionProfit,
    items: itemsWithDetails,
  };
};
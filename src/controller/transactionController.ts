import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/httpResponse';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../handler/errorHandler';
import * as transactionQueries from '../queries/transactionQueries';

export const createTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body; // items: [{ productId: number, quantity: number }]

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError('Transaction items are required and must be an array', 400));
  }

  // Lakukan validasi stok dan perhitungan total di query atau service layer
  const newTransaction = await transactionQueries.createTransaction(items);
  sendSuccess(res, 201, 'Transaction created successfully', newTransaction);
});

export const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const transactions = await transactionQueries.findAllTransactions();
  sendSuccess(res, 200, 'Successfully retrieved all transactions', transactions);
});

export const getTransactionDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const transaction = await transactionQueries.findTransactionById(parseInt(id));

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }
  sendSuccess(res, 200, 'Transaction detail retrieved successfully', transaction);
});
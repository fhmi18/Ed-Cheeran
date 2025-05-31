import { Request, Response, NextFunction } from 'express';
import * as profitQueries from '../queries/profitQueries';
import { sendSuccess } from '../utils/httpResponse'; 
import { AppError } from '../handler/errorHandler';
import { catchAsync } from '../utils/catchAsync';

export const getDailyProfit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { date } = req.query;
  if (!date) {
    return next(new AppError('Date is required for daily profit report', 400));
  }
  const report = await profitQueries.getDailyProfitReport(date as string);
  sendSuccess(res, 200, 'Laporan profit harian berhasil diambil', report);
});

export const getWeeklyProfit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { start_date, end_date } = req.query;
  if (!start_date || !end_date) {
    return next(new AppError('Start date and end date are required for weekly profit report', 400));
  }
  const report = await profitQueries.getWeeklyProfitReport(start_date as string, end_date as string);
  sendSuccess(res, 200, 'Laporan profit mingguan berhasil diambil', report);
});

export const getMonthlyProfit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { month } = req.query;
  if (!month) {
    return next(new AppError('Month is required for monthly profit report', 400));
  }
  const report = await profitQueries.getMonthlyProfitReport(month as string);
  sendSuccess(res, 200, 'Laporan profit bulanan berhasil diambil', report);
});
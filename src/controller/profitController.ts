import { Request, Response, NextFunction } from 'express';
import * as profitQueries from '../queries/profitQueries';
import { sendSuccess, sendError } from '../utils/httpResponse';
import { AppError } from '../handler/errorHandler';

export const getDailyProfit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query; 
    if (!date) {
      return next(new AppError('Date is required for daily profit report', 400));
    }
    const report = await profitQueries.getDailyProfitReport(date as string);
    sendSuccess(res, 200, 'Laporan profit harian berhasil diambil', report);
  } catch (error) {
    next(error);
  }
};

export const getWeeklyProfit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start_date, end_date } = req.query; 
    if (!start_date || !end_date) {
      return next(new AppError('Start date and end date are required for weekly profit report', 400));
    }
    const report = await profitQueries.getWeeklyProfitReport(start_date as string, end_date as string);
    sendSuccess(res, 200, 'Laporan profit mingguan berhasil diambil', report);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyProfit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month } = req.query; 
    if (!month) {
      return next(new AppError('Month is required for monthly profit report', 400));
    }
    const report = await profitQueries.getMonthlyProfitReport(month as string);
    sendSuccess(res, 200, 'Laporan profit bulanan berhasil diambil', report);
  } catch (error) {
    next(error);
  }
};
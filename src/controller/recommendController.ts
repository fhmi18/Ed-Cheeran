import { Request, Response, NextFunction } from 'express';
import * as recommendQueries from '../queries/recommendQueries';
import { sendSuccess } from '../utils/httpResponse';
import { AppError } from '../handler/errorHandler';

export const getBestSellingItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const bestSelling = await recommendQueries.findBestSellingProducts(limit);
    sendSuccess(res, 200, 'Data produk terlaris berhasil diambil', bestSelling);
  } catch (error) {
    next(error);
  }
};

export const getCustomerFavoriteItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    if (isNaN(customerId)) {
      return next(new AppError('Invalid customer ID', 400));
    }
    const favoriteItems = await recommendQueries.findCustomerFavoriteProducts(customerId);
    if (!favoriteItems) {
      return next(new AppError('Customer not found or no favorite items recorded', 404));
    }
    sendSuccess(res, 200, 'Produk favorit customer berhasil diambil', favoriteItems);
  } catch (error) {
    next(error);
  }
};
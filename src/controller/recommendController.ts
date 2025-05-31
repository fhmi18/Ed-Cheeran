import { Request, Response, NextFunction } from 'express';
import * as recommendQueries from '../queries/recommendQueries';
import { sendSuccess } from '../utils/httpResponse';

export const getBestSellingItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const bestSelling = await recommendQueries.findBestSellingProducts(limit);
    sendSuccess(res, 200, 'Data produk terlaris berhasil diambil', bestSelling);
  } catch (error) {
    next(error);
  }
};

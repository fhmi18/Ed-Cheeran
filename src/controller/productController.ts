import { Request, Response, NextFunction } from 'express';
import * as productQueries from '../queries/productQueries';
import { sendSuccess } from '../utils/httpResponse'; 
import { AppError } from '../handler/errorHandler';
import { catchAsync } from '../utils/catchAsync'; 

export const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const products = await productQueries.findAllProducts();
  sendSuccess(res, 200, 'Berhasil mengambil semua produk', products);
});

export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, categories, buy_price, sell_price, stock } = req.body;
  const newProduct = await productQueries.createProduct(name, categories, buy_price, sell_price, stock);
  sendSuccess(res, 201, 'Produk berhasil ditambahkan', newProduct);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name } = req.body;
  const deletedProduct = await productQueries.deleteProduct(id,name);
  if (!deletedProduct) {
    return next(new AppError('Product not found', 404));
  }
  sendSuccess(res, 200, `Produk dengan ID ${id} berhasil dihapus`);
});

export const editProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, name, categories, buy_price, sell_price, stock } = req.body;
  const updatedProduct = await productQueries.updateProduct(id, name, categories, buy_price, sell_price, stock);
  if (!updatedProduct) {
    return next(new AppError('Product not found', 404));
  }
  sendSuccess(res, 200, 'Produk berhasil diperbarui', updatedProduct);
});

export const getProductDetail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  if (!id) {
    return next(new AppError('Product ID is required', 400));
  }
  const product = await productQueries.findProductById(parseInt(id as string));
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  sendSuccess(res, 200, 'Detail produk berhasil diambil', product);
});

export const searchProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.query;
  if (!query) {
    return next(new AppError('Search query is required', 400));
  }
  const products = await productQueries.searchProducts(query as string);
  sendSuccess(res, 200, 'Hasil pencarian produk', products);
});
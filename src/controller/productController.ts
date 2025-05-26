import { Request, Response, NextFunction } from 'express';
import * as productQueries from '../queries/productQueries';
import { sendSuccess, sendError } from '../utils/httpResponse';
import { AppError } from '../handler/errorHandler';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productQueries.findAllProducts();
    sendSuccess(res, 200, 'Berhasil mengambil semua produk', products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, categories, buy_price, sell_price, stock } = req.body;
    const newProduct = await productQueries.createProduct(name, categories, buy_price, sell_price, stock);
    sendSuccess(res, 201, 'Produk berhasil ditambahkan', newProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const deletedProduct = await productQueries.deleteProduct(id);
    if (!deletedProduct) {
      return next(new AppError('Product not found', 404));
    }
    sendSuccess(res, 200, `Produk dengan ID ${id} berhasil dihapus`);
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, categories, buy_price, sell_price, stock } = req.body;
    const updatedProduct = await productQueries.updateProduct(id, name, categories, buy_price, sell_price, stock);
    if (!updatedProduct) {
      return next(new AppError('Product not found', 404));
    }
    sendSuccess(res, 200, 'Produk berhasil diperbarui', updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProductDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.query;
    if (!id) {
      return next(new AppError('Product ID is required', 400));
    }
    const product = await productQueries.findProductById(parseInt(id as string));
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    sendSuccess(res, 200, 'Detail produk berhasil diambil', product);
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query;
    if (!query) {
      return next(new AppError('Search query is required', 400));
    }
    const products = await productQueries.searchProducts(query as string);
    sendSuccess(res, 200, 'Hasil pencarian produk', products);
  } catch (error) {
    next(error);
  }
};
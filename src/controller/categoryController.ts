import { Request, Response, NextFunction } from 'express';
import * as categoryQueries from '../queries/categoryQueries';
import { sendSuccess, sendError } from '../utils/httpResponse';
import { AppError } from '../handler/errorHandler';

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categories, description } = req.body;
    const newCategory = await categoryQueries.createCategory(categories, description);
    sendSuccess(res, 201, 'Kategori berhasil ditambahkan', newCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, categories } = req.body;
    const deletedCategory = await categoryQueries.deleteCategory(id);
    if (!deletedCategory) {
      return next(new AppError('Category not found', 404));
    }
    sendSuccess(res, 200, 'Kategori berhasil dihapus', { deleted_id: deletedCategory.id });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryQueries.findAllCategories();
    sendSuccess(res, 200, 'Daftar kategori berhasil diambil', categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryQueries.findCategoryById(parseInt(id));
    if (!category) {
      return next(new AppError('Kategori tidak ditemukan', 404));
    }
    sendSuccess(res, 200, 'Kategori berhasil ditemukan', category);
  } catch (error) {
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import * as categoryQueries from '../queries/categoryQueries';
import { sendSuccess } from '../utils/httpResponse'; 
import { AppError } from '../handler/errorHandler';
import { catchAsync } from '../utils/catchAsync'; 

export const addCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { categories, description } = req.body;
  const existingCategory = await categoryQueries.findCategoryByName(categories);
  if (existingCategory) {
    return next(new AppError('Kategori dengan nama tersebut sudah ada', 400));
  }
  const newCategory = await categoryQueries.createCategory(categories, description);
  sendSuccess(res, 201, 'Kategori berhasil ditambahkan', newCategory);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, categories } = req.body; 
  const deletedCategory = await categoryQueries.deleteCategory(id,categories);
  if (!deletedCategory) {
    return next(new AppError('Category not found', 404));
  }
  sendSuccess(res, 200, 'Kategori berhasil dihapus', { deleted_id: deletedCategory.id });
});

export const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await categoryQueries.findAllCategories();
  sendSuccess(res, 200, 'Daftar kategori berhasil diambil', categories);
});

export const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const category = await categoryQueries.findCategoryById(parseInt(id));
  if (!category) {
    return next(new AppError('Kategori tidak ditemukan', 404));
  }
  sendSuccess(res, 200, 'Kategori berhasil ditemukan', category);
});
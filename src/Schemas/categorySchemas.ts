import { z } from 'zod';

export const addCategorySchema = z.object({
  categories: z.string(),
  description: z.string(),
});

export const deleteCategorySchema = z.object({
  id: z.number().int().positive('Category ID is required'),
  categories: z.string().min(1, 'Category name is required'),
});
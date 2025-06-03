import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  categories: z.string().min(1, 'Category is required'), // Menggunakan nama kategori
  buy_price: z.number().int().positive('Buy price must be a positive integer'),
  sell_price: z.number().int().positive('Sell price must be a positive integer'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});

export const deleteProductSchema = z.object({
  id: z.number().int().positive('Product ID must be a positive integer'),
  name: z.string().min(1, 'Product name is required'),
});

export const updateProductSchema = z.object({
  id: z.number().int().positive('Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  categories: z.string().min(1, 'Category is required'),
  buy_price: z.number().int().positive('Buy price must be a positive integer'),
  sell_price: z.number().int().positive('Sell price must be a positive integer'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});
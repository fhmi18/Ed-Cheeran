import { z } from 'zod';

export const createTransactionSchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive('Product ID must be a positive integer'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
  })).min(1, 'At least one item is required for a transaction'),
});
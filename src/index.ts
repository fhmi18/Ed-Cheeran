import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import profitRoutes from './routes/profitRoutes';
import categoryRoutes from './routes/categoryRoutes';
import recommendRoutes from './routes/recommendRoutes';
import { errorHandler } from './handler/errorHandler'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/v1/Authentication', authRoutes);
app.use('/v1/Products', productRoutes);
app.use('/v1/Profit', profitRoutes);
app.use('/v1/categories', categoryRoutes);
app.use('/v1/Recommend', recommendRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
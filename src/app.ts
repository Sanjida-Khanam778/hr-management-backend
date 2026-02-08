import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import reportRoutes from './routes/reportRoutes';
import { ApiResponse } from './utils/apiResponse';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/reports', reportRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'HR Management API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    return ApiResponse.error(res, err.message || 'Something went wrong!', 500);
});

// 404 handler
app.use((req, res) => {
    return ApiResponse.error(res, 'Route not found', 404);
});

export default app;

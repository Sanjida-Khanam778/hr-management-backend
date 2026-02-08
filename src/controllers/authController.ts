import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from '../database/db';
import { JwtUtils } from '../utils/jwt';
import { ApiResponse } from '../utils/apiResponse';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return ApiResponse.error(res, 'Email and password are required', 400);
            }

            const user = await db('hr_users').where({ email }).first();

            if (!user) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                return ApiResponse.error(res, 'Invalid credentials', 401);
            }

            const token = JwtUtils.generateToken({
                id: user.id,
                email: user.email,
                name: user.name,
            });

            return ApiResponse.success(res, { token }, 'Login successful');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}

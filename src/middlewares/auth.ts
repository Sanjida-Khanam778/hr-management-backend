import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        name: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = JwtUtils.verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
};

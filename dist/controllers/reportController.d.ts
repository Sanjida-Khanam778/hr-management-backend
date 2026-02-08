import { Request, Response } from 'express';
export declare class ReportController {
    static getMonthlyAttendance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}

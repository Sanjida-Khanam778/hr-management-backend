import { Request, Response } from 'express';
import db from '../database/db';
import { ApiResponse } from '../utils/apiResponse';

export class ReportController {
    static async getMonthlyAttendance(req: Request, res: Response) {
        try {
            const { month, employee_id } = req.query;

            if (!month) {
                return ApiResponse.error(res, 'Month (YYYY-MM) is required', 400);
            }

            const query = db('employees as e')
                .leftJoin('attendance as a', function () {
                    this.on('e.id', '=', 'a.employee_id').andOn(
                        db.raw("to_char(a.date, 'YYYY-MM') = ?", [month]),
                    );
                })
                .select(
                    'e.id as employee_id',
                    'e.name',
                    db.raw('COUNT(a.id) as days_present'),
                    db.raw("COUNT(CASE WHEN a.check_in_time > '09:45:00' THEN 1 END) as times_late"),
                )
                .whereNull('e.deleted_at')
                .groupBy('e.id', 'e.name');

            if (employee_id) {
                query.where('e.id', employee_id);
            }

            const report = await query.orderBy('e.name', 'asc');

            return ApiResponse.success(res, report);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}

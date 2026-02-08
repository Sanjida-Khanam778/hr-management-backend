import { Request, Response } from 'express';
import db from '../database/db';
import { ApiResponse } from '../utils/apiResponse';

export class AttendanceController {
    static async getAll(req: Request, res: Response) {
        try {
            const { employee_id, date, from, to, page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const query = db('attendance as a')
                .join('employees as e', 'a.employee_id', 'e.id')
                .select('a.*', 'e.name as employee_name');

            if (employee_id) query.where('a.employee_id', employee_id);
            if (date) query.where('a.date', date);
            if (from && to) query.whereBetween('a.date', [from, to]);

            const totalCount = await query.clone().count('a.id as count').first();
            const attendance = await query.offset(offset).limit(Number(limit)).orderBy('a.date', 'desc');

            return ApiResponse.success(res, {
                attendance,
                pagination: {
                    total: Number(totalCount?.count || 0),
                    page: Number(page),
                    limit: Number(limit),
                },
            });
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const entry = await db('attendance as a')
                .join('employees as e', 'a.employee_id', 'e.id')
                .select('a.*', 'e.name as employee_name')
                .where('a.id', id)
                .first();

            if (!entry) {
                return ApiResponse.error(res, 'Attendance entry not found', 404);
            }

            return ApiResponse.success(res, entry);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async upsert(req: Request, res: Response) {
        try {
            const { employee_id, date, check_in_time } = req.body;

            // Check if employee exists and is not deleted
            const employee = await db('employees').where({ id: employee_id }).whereNull('deleted_at').first();
            if (!employee) {
                return ApiResponse.error(res, 'Employee not found or inactive', 404);
            }

            const existing = await db('attendance')
                .where({ employee_id, date })
                .first();

            if (existing) {
                await db('attendance')
                    .where({ id: existing.id })
                    .update({ check_in_time, updated_at: db.fn.now() });

                const updated = await db('attendance').where({ id: existing.id }).first();
                return ApiResponse.success(res, updated, 'Attendance updated successfully');
            } else {
                const [id] = await db('attendance').insert({
                    employee_id,
                    date,
                    check_in_time,
                }).returning('id');

                const created = await db('attendance').where({ id: typeof id === 'object' ? id.id : id }).first();
                return ApiResponse.success(res, created, 'Attendance recorded successfully', 201);
            }
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { check_in_time } = req.body;

            const entry = await db('attendance').where({ id }).first();
            if (!entry) {
                return ApiResponse.error(res, 'Attendance entry not found', 404);
            }

            await db('attendance').where({ id }).update({
                check_in_time,
                updated_at: db.fn.now(),
            });

            const updated = await db('attendance').where({ id }).first();
            return ApiResponse.success(res, updated, 'Attendance updated successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const entry = await db('attendance').where({ id }).first();

            if (!entry) {
                return ApiResponse.error(res, 'Attendance entry not found', 404);
            }

            await db('attendance').where({ id }).del();
            return ApiResponse.success(res, null, 'Attendance entry deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}

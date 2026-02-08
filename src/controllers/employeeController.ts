import { Request, Response } from 'express';
import db from '../database/db';
import { ApiResponse } from '../utils/apiResponse';
import fs from 'fs';
import path from 'path';

export class EmployeeController {
    static async getAll(req: Request, res: Response) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const query = db('employees').whereNull('deleted_at');

            if (search) {
                query.where('name', 'ilike', `%${search}%`);
            }

            const totalCount = await query.clone().count('id as count').first();
            const employees = await query.offset(offset).limit(Number(limit)).orderBy('id', 'desc');

            return ApiResponse.success(res, {
                employees,
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
            const employee = await db('employees').where({ id }).whereNull('deleted_at').first();

            if (!employee) {
                return ApiResponse.error(res, 'Employee not found', 404);
            }

            return ApiResponse.success(res, employee);
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, age, designation, hiring_date, date_of_birth, salary } = req.body;
            const photo_path = req.file ? req.file.path : null;

            const [id] = await db('employees').insert({
                name,
                age,
                designation,
                hiring_date,
                date_of_birth,
                salary,
                photo_path,
            }).returning('id');

            const newEmployee = await db('employees').where({ id: typeof id === 'object' ? id.id : id }).first();

            return ApiResponse.success(res, newEmployee, 'Employee created successfully', 201);
        } catch (error: any) {
            if (req.file) fs.unlinkSync(req.file.path);
            return ApiResponse.error(res, error.message);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, age, designation, hiring_date, date_of_birth, salary } = req.body;
            const employee = await db('employees').where({ id }).whereNull('deleted_at').first();

            if (!employee) {
                if (req.file) fs.unlinkSync(req.file.path);
                return ApiResponse.error(res, 'Employee not found', 404);
            }

            const updateData: any = {
                name,
                age,
                designation,
                hiring_date,
                date_of_birth,
                salary,
                updated_at: db.fn.now(),
            };

            if (req.file) {
                updateData.photo_path = req.file.path;
                // Delete old photo if exists
                if (employee.photo_path && fs.existsSync(employee.photo_path)) {
                    fs.unlinkSync(employee.photo_path);
                }
            }

            await db('employees').where({ id }).update(updateData);
            const updatedEmployee = await db('employees').where({ id }).first();

            return ApiResponse.success(res, updatedEmployee, 'Employee updated successfully');
        } catch (error: any) {
            if (req.file) fs.unlinkSync(req.file.path);
            return ApiResponse.error(res, error.message);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const employee = await db('employees').where({ id }).whereNull('deleted_at').first();

            if (!employee) {
                return ApiResponse.error(res, 'Employee not found', 404);
            }

            await db('employees').where({ id }).update({ deleted_at: db.fn.now() });

            return ApiResponse.success(res, null, 'Employee deleted successfully');
        } catch (error: any) {
            return ApiResponse.error(res, error.message);
        }
    }
}

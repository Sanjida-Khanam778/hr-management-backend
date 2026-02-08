"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const db_1 = __importDefault(require("../database/db"));
const apiResponse_1 = require("../utils/apiResponse");
class AttendanceController {
    static async getAll(req, res) {
        try {
            const { employee_id, date, from, to, page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const query = (0, db_1.default)('attendance as a')
                .join('employees as e', 'a.employee_id', 'e.id')
                .select('a.*', 'e.name as employee_name');
            if (employee_id)
                query.where('a.employee_id', employee_id);
            if (date)
                query.where('a.date', date);
            if (from && to)
                query.whereBetween('a.date', [from, to]);
            const totalCount = await query.clone().count('a.id as count').first();
            const attendance = await query.offset(offset).limit(Number(limit)).orderBy('a.date', 'desc');
            return apiResponse_1.ApiResponse.success(res, {
                attendance,
                pagination: {
                    total: Number(totalCount?.count || 0),
                    page: Number(page),
                    limit: Number(limit),
                },
            });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const entry = await (0, db_1.default)('attendance as a')
                .join('employees as e', 'a.employee_id', 'e.id')
                .select('a.*', 'e.name as employee_name')
                .where('a.id', id)
                .first();
            if (!entry) {
                return apiResponse_1.ApiResponse.error(res, 'Attendance entry not found', 404);
            }
            return apiResponse_1.ApiResponse.success(res, entry);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async upsert(req, res) {
        try {
            const { employee_id, date, check_in_time } = req.body;
            // Check if employee exists and is not deleted
            const employee = await (0, db_1.default)('employees').where({ id: employee_id }).whereNull('deleted_at').first();
            if (!employee) {
                return apiResponse_1.ApiResponse.error(res, 'Employee not found or inactive', 404);
            }
            const existing = await (0, db_1.default)('attendance')
                .where({ employee_id, date })
                .first();
            if (existing) {
                await (0, db_1.default)('attendance')
                    .where({ id: existing.id })
                    .update({ check_in_time, updated_at: db_1.default.fn.now() });
                const updated = await (0, db_1.default)('attendance').where({ id: existing.id }).first();
                return apiResponse_1.ApiResponse.success(res, updated, 'Attendance updated successfully');
            }
            else {
                const [id] = await (0, db_1.default)('attendance').insert({
                    employee_id,
                    date,
                    check_in_time,
                }).returning('id');
                const created = await (0, db_1.default)('attendance').where({ id: typeof id === 'object' ? id.id : id }).first();
                return apiResponse_1.ApiResponse.success(res, created, 'Attendance recorded successfully', 201);
            }
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { check_in_time } = req.body;
            const entry = await (0, db_1.default)('attendance').where({ id }).first();
            if (!entry) {
                return apiResponse_1.ApiResponse.error(res, 'Attendance entry not found', 404);
            }
            await (0, db_1.default)('attendance').where({ id }).update({
                check_in_time,
                updated_at: db_1.default.fn.now(),
            });
            const updated = await (0, db_1.default)('attendance').where({ id }).first();
            return apiResponse_1.ApiResponse.success(res, updated, 'Attendance updated successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const entry = await (0, db_1.default)('attendance').where({ id }).first();
            if (!entry) {
                return apiResponse_1.ApiResponse.error(res, 'Attendance entry not found', 404);
            }
            await (0, db_1.default)('attendance').where({ id }).del();
            return apiResponse_1.ApiResponse.success(res, null, 'Attendance entry deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=attendanceController.js.map
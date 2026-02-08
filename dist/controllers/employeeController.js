"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const db_1 = __importDefault(require("../database/db"));
const apiResponse_1 = require("../utils/apiResponse");
const fs_1 = __importDefault(require("fs"));
class EmployeeController {
    static async getAll(req, res) {
        try {
            const { search, page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const query = (0, db_1.default)('employees').whereNull('deleted_at');
            if (search) {
                query.where('name', 'ilike', `%${search}%`);
            }
            const totalCount = await query.clone().count('id as count').first();
            const employees = await query.offset(offset).limit(Number(limit)).orderBy('id', 'desc');
            return apiResponse_1.ApiResponse.success(res, {
                employees,
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
            const employee = await (0, db_1.default)('employees').where({ id }).whereNull('deleted_at').first();
            if (!employee) {
                return apiResponse_1.ApiResponse.error(res, 'Employee not found', 404);
            }
            return apiResponse_1.ApiResponse.success(res, employee);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async create(req, res) {
        try {
            const { name, age, designation, hiring_date, date_of_birth, salary } = req.body;
            const photo_path = req.file ? req.file.path : null;
            const [id] = await (0, db_1.default)('employees').insert({
                name,
                age,
                designation,
                hiring_date,
                date_of_birth,
                salary,
                photo_path,
            }).returning('id');
            const newEmployee = await (0, db_1.default)('employees').where({ id: typeof id === 'object' ? id.id : id }).first();
            return apiResponse_1.ApiResponse.success(res, newEmployee, 'Employee created successfully', 201);
        }
        catch (error) {
            if (req.file)
                fs_1.default.unlinkSync(req.file.path);
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, age, designation, hiring_date, date_of_birth, salary } = req.body;
            const employee = await (0, db_1.default)('employees').where({ id }).whereNull('deleted_at').first();
            if (!employee) {
                if (req.file)
                    fs_1.default.unlinkSync(req.file.path);
                return apiResponse_1.ApiResponse.error(res, 'Employee not found', 404);
            }
            const updateData = {
                name,
                age,
                designation,
                hiring_date,
                date_of_birth,
                salary,
                updated_at: db_1.default.fn.now(),
            };
            if (req.file) {
                updateData.photo_path = req.file.path;
                // Delete old photo if exists
                if (employee.photo_path && fs_1.default.existsSync(employee.photo_path)) {
                    fs_1.default.unlinkSync(employee.photo_path);
                }
            }
            await (0, db_1.default)('employees').where({ id }).update(updateData);
            const updatedEmployee = await (0, db_1.default)('employees').where({ id }).first();
            return apiResponse_1.ApiResponse.success(res, updatedEmployee, 'Employee updated successfully');
        }
        catch (error) {
            if (req.file)
                fs_1.default.unlinkSync(req.file.path);
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const employee = await (0, db_1.default)('employees').where({ id }).whereNull('deleted_at').first();
            if (!employee) {
                return apiResponse_1.ApiResponse.error(res, 'Employee not found', 404);
            }
            await (0, db_1.default)('employees').where({ id }).update({ deleted_at: db_1.default.fn.now() });
            return apiResponse_1.ApiResponse.success(res, null, 'Employee deleted successfully');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employeeController.js.map
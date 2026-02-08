"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const db_1 = __importDefault(require("../database/db"));
const apiResponse_1 = require("../utils/apiResponse");
class ReportController {
    static async getMonthlyAttendance(req, res) {
        try {
            const { month, employee_id } = req.query;
            if (!month) {
                return apiResponse_1.ApiResponse.error(res, 'Month (YYYY-MM) is required', 400);
            }
            const query = (0, db_1.default)('employees as e')
                .leftJoin('attendance as a', function () {
                this.on('e.id', '=', 'a.employee_id').andOn(db_1.default.raw("to_char(a.date, 'YYYY-MM') = ?", [month]));
            })
                .select('e.id as employee_id', 'e.name', db_1.default.raw('COUNT(a.id) as days_present'), db_1.default.raw("COUNT(CASE WHEN a.check_in_time > '09:45:00' THEN 1 END) as times_late"))
                .whereNull('e.deleted_at')
                .groupBy('e.id', 'e.name');
            if (employee_id) {
                query.where('e.id', employee_id);
            }
            const report = await query.orderBy('e.name', 'asc');
            return apiResponse_1.ApiResponse.success(res, report);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=reportController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceSchema = exports.employeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.employeeSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    age: joi_1.default.number().integer().min(18).required(),
    designation: joi_1.default.string().required(),
    hiring_date: joi_1.default.date().required(),
    date_of_birth: joi_1.default.date().required(),
    salary: joi_1.default.number().precision(2).required(),
});
exports.attendanceSchema = joi_1.default.object({
    employee_id: joi_1.default.number().integer().required(),
    date: joi_1.default.date().required(),
    check_in_time: joi_1.default.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$/)
        .required(),
});
//# sourceMappingURL=validation.js.map
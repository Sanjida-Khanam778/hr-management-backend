"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const apiResponse_1 = require("./utils/apiResponse");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/employees', employeeRoutes_1.default);
app.use('/attendance', attendanceRoutes_1.default);
app.use('/reports', reportRoutes_1.default);
// Health check
app.get('/', (req, res) => {
    res.json({ message: 'HR Management API is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return apiResponse_1.ApiResponse.error(res, err.message || 'Something went wrong!', 500);
});
// 404 handler
app.use((req, res) => {
    return apiResponse_1.ApiResponse.error(res, 'Route not found', 404);
});
exports.default = app;
//# sourceMappingURL=app.js.map
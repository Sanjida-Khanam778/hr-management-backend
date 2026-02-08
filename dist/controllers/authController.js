"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../database/db"));
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return apiResponse_1.ApiResponse.error(res, 'Email and password are required', 400);
            }
            const user = await (0, db_1.default)('hr_users').where({ email }).first();
            if (!user) {
                return apiResponse_1.ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return apiResponse_1.ApiResponse.error(res, 'Invalid credentials', 401);
            }
            const token = jwt_1.JwtUtils.generateToken({
                id: user.id,
                email: user.email,
                name: user.name,
            });
            return apiResponse_1.ApiResponse.success(res, { token }, 'Login successful');
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map
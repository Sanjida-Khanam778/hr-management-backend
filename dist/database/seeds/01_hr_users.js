"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed(knex) {
    // Deletes ALL existing entries
    await knex('hr_users').del();
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    // Inserts seed entries
    await knex('hr_users').insert([
        {
            email: 'hr@example.com',
            password_hash: hashedPassword,
            name: 'HR Admin',
        },
    ]);
}
//# sourceMappingURL=01_hr_users.js.map
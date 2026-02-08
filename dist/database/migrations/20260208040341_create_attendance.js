"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('attendance', (table) => {
        table.increments('id').primary();
        table
            .integer('employee_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('employees')
            .onDelete('CASCADE');
        table.date('date').notNullable();
        table.time('check_in_time').notNullable();
        table.unique(['employee_id', 'date']);
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('attendance');
}
//# sourceMappingURL=20260208040341_create_attendance.js.map
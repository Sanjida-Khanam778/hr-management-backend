"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('employees', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('age').notNullable();
        table.string('designation').notNullable();
        table.date('hiring_date').notNullable();
        table.date('date_of_birth').notNullable();
        table.decimal('salary', 10, 2).notNullable();
        table.string('photo_path').nullable();
        table.timestamp('deleted_at').nullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('employees');
}
//# sourceMappingURL=20260208040340_create_employees.js.map
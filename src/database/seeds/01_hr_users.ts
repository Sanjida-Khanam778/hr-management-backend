import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('hr_users').del();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Inserts seed entries
    await knex('hr_users').insert([
        {
            email: 'hr@example.com',
            password_hash: hashedPassword,
            name: 'HR Admin',
        },
    ]);
}

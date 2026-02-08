# HR Management Backend

A RESTful API for HR management built with Node.js, TypeScript, Express, Knex, and PostgreSQL.

## Features

- HR User Authentication (JWT)
- Employee Management (CRUD with photo upload and soft delete)
- Attendance Management (Daily check-in with upsert logic)
- Monthly Attendance Reports (Days present and late arrivals)
- Search and Pagination
- Request Validation (Joi)

## Prerequisites

- Node.js (v14+)
- PostgreSQL or MySQL

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database credentials and JWT secret.
4. Run migrations and seeds:
   ```bash
   npm run migrate:latest
   npm run seed:run
   ```

## Scripts

- `npm run dev`: Start development server with nodemon
- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Start production server
- `npm run migrate:latest`: Run database migrations
- `npm run seed:run`: Run database seeds

## Endpoints

### Auth
- `POST /auth/login`: HR user login

### Employees (Protected)
- `GET /employees`: List all employees (search, pagination)
- `GET /employees/:id`: Get single employee
- `POST /employees`: Create employee (multipart/form-data)
- `PUT /employees/:id`: Update employee
- `DELETE /employees/:id`: Soft delete employee

### Attendance (Protected)
- `GET /attendance`: List attendance entries (filters)
- `GET /attendance/:id`: Get single entry
- `POST /attendance`: Upsert attendance (check-in)
- `PUT /attendance/:id`: Update entry
- `DELETE /attendance/:id`: Delete entry

### Reports (Protected)
- `GET /reports/attendance?month=YYYY-MM`: Monthly summary

## Design Decisions

- **OOP Principles**: Used classes for controllers and utilities.
- **Query Builder**: Knex.js for flexible SQL queries.
- **Validation**: Joi middleware for robust input validation.
- **Soft Delete**: Employees are not physically removed from the DB.
- **Upsert**: Attendance check-ins are handled by checking existing records for the same day.
- **Late Rule**: Check-in after 9:45 AM is marked as late in reports.

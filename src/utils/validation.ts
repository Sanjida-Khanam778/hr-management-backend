import Joi from 'joi';

export const employeeSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(18).required(),
    designation: Joi.string().required(),
    hiring_date: Joi.date().required(),
    date_of_birth: Joi.date().required(),
    salary: Joi.number().precision(2).required(),
});

export const attendanceSchema = Joi.object({
    employee_id: Joi.number().integer().required(),
    date: Joi.date().required(),
    check_in_time: Joi.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$/)
        .required(),
});

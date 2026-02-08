"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return apiResponse_1.ApiResponse.error(res, 'Validation error', 400, errors);
        }
        next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate.js.map
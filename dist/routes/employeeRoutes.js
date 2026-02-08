"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const validate_1 = require("../middlewares/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', employeeController_1.EmployeeController.getAll);
router.get('/:id', employeeController_1.EmployeeController.getById);
router.post('/', upload_1.upload.single('photo'), (req, res, next) => {
    // Manually parse body if it was stringified in multipart
    next();
}, (0, validate_1.validateRequest)(validation_1.employeeSchema), employeeController_1.EmployeeController.create);
router.put('/:id', upload_1.upload.single('photo'), (0, validate_1.validateRequest)(validation_1.employeeSchema), employeeController_1.EmployeeController.update);
router.delete('/:id', employeeController_1.EmployeeController.delete);
exports.default = router;
//# sourceMappingURL=employeeRoutes.js.map
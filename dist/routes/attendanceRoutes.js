"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', attendanceController_1.AttendanceController.getAll);
router.get('/:id', attendanceController_1.AttendanceController.getById);
router.post('/', (0, validate_1.validateRequest)(validation_1.attendanceSchema), attendanceController_1.AttendanceController.upsert);
router.put('/:id', attendanceController_1.AttendanceController.update);
router.delete('/:id', attendanceController_1.AttendanceController.delete);
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map
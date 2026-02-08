"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/attendance', reportController_1.ReportController.getMonthlyAttendance);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map
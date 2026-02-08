import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/attendance', ReportController.getMonthlyAttendance);

export default router;

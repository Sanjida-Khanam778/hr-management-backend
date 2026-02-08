import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validate';
import { attendanceSchema } from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/', AttendanceController.getAll);
router.get('/:id', AttendanceController.getById);
router.post('/', validateRequest(attendanceSchema), AttendanceController.upsert);
router.put('/:id', AttendanceController.update);
router.delete('/:id', AttendanceController.delete);

export default router;

import { Router } from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { validateRequest } from '../middlewares/validate';
import { employeeSchema } from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post(
    '/',
    upload.single('photo'),
    (req, res, next) => {
        // Manually parse body if it was stringified in multipart
        next();
    },
    validateRequest(employeeSchema),
    EmployeeController.create,
);
router.put(
    '/:id',
    upload.single('photo'),
    validateRequest(employeeSchema),
    EmployeeController.update,
);
router.delete('/:id', EmployeeController.delete);

export default router;

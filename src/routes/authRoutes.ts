import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const userController = new AuthController();

router.post('/login', userController.login);

export default router;
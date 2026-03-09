import { Router } from 'express';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { UserController } from '../controllers/userController';
import { AddressController } from '../controllers/addressController';
import { PaymentController } from '@/controllers/paymentController';

const router = Router();
const userController = new UserController();
const addressController = new AddressController();
const paymentController = new PaymentController();

router.get('/', authMiddleware, userController.list);
router.post('/register', userController.create);

router.post('/:id/address', authMiddleware, addressController.createAddress);
router.get('/:id/address', authMiddleware, addressController.getAddresses);
router.delete('/:id/address/:addressId', authMiddleware, addressController.removeAddress);
router.patch('/:id/address/:addressId', authMiddleware, addressController.updateAddress);

router.post('/:id/paymentMethod', authMiddleware, paymentController.create);
router.delete('/:id/paymentMethod/:paymentId', authMiddleware, paymentController.delete);

router.patch('/:id/changePassword', authMiddleware, userController.changePassword);
router.get('/:id', authMiddleware, userController.findUserById);
router.patch('/:id/', authMiddleware, userController.updateUser);

export default router;
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AddressController } from '../controllers/addressController';
import { PaymentController } from '@/controllers/paymentController';

const router = Router();
const userController = new UserController();
const addressController = new AddressController();
const paymentController = new PaymentController();

router.get('/', userController.list);
router.post('/', userController.create);

router.post('/:id/address', addressController.createAddress);
router.get('/:id/address', addressController.getAddresses);
router.delete('/:id/address/:addressId', addressController.removeAddress);
router.patch('/:id/address/:addressId', addressController.updateAddress);

router.post('/:id/paymentMethod', paymentController.create);
router.delete('/:id/paymentMethod/:paymentId', paymentController.delete);

router.patch('/:id/changePassword', userController.changePassword);
router.get('/:id', userController.findUserById);
router.patch('/:id/', userController.updateUser);

export default router;
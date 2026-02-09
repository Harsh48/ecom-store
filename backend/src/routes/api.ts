import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { OrderController } from '../controllers/OrderController';
import { AdminController } from '../controllers/AdminController';

const router = Router();
const cartController = new CartController();
const orderController = new OrderController();
const adminController = new AdminController();

router.post('/cart/add', (req, res) => cartController.addToCart(req, res));
router.get('/cart/:userId', (req, res) => cartController.getCart(req, res));

router.post('/checkout', (req, res) => orderController.checkout(req, res));

router.post('/admin/discount-code', (req, res) => adminController.generateDiscountCode(req, res));
router.get('/admin/stats', (req, res) => adminController.getStats(req, res));

export default router;

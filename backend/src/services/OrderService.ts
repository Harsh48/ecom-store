import { store } from '../models/InMemoryStore';
import { cartService } from './CartService';
import { discountService } from './DiscountService';
import { Order, CartItem, DiscountCode } from '../models/types';
import { randomUUID } from 'node:crypto';

export class OrderService {

    public checkout(userId: string, discountCode?: string): { order: Order, generatedDiscountCode?: string } {
        const cart = cartService.getCart(userId);

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        let totalAmount = 0;
        cart.items.forEach(item => {
            const product = store.products.get(item.productId);
            if (product) {
                totalAmount += (product.price * item.quantity);
            }
        });

        let discountAmount = 0;
        let finalAmount = totalAmount;
        let appliedCode: DiscountCode | null = null;

        if (discountCode) {
            appliedCode = discountService.validateCode(discountCode);
            if (appliedCode) {
                discountAmount = (totalAmount * appliedCode.percent) / 100;
                finalAmount = totalAmount - discountAmount;
                discountService.useCode(discountCode);
            } else {
                throw new Error('Invalid discount code');
            }
        }

        const order: Order = {
            orderId: randomUUID(),
            userId,
            items: [...cart.items],
            totalAmount,
            discountCode: appliedCode ? appliedCode.code : undefined,
            discountAmount,
            finalAmount,
            timestamp: new Date()
        };

        store.orders.push(order);
        store.orderCount++;

        cartService.clearCart(userId);

        let generatedDiscountCode = undefined;
        if (discountService.isNthOrder(store.orderCount)) {
            const newDiscount = discountService.createDiscountCode();
            if (newDiscount) {
                generatedDiscountCode = newDiscount.code;
            }
        }

        return { order, generatedDiscountCode };
    }
}

export const orderService = new OrderService();

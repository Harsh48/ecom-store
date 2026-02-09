import { store } from '../models/InMemoryStore';
import { cartService } from './CartService';
import { discountService } from './DiscountService';
import { Order, CartItem, DiscountCode } from '../models/types';
import { randomUUID } from 'node:crypto';

export class OrderService {

    // Process Checkout
    public checkout(userId: string, discountCode?: string): { order: Order, generatedDiscountCode?: string } {
        const cart = cartService.getCart(userId);

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Calculate Total
        let totalAmount = 0;
        cart.items.forEach(item => {
            const product = store.products.get(item.productId);
            if (product) {
                totalAmount += (product.price * item.quantity);
            }
        });

        // Apply Discount *to current order*
        let discountAmount = 0;
        let finalAmount = totalAmount;
        let appliedCode: DiscountCode | null = null;

        if (discountCode) {
            appliedCode = discountService.validateCode(discountCode);
            if (appliedCode) {
                // Percentage discount
                discountAmount = (totalAmount * appliedCode.percent) / 100;
                finalAmount = totalAmount - discountAmount;
                // Mark as used
                discountService.useCode(discountCode);
            } else {
                throw new Error('Invalid discount code');
            }
        }

        // Create Order
        const order: Order = {
            orderId: randomUUID(),
            userId,
            items: [...cart.items], // Clone items
            totalAmount,
            discountCode: appliedCode ? appliedCode.code : undefined,
            discountAmount,
            finalAmount,
            timestamp: new Date()
        };

        // Save Order
        store.orders.push(order);
        store.orderCount++; // Increment global order count

        // Clear Cart
        cartService.clearCart(userId);

        // Check for *New* Discount Code Generation (Every Nth order)
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

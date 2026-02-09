import { store } from '../models/InMemoryStore';
import { discountService } from './DiscountService';
import { StoreStats } from '../models/types';

export class AdminService {

    public generateDiscountCode(): string | null {
        // Check if condition is met based on *current* order count
        if (discountService.isNthOrder(store.orderCount)) {
            const newDiscount = discountService.createDiscountCode();
            return newDiscount ? newDiscount.code : null;
        }
        return null; // Condition not met
    }

    public getStats(): StoreStats {
        let totalItemsPurchased = 0;
        let totalRevenue = 0;
        let totalDiscountAmountGiven = 0;

        store.orders.forEach(order => {
            totalItemsPurchased += order.items.reduce((sum, item) => sum + item.quantity, 0);
            totalRevenue += order.finalAmount;
            totalDiscountAmountGiven += order.discountAmount;
        });

        const totalDiscountCodesGenerated = store.discountCodes.size;

        return {
            totalItemsPurchased,
            totalRevenue,
            totalDiscountCodesGenerated,
            totalDiscountAmountGiven
        };
    }
}

export const adminService = new AdminService();

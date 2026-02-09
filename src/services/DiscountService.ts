import { store } from '../models/InMemoryStore';
import { DiscountCode } from '../models/types';
import { randomUUID } from 'node:crypto';

export class DiscountService {

    // Check if the current order count satisfies the Nth order condition
    public isNthOrder(orderCount: number): boolean {
        const { n } = store.discountConfig;
        return orderCount > 0 && orderCount % n === 0;
    }

    // Generator
    public generateCode(): string {
        const code = `DISCOUNT-${randomUUID().substring(0, 8).toUpperCase()}`;
        return code;
    }

    // Create and save a discount code
    // This could be called by Checkout OR Admin
    public createDiscountCode(): DiscountCode | null {
        // We do strictly check the condition here? 
        // Or do we assume caller checked?
        // Let's check condition based on *current* stats.

        // This method assumes the order *just* happened or we are checking current state.
        // If we want to support "Every nth order gets a coupon", we should probably 
        // link the coupon to the order or just generate it.

        // Let's just return a new code. validation is up to caller.
        const codeStr = this.generateCode();
        const discountCode: DiscountCode = {
            code: codeStr,
            percent: store.discountConfig.percent,
            isUsed: false
        };
        store.discountCodes.set(codeStr, discountCode);
        return discountCode;
    }

    public validateCode(code: string): DiscountCode | null {
        const discount = store.discountCodes.get(code);
        if (discount && !discount.isUsed) {
            return discount;
        }
        return null;
    }

    public useCode(code: string) {
        const discount = store.discountCodes.get(code);
        if (discount) {
            discount.isUsed = true;
        }
    }
}

export const discountService = new DiscountService();

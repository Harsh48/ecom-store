import { store } from '../models/InMemoryStore';
import { DiscountCode } from '../models/types';
import { randomUUID } from 'node:crypto';

export class DiscountService {

    public isNthOrder(orderCount: number): boolean {
        const { n } = store.discountConfig;
        return orderCount > 0 && orderCount % n === 0;
    }

    public generateCode(): string {
        const code = `DISCOUNT-${randomUUID().substring(0, 8).toUpperCase()}`;
        return code;
    }

    public createDiscountCode(): DiscountCode | null {
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

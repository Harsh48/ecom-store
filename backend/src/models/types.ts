export interface Product {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Cart {
    userId: string;
    items: CartItem[];
}

export interface Order {
    orderId: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    discountCode?: string;
    discountAmount: number;
    finalAmount: number;
    timestamp: Date;
}

export interface DiscountCode {
    code: string;
    percent: number;
    isUsed: boolean;
}

export interface StoreStats {
    totalItemsPurchased: number;
    totalRevenue: number;
    totalDiscountCodesGenerated: number;
    totalDiscountAmountGiven: number;
}

import { Product, Cart, Order, DiscountCode, StoreStats } from './types';

export class InMemoryStore {
    // Catalogue
    public products: Map<string, Product> = new Map();

    // User Carts (UserId -> Cart)
    public carts: Map<string, Cart> = new Map();

    // Orders
    public orders: Order[] = [];

    // Discount Codes (Code -> Details)
    // We store ALL generated codes to validate them.
    public discountCodes: Map<string, DiscountCode> = new Map();

    // System State
    public orderCount: number = 0;

    // Config
    public discountConfig = {
        n: 3, // Every 3rd order gets a discount
        percent: 10 // 10% discount
    };

    constructor() {
        this.seedProducts();
    }

    private seedProducts() {
        this.products.set('p1', { id: 'p1', name: 'Laptop', price: 1000 });
        this.products.set('p2', { id: 'p2', name: 'Mouse', price: 50 });
        this.products.set('p3', { id: 'p3', name: 'Keyboard', price: 80 });
        this.products.set('p4', { id: 'p4', name: 'Monitor', price: 300 });
    }

    // Helper to clear data (useful for tests)
    public clear() {
        this.carts.clear();
        this.orders = [];
        this.discountCodes.clear();
        this.orderCount = 0;
        // Don't clear products
    }
}

export const store = new InMemoryStore();

import { Product, Cart, Order, DiscountCode, StoreStats } from './types';

export class InMemoryStore {
    public products: Map<string, Product> = new Map();
    public carts: Map<string, Cart> = new Map();
    public orders: Order[] = [];
    public discountCodes: Map<string, DiscountCode> = new Map();
    public orderCount: number = 0;

    public discountConfig = {
        n: 3,
        percent: 10
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

    public clear() {
        this.carts.clear();
        this.orders = [];
        this.discountCodes.clear();
        this.orderCount = 0;
    }
}

export const store = new InMemoryStore();

import { store } from '../models/InMemoryStore';
import { Cart, CartItem } from '../models/types';

export class CartService {

    public getCart(userId: string): Cart {
        let cart = store.carts.get(userId);
        if (!cart) {
            cart = { userId, items: [] };
            store.carts.set(userId, cart);
        }
        return cart;
    }

    public addToCart(userId: string, productId: string, quantity: number): Cart {
        const cart = this.getCart(userId);
        const product = store.products.get(productId);

        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }

        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        return cart;
    }

    public clearCart(userId: string) {
        store.carts.delete(userId);
    }
}

export const cartService = new CartService();

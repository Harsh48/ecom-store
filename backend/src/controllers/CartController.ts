import { Request, Response } from 'express';
import { cartService } from '../services/CartService';

export class CartController {

    public addToCart(req: Request, res: Response) {
        try {
            const { userId, productId, quantity } = req.body;
            if (!userId || !productId || !quantity) {
                return res.status(400).json({ error: 'Missing parameters' });
            }
            const cart = cartService.addToCart(userId, productId, quantity);
            res.json(cart);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public getCart(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;
            if (!userId) {
                return res.status(400).json({ error: 'Missing userId' });
            }
            const cart = cartService.getCart(userId);
            res.json(cart);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

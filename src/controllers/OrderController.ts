import { Request, Response } from 'express';
import { orderService } from '../services/OrderService';

export class OrderController {

    public checkout(req: Request, res: Response) {
        try {
            const { userId, discountCode } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'Missing userId' });
            }
            const result = orderService.checkout(userId, discountCode);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

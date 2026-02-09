import { Request, Response } from 'express';
import { adminService } from '../services/AdminService';

export class AdminController {

    public generateDiscountCode(req: Request, res: Response) {
        try {
            const code = adminService.generateDiscountCode();
            if (code) {
                res.json({ code });
            } else {
                res.status(400).json({ error: 'Condition not satisfied (not the nth order)' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    public getStats(req: Request, res: Response) {
        try {
            const stats = adminService.getStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

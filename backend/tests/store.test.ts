import request from 'supertest';
import app from '../src/app';
import { store } from '../src/models/InMemoryStore';

describe('Ecommerce Store API', () => {
    beforeEach(() => {
        store.clear();
        store.discountConfig = { n: 3, percent: 10 };
    });

    it('should add items to cart', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .send({ userId: 'user1', productId: 'p1', quantity: 1 });

        expect(res.status).toBe(200);
        expect(res.body.items).toHaveLength(1);
        expect(res.body.items[0].productId).toBe('p1');
    });

    it('should checkout successfully without discount', async () => {
        await request(app).post('/api/cart/add').send({ userId: 'user1', productId: 'p1', quantity: 1 });

        const res = await request(app)
            .post('/api/checkout')
            .send({ userId: 'user1' });

        expect(res.status).toBe(200);
        expect(res.body.order.totalAmount).toBe(1000);
        expect(res.body.order.discountAmount).toBe(0);
        expect(store.orders).toHaveLength(1);
        expect(store.orderCount).toBe(1);
    });

    it('should generate discount code on 3rd order', async () => {
        await request(app).post('/api/cart/add').send({ userId: 'user1', productId: 'p2', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'user1' });

        await request(app).post('/api/cart/add').send({ userId: 'user2', productId: 'p2', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'user2' });

        await request(app).post('/api/cart/add').send({ userId: 'user3', productId: 'p2', quantity: 1 });
        const res = await request(app).post('/api/checkout').send({ userId: 'user3' });

        expect(res.status).toBe(200);
        expect(res.body.generatedDiscountCode).toBeDefined();
        expect(res.body.generatedDiscountCode).toMatch(/^DISCOUNT-/);
        expect(store.orderCount).toBe(3);
    });

    it('should apply valid discount code', async () => {
        const code = 'TEST-CODE';
        store.discountCodes.set(code, { code, percent: 10, isUsed: false });

        await request(app).post('/api/cart/add').send({ userId: 'user1', productId: 'p1', quantity: 1 });

        const res = await request(app)
            .post('/api/checkout')
            .send({ userId: 'user1', discountCode: code });

        expect(res.status).toBe(200);
        expect(res.body.order.discountAmount).toBe(100);
        expect(res.body.order.finalAmount).toBe(900);

        expect(store.discountCodes.get(code)?.isUsed).toBe(true);
    });

    it('should fail with invalid discount code', async () => {
        await request(app).post('/api/cart/add').send({ userId: 'user1', productId: 'p1', quantity: 1 });

        const res = await request(app)
            .post('/api/checkout')
            .send({ userId: 'user1', discountCode: 'INVALID' });

        expect(res.body.error).toBe('Invalid discount code');
    });

    it('should prevent using a used code', async () => {
        const code = 'USED-CODE';
        store.discountCodes.set(code, { code, percent: 10, isUsed: true });

        await request(app).post('/api/cart/add').send({ userId: 'user1', productId: 'p1', quantity: 1 });

        const res = await request(app)
            .post('/api/checkout')
            .send({ userId: 'user1', discountCode: code });

        expect(res.body.error).toBe('Invalid discount code');
    });

    it('should return stats via admin api', async () => {
        await request(app).post('/api/cart/add').send({ userId: 'user1', productId: 'p1', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'user1' });

        const res = await request(app).get('/api/admin/stats');
        expect(res.status).toBe(200);
        expect(res.body.totalItemsPurchased).toBe(1);
        expect(res.body.totalRevenue).toBe(1000);
    });

    it('should allow admin to generate code if condition met', async () => {
        await request(app).post('/api/cart/add').send({ userId: 'u', productId: 'p2', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'u' });

        await request(app).post('/api/cart/add').send({ userId: 'u', productId: 'p2', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'u' });

        await request(app).post('/api/cart/add').send({ userId: 'u', productId: 'p2', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'u' });

        const res = await request(app).post('/api/admin/discount-code');
        expect(res.status).toBe(200);
        expect(res.body.code).toBeDefined();
    });

    it('should NOT allow admin to generate code if condition NOT met', async () => {
        await request(app).post('/api/cart/add').send({ userId: 'u', productId: 'p2', quantity: 1 });
        await request(app).post('/api/checkout').send({ userId: 'u' });

        const res = await request(app).post('/api/admin/discount-code');
        expect(res.status).toBe(400);
    });
});

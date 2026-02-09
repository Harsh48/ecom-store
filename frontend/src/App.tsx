import { useState, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
    productId: string;
    quantity: number;
}

interface Cart {
    userId: string;
    items: CartItem[];
}

interface Product {
    id: string;
    name: string;
    price: number;
}

const PRODUCTS: Product[] = [
    { id: 'p1', name: 'Laptop', price: 1000 },
    { id: 'p2', name: 'Mouse', price: 50 },
    { id: 'p3', name: 'Keyboard', price: 80 },
    { id: 'p4', name: 'Monitor', price: 300 }
];

function App() {
    const [userId, setUserId] = useState<string>('user-' + Math.floor(Math.random() * 1000));
    const [cart, setCart] = useState<Cart | null>(null);
    const [discountCode, setDiscountCode] = useState<string>('');
    const [checkoutResult, setCheckoutResult] = useState<any>(null);
    const [adminStats, setAdminStats] = useState<any>(null);
    const [adminCode, setAdminCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`/api/cart/${userId}`);
            setCart(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = async (productId: string) => {
        try {
            setError(null);
            await axios.post('/api/cart/add', { userId, productId, quantity: 1 });
            fetchCart();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const checkout = async () => {
        try {
            setError(null);
            const res = await axios.post('/api/checkout', { userId, discountCode });
            setCheckoutResult(res.data);
            setCart(null);
            setDiscountCode('');
            fetchStats();
        } catch (err: any) {
            setError(err.response?.data?.error || err.message);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/admin/stats');
            setAdminStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateAdminCode = async () => {
        try {
            setError(null);
            setAdminCode(null);
            const res = await axios.post('/api/admin/discount-code');
            setAdminCode(res.data.code);
            fetchStats();
        } catch (err: any) {
            setError(err.response?.data?.error || "Condition not satisfied (Nth order rule)");
        }
    };

    useEffect(() => {
        fetchCart();
        fetchStats();
    }, []);

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Ecommerce Store</h1>

            <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
                <strong>Current User:</strong> {userId} <button onClick={() => setUserId('user-' + Math.floor(Math.random() * 1000))}>New User</button>
            </div>

            {error && (
                <div style={{ padding: '10px', background: '#ffdddd', color: 'red', marginBottom: '20px', borderRadius: '4px' }}>
                    Error: {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h2>Products</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {PRODUCTS.map(p => (
                            <li key={p.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{p.name} - ${p.price}</span>
                                <button onClick={() => addToCart(p.id)} style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add to Cart</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <h2>Your Cart</h2>
                    {cart && cart.items.length > 0 ? (
                        <>
                            <ul style={{ paddingLeft: '20px' }}>
                                {cart.items.map((item, idx) => (
                                    <li key={idx}>Product {item.productId} x {item.quantity}</li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Discount Code"
                                    value={discountCode}
                                    onChange={e => setDiscountCode(e.target.value)}
                                    style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
                                />
                                <button onClick={checkout} style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Checkout</button>
                            </div>
                        </>
                    ) : (
                        <p>Cart is empty</p>
                    )}
                </div>
            </div>

            {checkoutResult && (
                <div style={{ marginTop: '20px', padding: '20px', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
                    <h3>Order Successful!</h3>
                    <p>Order ID: {checkoutResult.order.orderId}</p>
                    <p>Total: ${checkoutResult.order.totalAmount}</p>
                    <p>Discount: -${checkoutResult.order.discountAmount}</p>
                    <p><strong>Final Amount: ${checkoutResult.order.finalAmount}</strong></p>

                    {checkoutResult.generatedDiscountCode && (
                        <div style={{ marginTop: '10px', padding: '10px', background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px' }}>
                            <strong>🎉 Congratuations! You won a discount code!</strong><br />
                            Code: <code style={{ fontSize: '1.2em' }}>{checkoutResult.generatedDiscountCode}</code> (10% off next order)
                        </div>
                    )}
                </div>
            )}

            <hr style={{ margin: '40px 0' }} />

            <div style={{ background: '#eee', padding: '20px', borderRadius: '8px' }}>
                <h2>Admin Panel</h2>
                {adminStats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                        <div><strong>Items Sold:</strong> {adminStats.totalItemsPurchased}</div>
                        <div><strong>Revenue:</strong> ${adminStats.totalRevenue}</div>
                        <div><strong>Wait for Nth Order:</strong> {adminStats.totalItemsPurchased % 3 === 0 ? 'Ready!' : `${3 - (adminStats.totalItemsPurchased % 3)} more items needed`} (Example logic)</div>
                        <div><strong>Discounts Given:</strong> ${adminStats.totalDiscountAmountGiven}</div>
                    </div>
                )}

                <button onClick={generateAdminCode} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Generate Discount Code (Admin)</button>
                {adminCode && (
                    <div style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
                        Generated Code: {adminCode}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;

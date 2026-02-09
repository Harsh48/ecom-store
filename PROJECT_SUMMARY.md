# Ecommerce Store - Project Summary

## Overview
Full-stack ecommerce application with discount system that rewards every Nth customer.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite, Axios
- **Testing**: Jest, Supertest
- **Storage**: In-memory (Maps and Arrays)

## Features Implemented

### Backend APIs
1. **Cart Management**
   - Add items to cart
   - View cart by user

2. **Checkout System**
   - Process orders
   - Validate and apply discount codes
   - Auto-generate discount codes on Nth order
   - Calculate totals with discounts

3. **Admin Panel**
   - Generate discount codes (if condition met)
   - View comprehensive statistics

### Frontend UI
1. **Product Catalog** - Browse 4 sample products
2. **Shopping Cart** - Real-time cart updates
3. **Checkout Flow** - Apply discount codes
4. **Admin Dashboard** - View stats and generate codes
5. **Error Handling** - User-friendly error messages

### Discount System
- Every 3rd order receives a 10% discount code
- Codes are single-use only
- Validation prevents reuse and invalid codes
- Admin can manually generate codes when condition is met

## Running the Application

### Quick Start
```bash
npm install
cd frontend && npm install && cd ..
npm run start
```

Visit: http://localhost:3000

### Run Tests
```bash
npm test
```

All 9 integration tests pass ✓

## Project Structure
```
ecommerce-store/
├── src/
│   ├── models/          # Data types and in-memory store
│   ├── services/        # Business logic
│   ├── controllers/     # Request handlers
│   └── routes/          # API routes
├── tests/               # Integration tests
├── frontend/            # React application
│   ├── src/
│   │   ├── App.tsx     # Main UI component
│   │   └── main.tsx    # Entry point
│   └── dist/           # Built frontend (served by Express)
├── README.md
└── DECISIONS.md        # Design decision documentation
```

## Key Design Decisions

1. **In-Memory Storage** - Simple, fast, sufficient for demo
2. **Automatic Discount Generation** - Better UX than manual claim
3. **Global Order Counter** - Store-wide promotion system
4. **Single-Use Codes** - Marked as used, not deleted (audit trail)
5. **TypeScript** - Type safety and better developer experience

## API Examples

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","productId":"p1","quantity":1}'
```

### Checkout
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","discountCode":"DISCOUNT-ABC123"}'
```

### Admin Stats
```bash
curl http://localhost:3000/api/admin/stats
```

## Testing Coverage
- Cart operations
- Checkout without discount
- Nth order discount generation
- Discount code validation
- Discount code application
- Used code prevention
- Admin code generation
- Admin statistics

## Deliverables Checklist
- ✅ Working Backend APIs
- ✅ Frontend UI (bonus)
- ✅ In-memory storage
- ✅ Unit/Integration tests
- ✅ README.md with setup instructions
- ✅ DECISIONS.md with 5+ design decisions
- ✅ Clean git history showing progression
- ✅ Code quality and organization

## Next Steps for Production
1. Add persistent database (PostgreSQL/MongoDB)
2. Implement user authentication
3. Add payment gateway integration
4. Implement inventory management
5. Add order history and tracking
6. Deploy to cloud platform

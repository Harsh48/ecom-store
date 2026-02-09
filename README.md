# Ecommerce Store

This is a full-stack implementation for an ecommerce store with a specific discount system.

## Project Structure

```
ecommerce-store/
├── backend/          # Express.js API server
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/         # React + Vite application
│   ├── src/
│   └── package.json
└── package.json      # Root package.json with convenience scripts
```

## Setup

1.  **Install Dependencies**:
    ```bash
    npm run install:all
    ```
    Or install separately:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

2.  **Run Backend** (Development):
    ```bash
    npm run dev:backend
    ```
    The backend API runs on http://localhost:3000.

3.  **Run Frontend** (Development):
    ```bash
    npm run dev:frontend
    ```
    The frontend UI will be available at http://localhost:5173 (or the port Vite assigns).

4.  **Run Tests**:
    ```bash
    npm run test:backend
    ```

## Features

### Frontend
-   **Product Catalog**: Browse and add items to cart
-   **Shopping Cart**: View cart items and apply discount codes
-   **Checkout**: Complete orders with optional discount codes
-   **Admin Dashboard**: View store statistics and generate discount codes

### Backend
-   **Cart**: Add items to cart.
-   **Checkout**: Process order, apply discount codes, generate new discount codes every Nth order.
-   **Admin**: Generate discount codes manually (if condition met), view store statistics.

## API Endpoints

### User

-   `POST /api/cart/add`: Add item to cart.
    -   Body: `{ "userId": "string", "productId": "string", "quantity": number }`
-   `GET /api/cart/:userId`: Get user cart.
-   `POST /api/checkout`: Checkout.
    -   Body: `{ "userId": "string", "discountCode": "string" (optional) }`
    -   Response: `{ "order": Order, "generatedDiscountCode": "string" (optional) }`

### Admin

-   `POST /api/admin/discount-code`: Generate a discount code if the Nth order condition is met.
-   `GET /api/admin/stats`: Get store statistics.

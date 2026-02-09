# Ecommerce Store API

This is a backend implementation for an ecommerce store with a specific discount system.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Server**:
    ```bash
    npm run start
    ```
    The server runs on http://localhost:3000.

3.  **Run Tests**:
    ```bash
    npm test
    ```

## Functionality

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

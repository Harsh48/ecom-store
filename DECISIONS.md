# Design Decisions

## Decision 1: In-Memory Data Storage

**Context:** The requirement stated no database was needed, but data persistence logic is required for the application's lifecycle.

**Options Considered:**
-   **Option A**: Use SQLite or a light file-based DB.
-   **Option B**: Use simple In-Memory JavaScript objects (Arrays/Maps).

**Choice:** Option B (In-Memory `Map` and Arrays).

**Why:** It is sufficient for the scope of this assignment and allows for faster development. The `InMemoryStore` singleton acts as the database.
*Trade-off*: All data is lost when the server restarts.

## Decision 2: Automatic Discount Generation at Checkout

**Context:** The system needs to reward "Every nth order" with a discount code.

**Options Considered:**
-   **Option A**: User checks out, then must call a separate API to "claim" or "check" for a reward.
-   **Option B**: The system automatically checks the condition during checkout and returns the code in the response.

**Choice:** Option B.

**Why:** This provides a much better User Experience. The reward is instant and explicitly linked to the action (placing the nth order).

## Decision 3: Admin API `generate-code` Logic

**Context:** The Admin API must "Generate a discount code if the condition above is satisfied".

**Options Considered:**
-   **Option A**: Allow the Admin to generate a code *regardless* of the state (override).
-   **Option B**: Enforce the "nth order" rule strictly for the Admin API too.

**Choice:** Option B.

**Why:** The requirement explicitly says "if the condition above is satisfied". This implies the Admin API is a tool to utilize the system's rules manually, perhaps for testing or if the automatic generation failed (though in our system it wouldn't). It validates the system state before action.

## Decision 4: Global Order Count Tracking

**Context:** Tracking the "nth order".

**Options Considered:**
-   **Option A**: Count orders per user.
-   **Option B**: Global counter for the entire store.

**Choice:** Option B (Global Counter).

**Why:** The requirement "Every nth order gets a coupon" usually implies a system-wide promotion (like "You are the 100th customer!"). If it were per-user, it would likely say "Every nth order *placed by a user*".

## Decision 5: Discount Code Validation

**Context:** Ensuring codes are used only once.

**Options Considered:**
-   **Option A**: Delete the code after use.
-   **Option B**: Mark the code as `isUsed`.

**Choice:** Option B.

**Why:** This allows for better auditing and distinct error messages ("Invalid code" vs "Code already used").

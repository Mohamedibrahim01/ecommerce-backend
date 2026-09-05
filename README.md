# 🛒 E-Commerce RESTful API (Backend Service)

A scalable, secure, and production-ready RESTful API for a modern E-Commerce platform built with **Node.js, Express.js, and MongoDB**. Features enterprise-grade authentication, role-based access control, file management via Cloudinary, and interactive Swagger API documentation.

---

## 🚀 Key Architectural Features

- **Robust Authentication & Security:**
  - Dual-token lifecycle: Short-lived JWT Access Tokens (15 mins) paired with rotating, `httpOnly`, `SameSite=None`, `Secure` Refresh Cookies.
  - Granular Role-Based Access Control (`protect` and `admin` middlewares).
  - Rate limiting (`express-rate-limit`) and HTTP security headers (`helmet`).
  - Strict CORS origin filtering with multi-environment support.
  - Centralized global error handling with predictable error responses: `{ status, message, code }`.

- **Comprehensive Business Logic:**
  - **Catalog Management:** Paginated product listings, multi-criteria filtering, top-rated products, and review systems.
  - **Cart Management:** Dynamic stock validation preventing over-allocation.
  - **Order Lifecycle:** End-to-end checkout calculation (tax, shipping, items), delivery status dispatch, and cancellation with automated stock restoration.
  - **Media Storage:** Multipart/form-data upload pipeline streaming directly to **Cloudinary**.
  - **API Documentation:** Fully documented interactive endpoints using **Swagger UI** (`/api-docs`).

---

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **File Uploads:** Multer & Cloudinary
- **Documentation:** Swagger UI Express & YAMLjs
- **Security:** Helmet, CORS, Express-Rate-Limit, Cookie-Parser

---

## 📂 Project Structure

```text
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # User registration, login, token refresh, password resets
│   ├── categoryController.js # Category CRUD and query resolvers
│   ├── productController.js  # Product listing, pagination, and reviews
│   ├── cartController.js     # User cart synchronization & validation
│   ├── orderController.js    # Order lifecycle and payment status handling
│   └── userController.js     # Profile management and address book
├── middleware/
│   ├── authMiddleware.js     # Token verification (protect) & Admin check (admin)
│   ├── errorMiddleware.js    # 404 handler and unified error-formatting middleware
│   └── uploadMiddleware.js   # Multer storage configuration for uploads
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── categoryModel.js
│   ├── cartModel.js
│   └── orderModel.js
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── swagger.yaml              # OpenAPI specification
├── server.js                 # Application entry point
└── package.json

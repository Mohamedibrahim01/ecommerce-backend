import express from "express";
import {
  AddOrderItems,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Create order & Get all orders (Admin)
router
  .route("/")
  .post(protect, AddOrderItems)
  .get(protect, admin, getAllOrders);

// 2. Logged-in user orders
router.get("/my-orders", protect, getMyOrders);

// 3. Get order by ID
router.get("/:id", protect, getOrderById);

// 4. Update order to paid
router.put("/:id/pay", protect, updateOrderToPaid);

// 5. Update order to delivered (Admin)
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;

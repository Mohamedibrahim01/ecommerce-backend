import express from "express";
import {
  AddOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(AddOrderItems).get(admin, getAllOrders);

router.route("/myorders").get(getMyOrders);

router.route("/:id").get(getOrderById);
router.route("/:id/pay").put(updateOrderToPaid);
router.route("/:id/deliver").put(admin, updateOrderToDelivered);
router.route("/:id/cancel").put(cancelOrder);

export default router;

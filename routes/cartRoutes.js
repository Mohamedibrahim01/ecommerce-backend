import express from "express";
import {
  getMyCart,
  addToCart,
  updateCartQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getMyCart)
  .post(addToCart)
  .put(updateCartQuantity)
  .delete(clearCart);

router.route("/:productId").delete(removeItem);

export default router;

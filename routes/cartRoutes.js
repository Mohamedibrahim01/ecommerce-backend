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
router.route("/").get(getMyCart);
router.route("/add").post(addToCart);
router.route("/update-quantity").put(updateCartQuantity);
router.route("/remove/:productId").delete(removeItem);
router.route("/clear").delete(clearCart);

export default router;

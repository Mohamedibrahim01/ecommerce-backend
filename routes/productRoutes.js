import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllProducts);
router.route("/top").get(getTopProducts);
router.route("/:id").get(getProductById);

router.route("/:id/reviews").post(protect, createProductReview);

router.route("/").post(protect, admin, createProduct);
router
  .route("/:id")
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;

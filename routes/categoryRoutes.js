import express from "express";
import {
  getAllCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(protect, admin, upload.single("image"), createCategory);

router
  .route("/:id")
  .get(getCategoryByIdOrSlug)
  .put(protect, admin, upload.single("image"), updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;

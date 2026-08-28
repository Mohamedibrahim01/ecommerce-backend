import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// get All categories and create catogory
router.route("/").get(getAllCategories).post(protect, admin, createCategory);

// get category by slug
router.route("/:slug").get(getCategoryById);

// update and delete catogory
router
  .route("/:id")
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;

import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// User Profile Routes (Logged-in User)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  updateUserAvatar,
);

// Admin Routes (Users Management)
router.route("/all-users").get(protect, admin, getAllUsers);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById)
  .delete(protect, admin, deleteUserById);

export default router;

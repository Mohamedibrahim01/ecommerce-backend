import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  confirmEmail,
  resendConfirmationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);

// Email Confirmation Routes
router.get("/confirm-email/:token", confirmEmail);
router.post("/resend-confirmation", resendConfirmationEmail);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Private Password Routes
router.post("/change-password", protect, changePassword);

export default router;

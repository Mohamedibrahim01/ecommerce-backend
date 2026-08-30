import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = new User({
    name,
    email,
    password,
    confirmPassword,
  });

  const confirmToken = user.createEmailConfirmToken();
  await user.save();

  const confirmURL = `${process.env.CLIENT_URL}/confirm-email/${confirmToken}`;
  const message = `Welcome to our store! Please confirm your email by clicking on the link below:\n\n${confirmURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Welcome! Please Confirm Your Email",
      message,
    });

    res.status(201).json({
      status: "success",
      message:
        "Registration successful. Please check your email to activate your account.",
    });
  } catch (err) {
    user.emailConfirmToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error(
      "Account created, but error sending confirmation email. Please request a new one.",
    );
  }
});
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailConfirmed) {
    res.status(401);
    throw new Error("Please confirm your email before logging in");
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" },
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
  );

  sendRefreshToken(res, refreshToken);

  res.status(200).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      accessToken,
    },
  });
});
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    res.status(403);
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const newAccessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
});
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};
export const confirmEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ emailConfirmToken: hashedToken });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired email confirmation token");
  }

  user.isEmailConfirmed = true;
  user.emailConfirmToken = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email confirmed successfully. You can now log in.",
  });
});
export const resendConfirmationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email");
  }

  if (user.isEmailConfirmed) {
    res.status(400);
    throw new Error("Email is already confirmed");
  }

  const confirmToken = user.createEmailConfirmToken();
  await user.save({ validateBeforeSave: false });

  const confirmURL = `${process.env.CLIENT_URL}/confirm-email/${confirmToken}`;
  const message = `Please confirm your email by clicking on the link: \n\n ${confirmURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Email Confirmation - Store",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Confirmation email sent successfully",
    });
  } catch (err) {
    user.emailConfirmToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error("There was an error sending the email. Try again later.");
  }
});
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email address");
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `You requested a password reset. Please click on the link to reset your password:\n\n${resetURL}\n\nThis link is valid for 10 minutes only.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token sent to your email",
    });
  } catch (err) {
    console.error("Email sending failed with details:", err);
    user.emailConfirmToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error(
      "Account created, but error sending confirmation email. Please request a new one.",
    );
  }
});
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or has expired");
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message:
      "Password reset successful. You can now log in with the new password.",
  });
});
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user || !(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

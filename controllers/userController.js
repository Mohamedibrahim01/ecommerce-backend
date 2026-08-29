import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
    },
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
  }

  const updatedUser = await user.save();

  const accessToken = jwt.sign(
    { id: updatedUser._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: updatedUser._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  sendRefreshToken(res, refreshToken);

  res.status(200).json({
    status: "success",
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      accessToken,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});
export const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.isAdmin !== undefined) {
    user.isAdmin = req.body.isAdmin;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    status: "success",
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    },
  });
});
export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});
export const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image file");
  }

  const imagePath = `/${req.file.path.replace(/\\/g, "/")}`;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.avatar = imagePath;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Avatar updated successfully",
    data: user.avatar,
  });
});

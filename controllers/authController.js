import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    sendRefreshToken(res, refreshToken);

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" },
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );

      sendRefreshToken(res, refreshToken);

      return res.status(200).json({
        status: "success",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          accessToken,
        },
      });
    }

    res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
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
  } catch (err) {
    res.status(403).json({
      status: "fail",
      message: "Invalid or expired refresh token",
    });
  }
};
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

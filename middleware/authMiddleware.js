import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Unauthorized, please log in again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User was not found!" });
    }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid Token, please log in again" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    return res.status(403).json({ status: "fail", message: "Access Denied" });
  }
};

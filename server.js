import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(
  helmet({
    crossOriginResourcePolicy: false, 
  }),
);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, 
  message: {
    status: "fail",
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());

// Base Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

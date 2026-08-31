import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const swaggerDocument = YAML.load("./swagger.yaml");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.set("trust proxy", 1);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "fail",
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api/v1", limiter);

// Body Parsers
app.use(express.json());
app.use(cookieParser());

// Static Uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Base Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/carts", cartRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

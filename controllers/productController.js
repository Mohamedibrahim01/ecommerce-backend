import Product from "../models/ProductModel.js";
import asyncHandler from "express-async-handler";

export const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};

  const filter = { ...keyword, ...categoryFilter };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({
    status: "success",
    data: products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
});
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category", "name slug")
    .sort({ rating: -1 })
    .limit(4);

  res.status(200).json({
    status: "success",
    data: products,
  });
});
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name slug description",
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: product,
  });
});
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully!",
  });
});
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    status: "success",
    message: "Review added successfully",
    data: review,
  });
});

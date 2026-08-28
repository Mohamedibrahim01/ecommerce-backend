import Product from "../models/ProductModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      status: "success",
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "server error",
      error: err.message,
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).json({
        status: "success",
        data: product,
      });
    }
    return res.status(404).json({
      status: "fail",
      message: "Product not found!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Server error",
      error: err.message,
    });
  }
};
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user._id, // ربط المنتج بالأدمن الحالي
    });

    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found!",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found!",
      });
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

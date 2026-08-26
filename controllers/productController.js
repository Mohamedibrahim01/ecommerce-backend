import Product from "../models/ProductModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      status: "success",
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

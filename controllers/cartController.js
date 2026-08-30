import asyncHandler from "express-async-handler";
import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product",
    "name price image countInStock",
  );

  if (!cart) {
    return res.status(200).json({
      status: "success",
      data: { cartItems: [], totalPrice: 0 },
    });
  }

  res.status(200).json({
    status: "success",
    data: cart,
  });
});
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    if (product.countInStock < quantity) {
      res.status(400);
      throw new Error("Quantity exceeds available stock");
    }

    cart = new Cart({
      user: req.user._id,
      cartItems: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      const newQuantity = cart.cartItems[itemIndex].quantity + quantity;
      if (product.countInStock < newQuantity) {
        res.status(400);
        throw new Error("Quantity exceeds available stock");
      }
      cart.cartItems[itemIndex].quantity = newQuantity;
      cart.cartItems[itemIndex].price = product.price;
    } else {
      if (product.countInStock < quantity) {
        res.status(400);
        throw new Error("Quantity exceeds available stock");
      }
      cart.cartItems.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate(
    "cartItems.product",
    "name price image countInStock",
  );

  res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: updatedCart,
  });
});
export const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const [cart, product] = await Promise.all([
    Cart.findOne({ user: req.user._id }),
    Product.findById(productId),
  ]);

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error("Quantity exceeds available stock");
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  cart.cartItems[itemIndex].quantity = quantity;
  cart.cartItems[itemIndex].price = product.price;

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate(
    "cartItems.product",
    "name price image countInStock",
  );

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: updatedCart,
  });
});
export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate(
    "cartItems.product",
    "name price image countInStock",
  );

  res.status(200).json({
    status: "success",
    message: "Item removed from cart",
    data: updatedCart,
  });
});
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: { cartItems: [], totalPrice: 0 },
  });
});

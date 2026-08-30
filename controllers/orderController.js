import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name email");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});
export const AddOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Product ${item.name || "item"} is out of stock`);
    }
    product.countInStock -= item.qty;
    await product.save();
  }

  const order = await Order.create({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({
    status: "success",
    data: order,
  });
});
export const getMyOrders = asyncHandler(async (req, res) => {
  const myOrders = await Order.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    results: myOrders.length,
    data: myOrders,
  });
});
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address || req.body.email_address,
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  if (order.isDelivered) {
    res.status(400);
    throw new Error("Cannot cancel an already delivered order");
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.qty;
      await product.save();
    }
  }

  order.status = "Cancelled";
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order cancelled and stock restored successfully",
    data: updatedOrder,
  });
});

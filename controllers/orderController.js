import Order from "../models/OrderModel.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    if (orders) {
      return res.status(200).json({
        status: "success",
        data: orders,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "No orders",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const AddOrderItems = async (req, res) => {
  try {
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
      return res.status(400).json({
        status: "fail",
        message: "No order Items",
      });
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
      data: orderItems,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "order not found",
      });
    }
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        status: "fail",
        message: "Not authorized to view this order",
      });
    }
    return res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const myOrders = await Order.find({ user: req.user._id });
    res.status(200).json({
      status: "success",
      data: myOrders,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
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
    } else {
      return res.status(404).json({
        status: "fail",
        message: "not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      return res.status(200).json({
        status: "success",
        data: updatedOrder,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

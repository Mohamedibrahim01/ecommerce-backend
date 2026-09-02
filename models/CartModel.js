import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity cannot be less than 1"],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cartItems: [CartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true },
);

CartSchema.pre("save", function (next) {
  const total = this.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  this.totalPrice = Number(total.toFixed(2));
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;

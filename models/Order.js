const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    customerId: { type: String },
    items: [],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    deliveryStatus: { type: String, default: "pending" },
    paymentStatus: { type: String, required: true },
    paymentIntentId: { type: String },
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

exports.Order = Order;

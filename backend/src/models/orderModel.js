import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [String],
  table: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

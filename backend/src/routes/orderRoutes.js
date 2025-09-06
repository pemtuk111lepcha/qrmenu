import express from "express";
import Order from "../models/orderModel.js";

const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Add new order
router.post("/", async (req, res) => {
  const { items, table, status } = req.body;
  const order = await Order.create({ items, table, status });
  res.status(201).json(order);
});

// Update order status
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  res.json(order);
});

export default router;

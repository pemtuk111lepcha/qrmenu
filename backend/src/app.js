// filepath: c:\Users\Lenovo\Downloads\projects by pemtuk\qrmenu (2)\qrmenu\qrmenu\backend\src\app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cron from "node-cron";
import Order from "./models/orderModel.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads folder (absolute path) with CORS headers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Update uploadsPath to match your actual uploads folder location
const uploadsPath = path.resolve(__dirname, "../uploads");
console.log("Resolved uploads path:", uploadsPath);

// Debug: Check if uploads folder exists and log files
if (!fs.existsSync(uploadsPath)) {
  console.error("Uploads folder does NOT exist:", uploadsPath);
} else {
  const files = fs.readdirSync(uploadsPath);
  console.log("Files in uploads folder:", files);
}
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}, express.static(uploadsPath));

// Debug: Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Schedule to clear orders every day at midnight
cron.schedule("0 0 * * *", async () => {
  await Order.deleteMany({});
  console.log("All orders cleared at midnight");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { getMenu, addMenuItem, deleteMenuItem } from "../controllers/menuController.js";
import protect from "../middleware/authMiddleware.js";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Allow public GET for menu (customer access), protect POST/DELETE for admin
router.get("/", getMenu); // Public access for customers
router.post("/", protect, upload.single("image"), addMenuItem);
router.delete("/:id", protect, deleteMenuItem);

export default router;
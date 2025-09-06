import MenuItem from "../models/menuModel.js";
import Image from "../models/imageModel.js"; // Add this import

export const getMenu = async (req, res) => {
  // If userId is provided as query param, filter by that admin's menu
  const userId = req.query.userId || req.user?._id;
  let filter = {};
  if (userId) filter.user = userId;
  const menu = await MenuItem.find(filter);
  res.json(menu);
};

export const addMenuItem = async (req, res) => {
  const { name, price } = req.body;
  let image = req.body.image;
  let imageDoc = null;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
    // Save image metadata to Image collection
    imageDoc = await Image.create({
      filename: req.file.filename,
      path: image,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  }
  if (!name || !price) return res.status(400).json({ message: "Name and price required" });

  // Associate menu item with the logged-in admin
  const item = await MenuItem.create({ name, price, image, user: req.user._id });
  // Optionally, you can link the imageDoc._id to the menu item if you want
  res.status(201).json(item);
};

export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  // Only allow deletion if the menu item belongs to the logged-in admin
  const item = await MenuItem.findOne({ _id: id, user: req.user._id });
  if (!item) return res.status(404).json({ message: "Item not found" });
  await MenuItem.deleteOne({ _id: id });
  res.json({ message: "Item deleted" });
};
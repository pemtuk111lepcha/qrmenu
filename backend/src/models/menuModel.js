import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // link to admin
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
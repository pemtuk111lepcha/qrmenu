// filepath: c:\Users\Lenovo\Downloads\projects by pemtuk\qrmenu (2)\qrmenu\qrmenu\backend\src\config\db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // Debug line
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
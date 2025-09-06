import User from "../models/userModel.js";
import generateToken from "../utils/tokenUtils.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    // Send detailed error message for debugging
    let message = "Server error";
    if (err.name === "ValidationError") {
      message = err.message;
    } else if (err.code === 11000) {
      message = "Email already registered";
    }
    res.status(500).json({ message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("user");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "You must be logged in" });

  try {
    const { _id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(_id);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user; // Assign the user to req.user
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

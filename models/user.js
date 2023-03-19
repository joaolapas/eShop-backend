const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 3, maxlength: 250 },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
exports.User = User;

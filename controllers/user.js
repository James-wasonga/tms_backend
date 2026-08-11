// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.getAllUsers = async (req, res) => {
//   const users = await User.find().sort({ created: -1 }).select("name email phone createdAt updatedAt address");

//   res.json(users);
// };

// exports.userById = async (req, res, next, id) => {
//   const user = await User.findById(id);
//   if (user) {
//     user.salt = undefined;
//     user.hashed_password = undefined;
//     req.userprofile = user;
//     next();
//   } else {
//     res.status(400).json({ status: "FAILED",error: "User not found!" });
//   }
// };

// exports.read = (req, res) => {
//   return res.json(req.userprofile);
// };


const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort({ created: -1 }).select("name email phone createdAt updatedAt address");
  res.json(users);
};

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (user) {
    user.salt = undefined;
    user.hashed_password = undefined;
    req.userprofile = user;
    next();
  } else {
    res.status(400).json({ status: "FAILED", error: "User not found!" });
  }
};

exports.read = (req, res) => {
  return res.json(req.userprofile);
};

exports.updateUser = async (req, res) => {
  try {
    const { userid, name, email, phone, address } = req.body;
    const targetId = userid || (req.userauth && req.userauth._id);

    if (!targetId) {
      return res.status(400).json({ status: "FAILED", error: "User ID is required." });
    }

    let user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ status: "FAILED", error: "User not found!" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    user.updated = Date.now();

    await user.save();

    user.salt = undefined;
    user.hashed_password = undefined;

    return res.json({
      status: "SUCCESS",
      message: "Profile updated successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      }
    });
  } catch (err) {
    return res.status(500).json({ status: "FAILED", error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userid, old_password, new_password } = req.body;
    const targetId = userid || (req.userauth && req.userauth._id);

    if (!targetId) {
      return res.status(400).json({ status: "FAILED", error: "User ID is required." });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ status: "FAILED", error: "User not found!" });
    }

    if (!old_password || !new_password) {
      return res.status(400).json({ status: "FAILED", error: "Current and new passwords are required." });
    }

    if (!user.authenticate(old_password)) {
      return res.status(400).json({ status: "FAILED", error: "Current password is incorrect." });
    }

    user.password = new_password;
    user.updated = Date.now();
    await user.save();

    return res.json({ status: "SUCCESS", message: "Password updated successfully!" });
  } catch (err) {
    return res.status(500).json({ status: "FAILED", error: err.message });
  }
};
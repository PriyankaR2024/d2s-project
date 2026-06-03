const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ userId }); // not _id
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      userId: user.userId,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      licenseNumber: user.licenseNumber,
      vehicleType: user.vehicleType,
      vehicleNumber: user.vehicleNumber
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;

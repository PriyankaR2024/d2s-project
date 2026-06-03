// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, amount, bookingId } = req.body;

  if (!userId || !amount || !bookingId) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  // Simulate payment processing delay
  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: 'Payment successful',
      transactionId: 'txn-' + Math.floor(Math.random() * 1000000),
      bookingId,
      userId,
      amount
    });
  }, 1500); // simulate delay
});

module.exports = router;

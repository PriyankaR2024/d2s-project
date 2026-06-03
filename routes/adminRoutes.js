const express = require('express');
const router = express.Router();
const User = require('../models/user');       
const Booking = require('../models/booking');  

// GET all users (both customers and drivers)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude password
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings with customer info
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find();
    const bookingsWithUserInfo = await Promise.all(bookings.map(async (booking) => {
      const user = await User.findOne({ userId: booking.userId });
      return {
        bookingId: booking._id,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        driverId: booking.driverId || null,
        customerName: user?.username || 'Unknown',
        customerPhone: user?.phone || 'N/A'
      };
    }));
    res.json(bookingsWithUserInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

module.exports = router;

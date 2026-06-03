// routes/historyRoutes.js

const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');


//  Route: GET /api/history/user/:id
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id; 
    console.log("Fetching history for userId:", userId);  // For debug

    //  Filter by userId and completed status
    const bookings = await Booking.find({ userId: userId, status: "Completed" });


    if (!bookings.length) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }
    

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching booking history:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// get all bookings for admin/driver
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find({});
    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found." });
    }
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

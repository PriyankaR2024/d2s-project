const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const User = require('../models/user');

// Create a new booking
router.post('/book', async (req, res) => {
  const { userId, pickupLocation, dropLocation, date, time } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newBooking = new Booking({
      userId,
      pickupLocation,
      dropLocation,
      date,
      time,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully.' });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ message: 'Failed to create booking.' });
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
        paymentStatus: booking.paymentStatus,
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

// Get all pending bookings (no driver assigned yet)
router.get('/pending', async (req, res) => {
  try {
    const pendingBookings = await Booking.find({
      status: 'Pending',
      driverId: null
    });
    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending bookings' });
  }
});

// Get customer's active bookings (Pending or Accepted)
router.get('/status/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({
      userId,
      status: { $in: ['Pending', 'Accepted'] }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Customer active bookings fetch error:', error);
    res.status(500).json({ message: 'Error fetching customer bookings' });
  }
});


// Update booking status and optionally assign driver
router.put('/:bookingId/status', async (req, res) => {
  const { bookingId } = req.params;
  const { status, driverId } = req.body;

  try {
    const update = { status };
    if (driverId) update.driverId = driverId;

    const updated = await Booking.findByIdAndUpdate(bookingId, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking updated', booking: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

// Cancel a booking (remove driverId and set to Pending)
router.put('/:bookingId/cancel', async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { $unset: { driverId: "" }, status: 'Pending' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking canceled', booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

// Get ride history for a specific driver
router.get('/driver/:driverId/history', async (req, res) => {
  const { driverId } = req.params;

  try {
    const bookings = await Booking.find({
      driverId,
      status: { $in: ['Accepted', 'Completed'] }
    });

    const bookingsWithUserInfo = await Promise.all(bookings.map(async (booking) => {
      const user = await User.findOne({ userId: booking.userId });
      return {
        bookingId: booking._id,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        driverId: booking.driverId || null,
        customerName: user?.username || 'Unknown',
        customerPhone: user?.phone || 'N/A'
      };
    }));

    res.json(bookingsWithUserInfo);
  } catch (error) {
    console.error('Ride history fetch error:', error);
    res.status(500).json({ message: 'Error fetching ride history' });
  }
});

router.put('/:id/payment', async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log("🔍 Received payment request for booking ID:", bookingId); 

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log(" Booking not found in DB for ID:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "Accepted") {
      console.log("Booking status is not 'Accepted'. Payment not allowed.");
      return res.status(400).json({ message: "Payment not allowed until booking is accepted" });
    }

    booking.paymentStatus = "Paid";
    await booking.save();

    console.log("Payment marked as successful for booking:", bookingId);
    res.json({ message: "Payment marked as successful" });
  } catch (err) {
    console.error(" Error processing payment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = router;

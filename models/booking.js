

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: String,
  driverId: String,
  pickupLocation: String,
  dropLocation: String,
  date: String,
  time: String,
  vehicleType: String,
  status: String,
  paymentStatus: {
    type: String,
    default: 'Unpaid'  // new field to track payment
  }
});

const Booking = mongoose.models.Booking ||
mongoose.model('Booking', bookingSchema);
module.exports = Booking;

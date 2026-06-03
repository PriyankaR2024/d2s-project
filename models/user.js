const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: String,
  phone: String,
  email: String,
  password: String,
  role: String,
  licenseNumber: String,
  vehicleType: String,
  vehicleNumber: String
}, {
  versionKey: false 
});

// Prevents model overwrite issue during dev/refresh
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;




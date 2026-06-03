const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Atlas URI
const mongoURI = "mongodb+srv://pbangarirawat:Pbangarirawat%40Atlas@cluster0.dwbvl7m.mongodb.net/d2s_db?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// User model
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
}, { versionKey: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, phone, email, password, role, licenseNumber, vehicleType, vehicleNumber } = req.body;

  try {
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    let uniqueId;
    let exists = true;
    while (exists) {
      uniqueId = 'd2s-' + Math.floor(1000 + Math.random() * 9000);
      exists = await User.findOne({ userId: uniqueId });
    }

    const newUser = {
      userId: uniqueId,
      username,
      phone,
      email,
      password,
      role,
      licenseNumber: role === "Driver" ? licenseNumber : "",
      vehicleType: role === "Driver" ? vehicleType : "",
      vehicleNumber: role === "Driver" ? vehicleNumber : ""
    };

    await User.create(newUser);
    res.status(201).json({
      success: true,
      message: "Signup successful",
      userId: uniqueId,
      role: role
    });
    

    //  res.json({ message: "Signup successful", userId: uniqueId });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// Login Route
app.post('/login', async (req, res) => {
  const { phone, password, role } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.json({ success: false, error: "not_registered" });
    }

    if (user.password.trim() !== password.trim()) {
      return res.json({ success: false, error: "invalid_password" });
    }

    if (user.role !== role) {
      return res.json({ success: false, error: "wrong_role" });
    }

    let redirectUrl = '';
    if (role === 'Customer') redirectUrl = '/customer_dashboard.html';
    else if (role === 'Driver') redirectUrl = '/driver_dashboard.html';
    else if (role === 'Admin') redirectUrl = '/admin_dashboard.html';

    return res.json({ success: true, redirectUrl, userId: user.userId ,role: user.role });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});



// Booking & History Routes
//const bookingRoutes = require('./routes/bookingRoutes');
//app.use('/api', bookingRoutes);


// app.js
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);


const historyRoutes = require('./routes/historyRoutes');
app.use('/api/history', historyRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api', profileRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

const forgotPasswordRoute = require('./routes/forgotpasswordRoutes');
app.use('/api', forgotPasswordRoute);


// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../d2s/index.html"));
});

const adminRoutes = require('./routes/adminRoutes'); // path as per your folder
app.use('/api/admin', adminRoutes);




// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

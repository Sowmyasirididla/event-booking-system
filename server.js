// server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/events', require('./routes/eventRoutes'));
app.use('/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

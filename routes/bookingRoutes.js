// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Book a seat for eventId
router.post('/book/:eventId', auth, bookingController.bookSeat);

// Cancel booking
router.post('/cancel/:bookingId', auth, bookingController.cancelBooking);

// Get user's bookings
router.get('/me', auth, bookingController.getUserBookings);

module.exports = router;

// controllers/bookingController.js
const db = require('../config/db'); // pool
const bookingModel = require('../models/bookingModel');
const eventModel = require('../models/eventModel');

exports.bookSeat = async (req, res) => {
  const user_id = req.user.id;
  const event_id = req.params.eventId;

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // 1) Check if user already has an active booking for this event
    const existing = await bookingModel.getBooking(user_id, event_id);
    if (existing) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: 'You already have a booking for this event' });
    }

    // 2) Lock the event row FOR UPDATE to prevent concurrent modifications
    const [rows] = await conn.execute('SELECT seats_available FROM events WHERE id = ? FOR UPDATE', [event_id]);
    if (rows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: 'Event not found' });
    }
    const seats_available = rows[0].seats_available;
    if (seats_available <= 0) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: 'No seats available' });
    }

    // 3) decrement seats_available
    await conn.execute('UPDATE events SET seats_available = seats_available - 1 WHERE id = ?', [event_id]);

    // 4) insert booking
    const bookingId = await bookingModel.createBooking(conn, { user_id, event_id });

    await conn.commit();
    conn.release();

    res.status(201).json({ message: 'Booking successful', bookingId });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
        conn.release();
      } catch (e) {
        console.error('Rollback error', e);
      }
    }
    console.error(err);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

exports.cancelBooking = async (req, res) => {
  const user_id = req.user.id;
  const bookingId = req.params.bookingId;

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // 1) fetch booking, ensure it belongs to user and is booked
    const [brows] = await conn.execute('SELECT * FROM bookings WHERE id = ? FOR UPDATE', [bookingId]);
    if (brows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = brows[0];
    if (booking.user_id !== user_id) {
      await conn.rollback();
      conn.release();
      return res.status(403).json({ message: 'Cannot cancel someone else booking' });
    }
    if (booking.status !== 'booked') {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // 2) mark booking as cancelled
    const affected = await bookingModel.cancelBooking(conn, bookingId);
    if (!affected) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: 'Unable to cancel booking' });
    }

    // 3) increase seats_available on event
    await conn.execute('UPDATE events SET seats_available = seats_available + 1 WHERE id = ?', [booking.event_id]);

    await conn.commit();
    conn.release();

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
        conn.release();
      } catch (e) {
        console.error('Rollback error', e);
      }
    }
    console.error(err);
    res.status(500).json({ message: 'Server error during cancellation' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookings = await bookingModel.getBookingsByUser(user_id);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

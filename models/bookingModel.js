// models/bookingModel.js
const db = require('../config/db');

exports.getBooking = async (user_id, event_id) => {
  const [rows] = await db.execute(
    'SELECT * FROM bookings WHERE user_id=? AND event_id=? AND status = "booked"',
    [user_id, event_id]
  );
  return rows[0];
};

exports.createBooking = async (conn, { user_id, event_id }) => {
  // Using provided transaction connection `conn`
  const [result] = await conn.execute(
    'INSERT INTO bookings (user_id, event_id, status) VALUES (?, ?, ?)',
    [user_id, event_id, 'booked']
  );
  return result.insertId;
};

exports.cancelBooking = async (conn, bookingId) => {
  const [result] = await conn.execute(
    'UPDATE bookings SET status = ? WHERE id = ? AND status = ?',
    ['cancelled', bookingId, 'booked']
  );
  return result.affectedRows;
};

exports.getBookingsByUser = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT b.id, b.event_id, e.title, e.event_date, b.status, b.created_at
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     WHERE b.user_id = ? ORDER BY b.created_at DESC`,
    [user_id]
  );
  return rows;
};

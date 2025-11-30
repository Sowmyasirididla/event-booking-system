// models/eventModel.js
const db = require('../config/db');

exports.createEvent = async ({ title, description, event_date, total_seats, created_by }) => {
  const [result] = await db.execute(
    'INSERT INTO events (title, description, event_date, total_seats, seats_available, created_by) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, event_date, total_seats, total_seats, created_by]
  );
  return result.insertId;
};

exports.updateEvent = async (id, data) => {
  const { title, description, event_date, total_seats } = data;
  // If total_seats changes, adjust seats_available accordingly (careful: simple approach)
  // We'll not auto-adjust seats_available here to keep logic simple; admin should manage seats carefully.
  const [result] = await db.execute(
    'UPDATE events SET title=?, description=?, event_date=?, total_seats=? WHERE id=?',
    [title, description, event_date, total_seats, id]
  );
  return result.affectedRows;
};

exports.deleteEvent = async (id) => {
  const [result] = await db.execute('DELETE FROM events WHERE id=?', [id]);
  return result.affectedRows;
};

exports.getEventById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
  return rows[0];
};

exports.listEvents = async () => {
  const [rows] = await db.execute('SELECT id, title, description, event_date, total_seats, seats_available, created_by FROM events ORDER BY event_date ASC');
  return rows;
};

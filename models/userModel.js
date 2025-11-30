// models/userModel.js
const db = require('../config/db');

exports.createUser = async ({ name, email, password, role='user' }) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

exports.findByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0];
};

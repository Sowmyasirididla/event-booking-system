// middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user; // { id, name, email, role }
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

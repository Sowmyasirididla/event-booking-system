// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Public: list events and get event details
router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEvent);

// Admin routes for event management
router.post('/', auth, role('admin'), eventController.createEvent);
router.put('/:id', auth, role('admin'), eventController.updateEvent);
router.delete('/:id', auth, role('admin'), eventController.deleteEvent);

module.exports = router;

// controllers/eventController.js
const eventModel = require('../models/eventModel');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, event_date, total_seats } = req.body;
    if (!title || !event_date || !total_seats) return res.status(400).json({ message: 'Missing fields' });

    const id = await eventModel.createEvent({
      title,
      description: description || '',
      event_date,
      total_seats: parseInt(total_seats, 10),
      created_by: req.user.id
    });

    res.status(201).json({ message: 'Event created', eventId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const affected = await eventModel.updateEvent(id, req.body);
    if (!affected) return res.status(404).json({ message: 'Event not found or no changes' });
    res.json({ message: 'Event updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const affected = await eventModel.deleteEvent(id);
    if (!affected) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listEvents = async (req, res) => {
  try {
    const events = await eventModel.listEvents();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const event = await eventModel.getEventById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

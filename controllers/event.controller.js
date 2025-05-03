const Event = require('../models/Event');
const Attendee = require('../models/Attendee');

// Получить все ивенты
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('attendees');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить подробности события
exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('attendees');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Добавить участника
exports.addAttendee = async (req, res) => {
  try {
    const { name, email } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newAttendee = new Attendee({ name, email });
    await newAttendee.save();

    event.attendees.push(newAttendee);
    await event.save();

    res.status(201).json(newAttendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

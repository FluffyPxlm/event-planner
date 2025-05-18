const eventDao = require('../daos/event.dao');
const attendeeDao = require('../daos/attendee.dao'); // Не забудь подключить!

function addEvent(req, res) {
  const { name, date, description } = req.body;

  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required.' });
  }

  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    return res.status(400).json({ error: 'Cannot create event in the past.' });
  }

  const existingEvent = eventDao.getAllEvents().find(
    (e) => e.name.toLowerCase() === name.toLowerCase() && e.date === date
  );

  if (existingEvent) {
    return res.status(400).json({ error: 'Event with the same name and date already exists.' });
  }

  const event = eventDao.createEvent(name, date, description);
  res.status(201).json(event);
}

function listEvents(req, res) {
  const events = eventDao.getAllEvents();
  res.json(events);
}

function updateEvent(req, res) {
  const { id } = req.params;
  const { name, date, description } = req.body;

  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    return res.status(400).json({ error: 'Cannot set event date in the past.' });
  }

  const existingEvent = eventDao.getAllEvents().find(
    (e) => e.id !== parseInt(id) && e.name.toLowerCase() === name.toLowerCase() && e.date === date
  );

  if (existingEvent) {
    return res.status(400).json({ error: 'Event with the same name and date already exists.' });
  }

  const updated = eventDao.updateEvent(parseInt(id), name, date, description);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Event not found.' });
  }
}

function deleteEvent(req, res) {
  const { id } = req.params;

  attendeeDao.deleteAttendeesByEventId(parseInt(id));

  const deleted = eventDao.deleteEvent(parseInt(id));
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Event not found.' });
  }
}

module.exports = { addEvent, listEvents, updateEvent, deleteEvent };

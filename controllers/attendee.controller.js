const attendeeDao = require('../daos/attendee.dao');

function addAttendee(req, res) {
  const { name, email, eventId, status = 'maybe' } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = attendeeDao.getAllAttendees().find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return res.status(400).json({ error: 'Attendee with this email already exists.' });
  }

  const attendee = attendeeDao.createAttendee(name, email, eventId, status);
  return res.status(201).json(attendee);
}

function listAttendees(req, res) {
  const attendees = attendeeDao.getAllAttendees();
  return res.json(attendees);
}

function updateAttendee(req, res) {
  const { id } = req.params;
  const { name, email, eventId, status = 'maybe' } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = attendeeDao.getAllAttendees().find(
    (a) => a.id !== parseInt(id) && a.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return res.status(400).json({ error: 'Another attendee with this email already exists.' });
  }

  const updated = attendeeDao.updateAttendee(parseInt(id), name, email, eventId, status);
  if (updated) {
    return res.json(updated);
  } else {
    return res.status(404).json({ error: 'Attendee not found.' });
  }
}

function deleteAttendee(req, res) {
  const { id } = req.params;

  const success = attendeeDao.deleteAttendee(parseInt(id));
  if (success) {
    return res.json({ message: 'Attendee deleted successfully.' });
  } else {
    return res.status(404).json({ error: 'Attendee not found.' });
  }
}

module.exports = {
  listAttendees,
  addAttendee,
  updateAttendee,
  deleteAttendee,
};

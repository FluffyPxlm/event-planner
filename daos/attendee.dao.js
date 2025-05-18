let attendees = [];
let currentId = 1;

function createAttendee(name, email, eventId, status = 'maybe') {
  const attendee = { id: currentId++, name, email, eventId, status };
  attendees.push(attendee);
  return attendee;
}

function getAllAttendees() {
  return attendees;
}

function updateAttendee(id, name, email, eventId, status = 'maybe') {
  const attendee = attendees.find(a => a.id === id);
  if (!attendee) return null;

  if (name) attendee.name = name;
  if (email) attendee.email = email;
  if (eventId) attendee.eventId = eventId;
  if (status) attendee.status = status;

  return attendee;
}

function deleteAttendee(id) {
  const index = attendees.findIndex(a => a.id === id);
  if (index === -1) return false;

  attendees.splice(index, 1);
  return true;
}

function deleteAttendeesByEventId(eventId) {
  attendees = attendees.filter(attendee => attendee.eventId !== eventId);
}

module.exports = {
  createAttendee,
  getAllAttendees,
  updateAttendee,
  deleteAttendee,
  deleteAttendeesByEventId,
};

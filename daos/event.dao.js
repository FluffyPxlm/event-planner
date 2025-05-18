let events = [];
let currentId = 1;

function createEvent(name, date, description = '') {
  const event = { id: currentId++, name, date, description };
  events.push(event);
  return event;
}

function getAllEvents() {
  return events;
}

function updateEvent(id, name, date, description) {
  const event = events.find(e => e.id === id);
  if (!event) return null;

  if (name) event.name = name;
  if (date) event.date = date;
  if (description !== undefined) event.description = description;

  return event;
}

function deleteEvent(id) {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return false;

  events.splice(index, 1);
  return true;
}

module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent };

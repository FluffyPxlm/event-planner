const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: String,
  email: String
});

module.exports = mongoose.model('Attendee', attendeeSchema);

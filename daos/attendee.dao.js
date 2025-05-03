const Attendee = require('../models/attendee.model');

const AttendeeDAO = {
  async getByEvent(eventId) {
    return await Attendee.find({ eventId });
  },

  async create(eventId, data) {
    return await Attendee.create({ eventId, ...data });
  }
};

module.exports = AttendeeDAO;

const Event = require('../models/event.model');

const EventDAO = {
  async getAll() {
    return await Event.find();
  },

  async getById(id) {
    return await Event.findById(id);
  },

  async create(data) {
    return await Event.create(data);
  }
};

module.exports = EventDAO;

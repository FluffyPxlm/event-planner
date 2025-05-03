const AttendeeDAO = require('../daos/attendee.dao');

const AttendeeController = {
  async getByEvent(req, res) {
    try {
      const attendees = await AttendeeDAO.getByEvent(req.params.eventId);
      res.json(attendees);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch attendees' });
    }
  },

  async create(req, res) {
    try {
      const { eventId } = req.params;
      const attendee = await AttendeeDAO.create(eventId, req.body);
      res.status(201).json(attendee);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add attendee' });
    }
  }
};

module.exports = AttendeeController;

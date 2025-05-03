const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/events', eventController.getAllEvents);

router.get('/events/:eventId', eventController.getEventDetails);

router.post('/events/:eventId/attendees', eventController.addAttendee);

module.exports = router;

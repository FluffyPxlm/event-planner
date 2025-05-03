const express = require('express');
const router = express.Router();
const AttendeeController = require('../controllers/attendee.controller');
я
router.get('/:eventId/attendees', AttendeeController.getByEvent);

router.post('/:eventId/attendees', AttendeeController.create);

module.exports = router;

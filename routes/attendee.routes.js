const express = require('express');
const router = express.Router();
const attendeeController = require('../controllers/attendee.controller');

router.get('/', attendeeController.listAttendees);
router.post('/', attendeeController.addAttendee);
router.put('/:id', attendeeController.updateAttendee);
router.delete('/:id', attendeeController.deleteAttendee);

module.exports = router;

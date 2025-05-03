# Event Planner

## How to run

1. Install dependencies:
```
npm install
```

2. Start the server:
```
node app.js
```

## API Endpoints

### Events
- `GET /events` – Get all events
- `POST /events` – Create an event

### Attendees
- `GET /events/:eventId/attendees` – Get attendees for an event
- `POST /events/:eventId/attendees` – Add attendee to an event

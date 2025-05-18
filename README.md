#  Event Planner

A full-stack web application for planning and managing events with attendee registration.

---

##  Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Backend Setup](#backend-setup)  
- [Frontend Setup](#frontend-setup)  
- [API Endpoints](#api-endpoints) 


---

##  Features
- Create, edit, and delete events  
- Add, edit, and remove attendees  
- Assign attendees to specific events  
- Track attendee status (Yes, No, Maybe)  
- Smooth user interface with modals and instant updates  
- Data persistence using localStorage (frontend)  
- RESTful API (backend)  

---

##  Tech Stack

### Frontend
- React.js  
- React Router  
- React Hot Toast (for notifications)  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  
- Local JSON Storage (for simplicity)  

---

##  Project Structure

event-planner/
├── backend/
│ ├── controllers/
│ ├── daos/
│ ├── app.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
└── README.md


---

##  Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend

   Install dependencies:

npm install

Run the server:

node app.js

The backend will be available at http://localhost:3001.

Frontend Setup

    Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Run the frontend app:

npm start

The app will be available at http://localhost:3000.

API Endpoints
Events
Method	Endpoint	Description
GET	/api/events	Get all events
POST	/api/events	Create event
PUT	/api/events/:id	Update event
DELETE	/api/events/:id	Delete event
Attendees
Method	Endpoint	Description
GET	/api/attendees	Get all attendees
POST	/api/attendees	Create attendee
PUT	/api/attendees/:id	Update attendee
DELETE	/api/attendees/:id	Delete attendee


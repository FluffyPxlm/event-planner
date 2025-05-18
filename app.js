const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Импорт маршрутов
const attendeeRoutes = require('./routes/attendee.routes');
const eventRoutes = require('./routes/event.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Рабочая проверка API
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Роуты API
app.use('/api/attendees', attendeeRoutes);
app.use('/api/events', eventRoutes);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

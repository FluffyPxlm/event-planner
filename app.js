const express = require('express');
const app = express();
const path = require('path');

// Хостинг всех файлов из папки "public"
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Страница создания события
app.get('/create/event', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/create-event.html'));
});

// Страница со всеми участниками
app.get('/view/attendees', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/view-attendees.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

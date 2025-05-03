const eventList = document.getElementById('eventList');
const modalContainer = document.getElementById('modalContainer');
let events = JSON.parse(localStorage.getItem('events')) || [];
let attendees = JSON.parse(localStorage.getItem('attendees')) || [];

// Сохраняем в localStorage
function saveToLocalStorage() {
  localStorage.setItem('events', JSON.stringify(events));
  localStorage.setItem('attendees', JSON.stringify(attendees));
}

// Иконки RSVP
function getRSVPIcon(rsvp) {
  switch (rsvp) {
    case 'yes': return '✅ Attending';
    case 'no': return '❌ Not Attending';
    case 'maybe': return '❓ Maybe';
    default: return '–';
  }
}

// SPA-навигация
document.getElementById('goCreateEvent')?.addEventListener('click', () => {
  history.pushState(null, '', '/create/event');
  showAddEventModal();
});
document.getElementById('goViewEvents')?.addEventListener('click', () => {
  history.pushState(null, '', '/view/events');
  showAllEventsModal();
});
document.getElementById('goCreateAttendee')?.addEventListener('click', () => {
  if (events.length > 0) {
    history.pushState(null, '', '/create/attendee');
    showSelectEventForAttendeeModal();
  } else {
    alert('Please create an event first.');
  }
});
document.getElementById('goViewAttendees')?.addEventListener('click', () => {
  history.pushState(null, '', '/view/attendees');
  showAllAttendeesModal();
});

// Обработка URL при открытии страницы или истории
function handleRoute() {
  const path = window.location.pathname;
  if (path === '/create/event') showAddEventModal();
  else if (path === '/view/attendees') showAllAttendeesModal();
  else if (path === '/create/attendee' && events.length > 0) showSelectEventForAttendeeModal();
  else if (path === '/view/events') showAllEventsModal();
}

window.addEventListener('popstate', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  handleRoute();
});

// Отрисовка всех событий
function renderEvents() {
  if (!eventList) return;
  eventList.innerHTML = events.length === 0 ? '<p>No events yet.</p>' : '';
  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <strong>${event.title}</strong><br/>
      ${event.date} — ${event.location}<br/>
      ${event.description}<br/>
    `;
    eventList.appendChild(card);
  });
}

// Очистка модального контейнера и возврат URL
function closeModal() {
  modalContainer.innerHTML = '';
  history.pushState(null, '', '/');
}

// Добавление события
function showAddEventModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>Create New Event</h3>
      <form id="addEventForm">
        <input type="text" name="title" placeholder="Title" required />
        <input type="date" name="date" required />
        <input type="text" name="location" placeholder="Location" required />
        <input type="text" name="description" placeholder="Description" required />
        <button type="submit">Add</button>
      </form>
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelector('#addEventForm').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    events.push(data);
    saveToLocalStorage();
    closeModal();
    renderEvents();
  };
  modalContainer.appendChild(modal);
}

// Выбор события для добавления участника
function showSelectEventForAttendeeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>Select Event</h3>
      <ul>
        ${events.map((ev, i) => `
          <li>
            <button class="selectEventBtn" data-index="${i}">
              ${ev.title} (${ev.date})
            </button>
          </li>`).join('')}
      </ul>
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelectorAll('.selectEventBtn').forEach(btn => {
    btn.onclick = () => {
      const ev = events[+btn.dataset.index];
      closeModal();
      showAddAttendeeModal(ev);
    };
  });
  modalContainer.appendChild(modal);
}

// Добавление участника
function showAddAttendeeModal(event) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>Add Attendee to ${event.title}</h3>
      <form id="addAttendeeForm">
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <select name="rsvp" required>
          <option value="yes">✅ Yes</option>
          <option value="no">❌ No</option>
          <option value="maybe">❓ Maybe</option>
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelector('#addAttendeeForm').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.event = event.title;
    attendees.push(data);
    saveToLocalStorage();
    closeModal();
  };
  modalContainer.appendChild(modal);
}

// Все участники
function showAllAttendeesModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  const grouped = attendees.reduce((acc, a, i) => {
    if (!acc[a.event]) acc[a.event] = [];
    acc[a.event].push({ ...a, index: i });
    return acc;
  }, {});
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>All Attendees</h3>
      ${Object.entries(grouped).map(([title, list]) => `
        <h4>${title}</h4>
        <ul>
          ${list.map(a => `
            <li>
              ${a.name} (${a.email}) — ${getRSVPIcon(a.rsvp)}
              <button class="editAttendeeBtn" data-index="${a.index}">✏️</button>
              <button class="delAttendeeBtn" data-index="${a.index}">🗑️</button>
            </li>
          `).join('')}
        </ul>
      `).join('') || '<p>No attendees registered.</p>'}
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelectorAll('.editAttendeeBtn').forEach(btn => {
    btn.onclick = () => showEditAttendeeModal(+btn.dataset.index);
  });
  modal.querySelectorAll('.delAttendeeBtn').forEach(btn => {
    btn.onclick = () => {
      const i = +btn.dataset.index;
      attendees.splice(i, 1);
      saveToLocalStorage();
      closeModal();
      showAllAttendeesModal();
    };
  });
  modalContainer.appendChild(modal);
}

// Редактирование участника
function showEditAttendeeModal(index) {
  const a = attendees[index];
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>Edit Attendee</h3>
      <form id="editAttendeeForm">
        <input name="name" value="${a.name}" required />
        <input name="email" value="${a.email}" required type="email" />
        <select name="rsvp" required>
          <option value="yes" ${a.rsvp === 'yes' ? 'selected' : ''}>✅ Yes</option>
          <option value="no" ${a.rsvp === 'no' ? 'selected' : ''}>❌ No</option>
          <option value="maybe" ${a.rsvp === 'maybe' ? 'selected' : ''}>❓ Maybe</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelector('#editAttendeeForm').onsubmit = e => {
    e.preventDefault();
    Object.assign(attendees[index], Object.fromEntries(new FormData(e.target).entries()));
    saveToLocalStorage();
    closeModal();
    showAllAttendeesModal();
  };
  modalContainer.appendChild(modal);
}

// Все события
function showAllEventsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>All Events</h3>
      ${events.length === 0 ? '<p>No events available.</p>' : `
        <ul>
          ${events.map((ev, i) => `
            <li>
              <strong>${ev.title}</strong><br/>
              📅 ${ev.date} — 📍 ${ev.location}<br/>
              📝 ${ev.description}<br/>
              <button class="editEventBtn" data-index="${i}">✏️ Edit</button>
              <button class="delEventBtn" data-index="${i}">🗑️ Delete</button>
            </li>
          `).join('')}
        </ul>
      `}
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelectorAll('.editEventBtn').forEach(btn => {
    btn.onclick = () => showEditEventModal(events[+btn.dataset.index]);
  });
  modal.querySelectorAll('.delEventBtn').forEach(btn => {
    btn.onclick = () => {
      const ev = events[+btn.dataset.index];
      events = events.filter(e => e !== ev);
      attendees = attendees.filter(a => a.event !== ev.title);
      saveToLocalStorage();
      closeModal();
      showAllEventsModal();
    };
  });
  modalContainer.appendChild(modal);
}

// Редактирование события
function showEditEventModal(event) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="modal-close">×</span>
      <h3>Edit Event: ${event.title}</h3>
      <form id="editEventForm">
        <input name="title" value="${event.title}" required />
        <input name="date" value="${event.date}" type="date" required />
        <input name="location" value="${event.location}" required />
        <input name="description" value="${event.description}" required />
        <button type="submit">Save</button>
      </form>
    </div>
  `;
  modal.querySelector('.modal-close').onclick = closeModal;
  modal.querySelector('#editEventForm').onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    Object.assign(event, data);
    saveToLocalStorage();
    closeModal();
    showAllEventsModal();
  };
  modalContainer.appendChild(modal);
}

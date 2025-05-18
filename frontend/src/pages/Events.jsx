import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Events() {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editData, setEditData] = useState({ name: '', date: '', description: '' });

  useEffect(() => {
    fetchEvents();
    fetchAttendees();
  }, []);

  const fetchEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
      .catch(() => toast.error('Failed to load events.'));
  };

  const fetchAttendees = () => {
    fetch('/api/attendees')
      .then(res => res.json())
      .then(setAttendees)
      .catch(() => toast.error('Failed to load attendees.'));
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setEditData({
      name: event.name,
      date: event.date,
      description: event.description || ''
    });
    setModalVisible(true);
  };

  const openInfoModal = (event) => {
    fetchAttendees(); // обновим перед показом
    setSelectedEvent(event);
    setInfoModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
    setEditData({ name: '', date: '', description: '' });
  };

  const closeInfoModal = () => {
    setInfoModalVisible(false);
    setSelectedEvent(null);
  };

  const saveEdit = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(editData.date);

    if (selectedDate < today) {
      toast.error('You cannot set the event date in the past.');
      return;
    }

    const duplicate = events.find(
      (e) =>
        e.id !== selectedEvent.id &&
        e.name.toLowerCase() === editData.name.toLowerCase() &&
        e.date === editData.date
    );

    if (duplicate) {
      toast.error('An event with the same name and date already exists.');
      return;
    }

    fetch(`/api/events/${selectedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.error); });
        return res.json();
      })
      .then(() => {
        toast.success('Event updated!');
        fetchEvents();
        closeModal();
      })
      .catch(err => toast.error(err.message || 'Failed to update event.'));
  };

  const deleteEvent = (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    fetch(`/api/events/${id}`, { method: 'DELETE' })
      .then(() => {
        toast.success('Event deleted!');
        fetchEvents();
        fetchAttendees();
      })
      .catch(() => toast.error('Failed to delete event.'));
  };

  const getEventAttendees = (eventId) => {
    return attendees.filter(att => Number(att.eventId) === Number(eventId));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">📅 Events List</h1>
      {events.length === 0 ? (
        <p className="text-gray-500 text-center mt-8 animate-fadeIn">
          No events available.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="bg-white shadow p-4 rounded-md border animate-fadeIn">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-1">Date: {event.date}</p>
              {event.description && (
                <p className="text-gray-500 italic mb-2">"{event.description}"</p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openEditModal(event)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => openInfoModal(event)}
                  className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
                >
                  ℹ️ Info
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Event Name"
              className="border p-2 rounded-md w-full mb-3"
            />
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              className="border p-2 rounded-md w-full mb-3"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description (optional)"
              className="border p-2 rounded-md w-full h-24 resize-none mb-4"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoModalVisible && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Attendees for "{selectedEvent.name}"</h2>
            {getEventAttendees(selectedEvent.id).length === 0 ? (
              <p className="text-gray-500">No attendees for this event.</p>
            ) : (
              <ul className="space-y-2">
                {getEventAttendees(selectedEvent.id).map(attendee => (
                  <li key={attendee.id} className="border-b pb-2">
                    <strong>{attendee.name}</strong> — {attendee.email} ({attendee.status})
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeInfoModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

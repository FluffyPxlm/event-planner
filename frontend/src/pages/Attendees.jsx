import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', eventId: '', status: 'maybe' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendeesRes, eventsRes] = await Promise.all([
        fetch('/api/attendees'),
        fetch('/api/events'),
      ]);
      const attendeesData = await attendeesRes.json();
      const eventsData = await eventsRes.json();
      setAttendees(attendeesData);
      setEvents(eventsData);
    } catch {
      toast.error('Failed to load data.');
    }
  };

  const openModal = (attendee) => {
    setSelectedAttendee(attendee);
    setEditData({
      name: attendee.name,
      email: attendee.email,
      eventId: attendee.eventId,
      status: attendee.status || 'maybe',
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAttendee(null);
    setEditData({ name: '', email: '', eventId: '', status: 'maybe' });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/attendees/${selectedAttendee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error('Failed to update attendee.');

      toast.success('Attendee updated!');
      await fetchData();
      closeModal();
    } catch {
      toast.error('Failed to update attendee.');
    }
  };

  const deleteAttendee = async (id) => {
    if (!confirm('Are you sure you want to delete this attendee?')) return;

    try {
      await fetch(`/api/attendees/${id}`, { method: 'DELETE' });
      toast.success('Attendee deleted!');
      await fetchData();
    } catch {
      toast.error('Failed to delete attendee.');
    }
  };

  const getEventName = (eventId) => {
    const event = events.find(e => e.id === parseInt(eventId));
    return event ? event.name : 'Not assigned';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'yes': return '✔️';
      case 'no': return '❌';
      case 'maybe':
      default: return '❓';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">👥 Attendees List</h1>
      {attendees.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No attendees available.</p>
      ) : (
        <ul className="space-y-4">
          {attendees.map(attendee => (
            <li key={attendee.id} className="bg-white shadow p-4 rounded-md border">
              <p><strong>Name:</strong> {attendee.name}</p>
              <p><strong>Email:</strong> {attendee.email}</p>
              <p><strong>Event:</strong> {getEventName(attendee.eventId)}</p>
              <p><strong>Status:</strong> {getStatusIcon(attendee.status)} {attendee.status}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openModal(attendee)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAttendee(attendee.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">Edit Attendee</h2>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Name"
              className="border p-2 rounded-md w-full mb-3"
            />
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              placeholder="Email"
              className="border p-2 rounded-md w-full mb-3"
            />
            <select
              value={editData.eventId}
              onChange={(e) => setEditData({ ...editData, eventId: e.target.value })}
              className="border p-2 rounded-md w-full mb-3"
            >
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} — {event.date}
                </option>
              ))}
            </select>
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="border p-2 rounded-md w-full mb-4"
            >
              <option value="yes">✔️ Yes</option>
              <option value="no">❌ No</option>
              <option value="maybe">❓ Maybe</option>
            </select>
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
    </div>
  );
}

export default Attendees;

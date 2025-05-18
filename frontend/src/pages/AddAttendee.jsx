import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function AddAttendee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventId, setEventId] = useState('');
  const [status, setStatus] = useState('maybe');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error('Failed to load events.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !eventId) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, eventId, status }),
      });

      if (!res.ok) throw new Error('Failed to add attendee.');

      toast.success('Attendee added!');
      // Очистка формы после успешного добавления
      setName('');
      setEmail('');
      setEventId('');
      setStatus('maybe');
    } catch {
      toast.error('Failed to add attendee.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">➕ Add Attendee</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 rounded-md w-full"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 rounded-md w-full"
          required
        />
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="border p-2 rounded-md w-full"
          required
        >
          <option value="">Select Event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} — {event.date}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="yes">✔️ Yes</option>
          <option value="no">❌ No</option>
          <option value="maybe">❓ Maybe</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full"
        >
          Add Attendee
        </button>
      </form>
    </div>
  );
}

export default AddAttendee;

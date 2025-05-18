import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, attendeesRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/attendees'),
      ]);
      const eventsData = await eventsRes.json();
      const attendeesData = await attendeesRes.json();
      setEvents(eventsData);
      setAttendees(attendeesData);
    } catch {
      toast.error('Failed to load data.');
    }
  };

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">🎉 Welcome to Event Planner!</h1>
      <p className="text-gray-600 mb-8">
        Plan your events and manage attendees easily and efficiently.
      </p>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => navigate('/events/add')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          ➕ Add Event
        </button>
        <button
          onClick={() => navigate('/attendees/add')}
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition flex items-center gap-2"
        >
          👥 Add Attendee
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        <div className="bg-white p-4 shadow rounded-md border">
          <p className="text-lg font-semibold">📅 Total Events</p>
          <p className="text-2xl font-bold text-indigo-600">{events.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-md border">
          <p className="text-lg font-semibold">👥 Total Attendees</p>
          <p className="text-2xl font-bold text-green-500">{attendees.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">📌 Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No upcoming events.</p>
      ) : (
        events.map(event => (
          <div
            key={event.id}
            className="bg-white p-4 shadow rounded-md border max-w-md mx-auto mb-4"
          >
            <p className="font-semibold">{event.name}</p>
            <p className="text-gray-600">{event.date}</p>
            <p className="italic text-gray-500">{event.description}</p>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => navigate('/events')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                View
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;

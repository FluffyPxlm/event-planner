import { useState } from 'react';
import toast from 'react-hot-toast';

function AddEvent() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);

    if (selectedDate < today) {
      toast.error('You cannot create an event in the past.');
      return;
    }

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date, description }),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error); });
        }
        return res.json();
      })
      .then(() => {
        toast.success('Event added successfully!');
        setName('');
        setDate('');
        setDescription('');
      })
      .catch(err => toast.error(err.message || 'Failed to add event.'));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">➕ Add Event</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-md h-24 resize-none"
        ></textarea>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
        >
          Add Event
        </button>
      </form>
    </div>
  );
}

export default AddEvent;

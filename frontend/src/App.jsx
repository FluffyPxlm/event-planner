import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import Attendees from './pages/Attendees';
import AddAttendee from './pages/AddAttendee';
import { Toaster } from 'react-hot-toast';

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="bg-indigo-600 p-4 text-white flex flex-wrap gap-4 justify-center shadow-md">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded-md transition"
      >
        🏠 Home
      </button>
      <button
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded-md transition"
      >
        📅 Events
      </button>
      <button
        onClick={() => navigate('/attendees')}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-700 px-4 py-2 rounded-md transition"
      >
        👥 Attendees
      </button>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Toaster position="top-right" />
      <div className="p-8 max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/attendees" element={<Attendees />} />
          <Route path="/attendees/add" element={<AddAttendee />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

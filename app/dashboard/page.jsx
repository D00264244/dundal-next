"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  AcademicCapIcon,
  UserCircleIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Sample event data
const sampleEvents = [
  {
    id: 1,
    name: "Code Club Workshop",
    date: "2024-03-15",
    startTime: "14:00",
    endTime: "16:00",
    details: "Learn the basics of web development",
    tickets: [
      { name: "General Admission", spaces: 50 },
      { name: "VIP", spaces: 10 }
    ]
  },
  {
    id: 2,
    name: "Hackathon 2024",
    date: "2024-04-20",
    startTime: "09:00",
    endTime: "18:00",
    details: "24-hour coding competition",
    tickets: [
      { name: "Student", spaces: 100 },
      { name: "Professional", spaces: 50 }
    ]
  }
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    details: "",
    tickets: [{ name: "", spaces: 0 }]
  });

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        alert('Failed to fetch events');
      }
    };

    fetchEvents();
  }, []);

  const handleAddTicket = () => {
    setNewEvent(prev => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", spaces: 0 }]
    }));
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...newEvent.tickets];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setNewEvent(prev => ({ ...prev, tickets: updatedTickets }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      setIsModalOpen(false);
      setNewEvent({
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        details: "",
        tickets: [{ name: "", spaces: 0 }]
      });
    } catch (error) {
      console.error('Error creating event:', error);
      // You might want to show an error message to the user here
      alert(error.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter(event => event.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  if (status === "loading") {
    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view the dashboard</h2>
            <p className="text-gray-600">You need to be logged in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        {/* Header with User Info */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your Code Club dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Event</span>
            </button>
            <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="h-10 w-10 rounded-full bg-lime-100 flex items-center justify-center ring-2 ring-lime-200">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name} 
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-lime-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>
        </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tickets</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{event.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{event.startTime} - {event.endTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{event.details}</div>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-lime-100 text-lime-800 hover:bg-lime-200 transition-colors duration-200"
                        >
                          <InformationCircleIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {event.tickets.map((ticket, index) => (
                          <div key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800 mr-2">
                            {ticket.name} ({ticket.spaces} spaces)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-lime-100 text-lime-800 hover:bg-lime-200 transition-colors duration-200"
                        >
                          <InformationCircleIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                      {selectedEvent.date}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedEvent.details}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Tickets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEvent.tickets.map((ticket, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-gray-900">{ticket.name}</span>
                          <span className="text-sm text-gray-500">{ticket.spaces} spaces</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-lime-500 h-2 rounded-full" 
                              style={{ width: `${(ticket.spaces / 100) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Event Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                  <p className="mt-1 text-sm text-gray-500">Fill in the details below to create your event</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                        <input
                          type="text"
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                          placeholder="Enter event name"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                            <input
                              type="time"
                              value={newEvent.startTime}
                              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                            <input
                              type="time"
                              value={newEvent.endTime}
                              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newEvent.details}
                        onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                        rows={6}
                        maxLength={7500}
                        placeholder="Enter event description (max 7500 characters)"
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500 text-right">
                        {newEvent.details.length}/7500 characters
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
                      <button
                        type="button"
                        onClick={handleAddTicket}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-lime-100 text-lime-800 hover:bg-lime-200 transition-colors duration-200"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Ticket
                      </button>
                    </div>
                    <div className="space-y-4">
                      {newEvent.tickets.map((ticket, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Name</label>
                              <input
                                type="text"
                                placeholder="e.g., General Admission"
                                value={ticket.name}
                                onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Spaces</label>
                              <input
                                type="number"
                                placeholder="e.g., 100"
                                value={ticket.spaces}
                                onChange={(e) => handleTicketChange(index, 'spaces', parseInt(e.target.value))}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 transition-colors duration-200"
                                required
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-lime-500 rounded-lg hover:bg-lime-600 transition-colors duration-200 transform hover:scale-105"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

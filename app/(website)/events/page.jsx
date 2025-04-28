"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  CalendarIcon,
  ClockIcon,
  TicketIcon,
  InformationCircleIcon,
  XMarkIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

export default function EventsPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

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

  const handlePurchaseTicket = async (ticket) => {
    if (!session) {
      alert('Please sign in to purchase tickets');
      return;
    }

    setSelectedTicket(ticket);
    setIsPurchasing(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          quantity: quantity
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to purchase ticket');
      }

      // Refresh events to update available spaces
      const eventsResponse = await fetch('/api/events');
      if (eventsResponse.ok) {
        const updatedEvents = await eventsResponse.json();
        setEvents(updatedEvents);
      }

      alert('Ticket purchased successfully!');
      setIsPurchasing(false);
      setSelectedTicket(null);
      setQuantity(1);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert(error.message || 'Failed to purchase ticket');
    }
  };

  const calculateRemainingSpaces = (ticket) => {
    const purchasedQuantity = ticket.purchases?.reduce((sum, purchase) => sum + purchase.quantity, 0) || 0;
    return ticket.spaces - purchasedQuantity;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-xl text-gray-600">Join us for exciting events and workshops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-5 w-5 mr-2 text-lime-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2 text-lime-500" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.tickets.map((ticket, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800"
                      >
                        <TicketIcon className="h-4 w-4 mr-1" />
                        {ticket.name} ({calculateRemainingSpaces(ticket)} remaining)
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-600 line-clamp-2">{event.details}</p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-lime-500 hover:bg-lime-600 transition-colors duration-200"
                  >
                    <InformationCircleIcon className="h-5 w-5 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
                      {new Date(selectedEvent.date).toLocaleDateString()}
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
                    {selectedEvent.tickets.map((ticket) => {
                      const remainingSpaces = calculateRemainingSpaces(ticket);
                      return (
                        <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-900">{ticket.name}</span>
                            <span className="text-sm text-gray-500">{remainingSpaces} spaces remaining</span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-lime-500 h-2 rounded-full" 
                                style={{ width: `${(remainingSpaces / ticket.spaces) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <button
                            onClick={() => handlePurchaseTicket(ticket)}
                            disabled={remainingSpaces === 0}
                            className={`mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white ${
                              remainingSpaces === 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-lime-500 hover:bg-lime-600'
                            } transition-colors duration-200`}
                          >
                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                            Purchase Ticket
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Modal */}
        {isPurchasing && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Purchase Tickets</h2>
                <button
                  onClick={() => {
                    setIsPurchasing(false);
                    setSelectedTicket(null);
                    setQuantity(1);
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedTicket.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {calculateRemainingSpaces(selectedTicket)} spaces remaining
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={calculateRemainingSpaces(selectedTicket)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), calculateRemainingSpaces(selectedTicket)))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500"
                  />
                </div>

                <button
                  onClick={handleConfirmPurchase}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-lime-500 hover:bg-lime-600 transition-colors duration-200"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
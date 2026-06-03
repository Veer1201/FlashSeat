import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchEvent, fetchEventSeats } from '../data/events'
import SeatMap from '../components/SeatMap'
import CheckoutPanel from '../components/CheckoutPanel'
import { io } from 'socket.io-client'

function EventDetail({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedTier, setSelectedTier] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchEvent(id), fetchEventSeats(id)])
      .then(([eventData, seatsData]) => {
        setEvent(eventData)
        setSeats(seatsData)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL)

    socket.on('seat:held', ({ seatId, status }) => {
        setSeats(prev => prev.map(s => 
            s.seat_id === seatId ? { ...s, status } : s
        ))
    })

    socket.on('seat:sold', ({ seatId, status }) => {
        setSeats(prev => prev.map(s => 
            s.seat_id === seatId ? { ...s, status } : s
        ))
    })

    socket.on('seat:available', ({ seatId, status }) => {
        setSeats(prev => prev.map(s => 
            s.seat_id === seatId ? { ...s, status } : s
        ))
    })

    return () => socket.disconnect()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <Link to="/" className="text-orange-500 hover:underline">Back to events</Link>
        </div>
      </div>
    )
  }

  // Build tiers from real seat data
  const tiers = [...new Map(seats.map(s => [
    s.row_number,
    { name: `Row ${s.row_number}`, price: parseFloat(s.price), row: s.row_number }
  ])).values()]

  const handleTierSelect = (tier) => {
    setSelectedTier(tier)
    setSelectedSeat(null)
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <Link to="/" className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors">←</Link>
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors">↗</button>
          <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors">♡</button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <span className="text-orange-400 text-sm font-semibold">{event.category}</span>
          <h1 className="text-white text-4xl font-black mt-2">{event.name}</h1>
          <div className="flex items-center gap-6 mt-3 text-gray-300 text-sm">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-10">
        <div className="col-span-2">
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-xl mb-3">About This Event</h2>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Tier Selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-xl mb-4">Choose Your Section</h2>
            <div className="space-y-3">
              {tiers.map(tier => (
                <button
                  key={tier.row}
                  onClick={() => handleTierSelect(tier)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedTier?.row === tier.row
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{tier.name}</div>
                  </div>
                  <div className={`text-lg font-black ${selectedTier?.row === tier.row ? 'text-orange-600' : 'text-gray-900'}`}>
                    ${tier.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Map */}
          {selectedTier && (
            <SeatMap
              tier={selectedTier}
              seats={seats.filter(s => s.row_number === selectedTier.row)}
              onSeatSelect={setSelectedSeat}
              selectedSeat={selectedSeat}
            />
          )}

          {/* Venue */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
            <h2 className="font-bold text-gray-900 text-xl mb-1">Venue Location</h2>
            <p className="text-gray-500 text-sm mb-4">{event.venue} · {event.city}</p>
            <div className="w-full h-52 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div className="text-sm">{event.venue}, {event.city}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout */}
        <div className="col-span-1">
          <div className="sticky top-24">
            <CheckoutPanel
              event={event}
              selectedTier={selectedTier}
              selectedSeat={selectedSeat}
              token={token}
              onNeedAuth={() => navigate('/signin')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
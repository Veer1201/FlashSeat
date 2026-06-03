import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { EVENTS } from '../data/events'
import SeatMap from '../components/SeatMap'
import CheckoutPanel from '../components/CheckoutPanel'
import EventCard from '../components/EventCard'

function EventDetail({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = EVENTS.find(e => e.id === parseInt(id))
  const [selectedTier, setSelectedTier] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)

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

  const similarEvents = EVENTS.filter(e => e.category === event.category && e.id !== event.id).slice(0, 3)

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

        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
        >
          ←
        </Link>

        {/* Share / Fav */}
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors">
            ↗
          </button>
          <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-colors">
            ♡
          </button>
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <span className="text-orange-400 text-sm font-semibold">{event.category}</span>
          <h1 className="text-white text-4xl font-black mt-2">{event.name}</h1>
          <div className="flex items-center gap-6 mt-3 text-gray-300 text-sm">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {event.date}
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
        {/* Left Column */}
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
              {event.tiers.map(tier => (
                <button
                  key={tier.name}
                  onClick={() => handleTierSelect(tier)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedTier?.name === tier.name
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{tier.name}</div>
                    <div className="text-gray-500 text-sm">Row {tier.row}</div>
                  </div>
                  <div className={`text-lg font-black ${
                    selectedTier?.name === tier.name ? 'text-orange-600' : 'text-gray-900'
                  }`}>
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
              onSeatSelect={setSelectedSeat}
              selectedSeat={selectedSeat}
            />
          )}

          {/* Venue Location */}
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

        {/* Right Column - Checkout */}
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

      {/* Similar Events */}
      {similarEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-3 gap-8">
            {similarEvents.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default EventDetail

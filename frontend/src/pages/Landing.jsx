import { useState, useEffect, useRef } from 'react'
import { fetchEvents, CATEGORIES } from '../data/events'
import HeroCarousel from '../components/HeroCarousel'
import EventCard from '../components/EventCard'

function Landing() {
  const [events, setEvents] = useState([])
  const [activeCategory, setActiveCategory] = useState('All Events')
  const [loading, setLoading] = useState(true)
  const trendingRef = useRef(null)

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'All Events'
    ? events
    : events.filter(e => e.category === activeCategory)

  const scrollTrending = (direction) => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({ left: direction * 340, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <HeroCarousel events={events} />

      {/* Trending Now */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Trending Now</h2>
              <p className="text-gray-500 text-sm">The hottest events everyone's talking about</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scrollTrending(-1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">‹</button>
            <button onClick={() => scrollTrending(1)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">›</button>
          </div>
        </div>
        <div ref={trendingRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {events.slice(0, 6).map(event => (
            <EventCard key={event.id} event={event} size="trending" />
          ))}
        </div>
      </section>

      {/* Browse Events */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Browse Events</h2>
          <p className="text-gray-500 mb-8">Find your next unforgettable experience</p>
          <div className="flex gap-3 mb-10 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-purple-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">No events found in this category.</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Landing
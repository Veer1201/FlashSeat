import { Link } from 'react-router-dom'

function EventCard({ event, size = 'normal' }) {
  const minPrice = event.min_price ? parseFloat(event.min_price) : '?'

  if (size === 'trending') {
    return (
      <Link
        to={`/event/${event.id}`}
        className="relative flex-shrink-0 w-80 h-56 rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(249,115,22,0.25)]"
      >
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          From ${minPrice}
        </div>
        <div className="absolute bottom-0 left-0 p-4">
          <div className="text-white/70 text-xs flex items-center gap-1 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {event.date}
          </div>
          <h3 className="text-white font-bold text-sm leading-tight">{event.name}</h3>
          <p className="text-white/60 text-xs mt-1">{event.venue}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/event/${event.id}`} className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(249,115,22,0.2)] rounded-2xl">
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-3">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
          {event.category}
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
          From <span className="text-orange-600">${minPrice}</span>
        </div>
      </div>
      <div className="px-1">
        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{event.name}</h3>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {event.date} · {event.time}
        </p>
        <p className="text-gray-400 text-sm flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {event.venue}
        </p>
      </div>
    </Link>
  )
}

export default EventCard

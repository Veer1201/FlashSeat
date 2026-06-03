import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HeroCarousel({ events }) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState('') // 'exit' or 'enter'
  const featured = events.filter(e => e.featured)

  const triggerTransition = (next) => {
    if (transitioning) return
    setTransitioning(true)
    setSlideDirection('exit')

    setTimeout(() => {
      setCurrent(next)
      setSlideDirection('enter')
    }, 600)

    setTimeout(() => {
      setSlideDirection('')
      setTransitioning(false)
    }, 1200)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % featured.length
      triggerTransition(next)
    }, 6000)
    return () => clearInterval(timer)
  }, [current, featured.length, transitioning])

  const handleNav = (direction) => {
    const next = (current + direction + featured.length) % featured.length
    triggerTransition(next)
  }

  const event = featured[current]
  if (!event) return null

  let contentClass = 'transition-all duration-[600ms] ease-in-out'
  let imageClass = 'transition-all duration-[600ms] ease-in-out'

  if (slideDirection === 'exit') {
    contentClass += ' opacity-0 translate-y-8'
    imageClass += ' opacity-0'
  } else if (slideDirection === 'enter') {
    contentClass += ' opacity-100 translate-y-0 animate-[slideUp_0.6s_ease-out]'
    imageClass += ' opacity-100 animate-[fadeIn_0.6s_ease-out]'
  } else {
    contentClass += ' opacity-100 translate-y-0'
    imageClass += ' opacity-100'
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${imageClass}`}
        style={{ backgroundImage: `url(${event.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* White flash during transition */}
      <div className={`absolute inset-0 bg-white transition-opacity duration-300 pointer-events-none ${
        slideDirection === 'exit' ? 'opacity-30' : 'opacity-0'
      }`} />

      {/* Content */}
      <div className={`relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16 ${contentClass}`}>
        <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 w-fit">
          {event.category}
        </span>
        <h1 className="text-white text-5xl font-black mb-4 max-w-2xl leading-tight">
          {event.name}
        </h1>
        <div className="flex items-center gap-6 text-gray-300 text-sm mb-6">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {event.date}
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {event.venue}, {event.city}
          </span>
        </div>
        <Link
          to={`/event/${event.id}`}
          className="inline-block bg-orange-500 text-white font-bold px-8 py-3 rounded-full w-fit transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(249,115,22,0.5)]"
        >
          Book Now — From ${Math.min(...event.tiers.map(t => t.price))}
        </Link>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
        <button
          onClick={() => handleNav(-1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => triggerTransition(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-orange-500' : 'w-3 bg-white/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => handleNav(1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default HeroCarousel

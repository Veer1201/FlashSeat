import { Link } from 'react-router-dom'

function Navbar({ token, onSignOut }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" fill="#f97316" stroke="#f97316" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <span className="font-black text-xl tracking-tight">
            <span className="text-gray-900">Flash</span><span className="text-orange-500">Seat</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search events, artists, venues..."
            className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <button
              onClick={onSignOut}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/signin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

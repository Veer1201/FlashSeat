import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      {/* Newsletter */}
      <div className="mx-6 -translate-y-12">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-10 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <h3 className="text-white text-2xl font-black mb-2">Never Miss a Beat</h3>
          <p className="text-white/80 text-sm mb-6">Get early access to tickets, exclusive presales, and curated event recommendations.</p>
          <div className="flex justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-white/20 text-white placeholder-white/60 outline-none text-sm border border-white/30 focus:border-white/60"
            />
            <button className="px-6 py-3 rounded-full bg-white text-orange-600 font-semibold text-sm hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" fill="#f97316" stroke="#f97316" strokeWidth="1" strokeLinejoin="round"/></svg>
            <span className="text-white font-black text-lg">Flash<span className="text-orange-500">Seat</span></span>
          </div>
          <p className="text-sm leading-relaxed">Your gateway to unforgettable live experiences. Discover, book, and enjoy.</p>
        </div>
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Discover</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Concerts</Link>
            <Link to="/" className="hover:text-white transition-colors">Sports</Link>
            <Link to="/" className="hover:text-white transition-colors">Theater</Link>
            <Link to="/" className="hover:text-white transition-colors">Festivals</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Company</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/" className="hover:text-white transition-colors">Careers</Link>
            <Link to="/" className="hover:text-white transition-colors">Press</Link>
            <Link to="/" className="hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Support</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Help Center</Link>
            <Link to="/" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © 2026 FlashSeat. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

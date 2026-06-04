function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex">
        {/* Left Panel */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 via-pink-500/70 to-purple-700/85" />
          <div className="relative z-10 p-12 flex flex-col justify-between w-full">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
              <span className="text-white font-black text-xl tracking-tight">FlashSeat</span>
            </div>
            <div>
              <h1 className="text-white text-5xl font-black leading-[1.1] mb-5">
                Your next<br />unforgettable<br />night starts here.
              </h1>
              <p className="text-white/70 text-lg max-w-sm leading-relaxed">
                Discover and book tickets to the hottest concerts, games, shows, and festivals — all in one place.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4">
                <div className="text-white text-2xl font-black">10K+</div>
                <div className="text-white/60 text-xs">Events</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4">
                <div className="text-white text-2xl font-black">2M+</div>
                <div className="text-white/60 text-xs">Tickets Sold</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4">
                <div className="text-white text-2xl font-black">50+</div>
                <div className="text-white/60 text-xs">Cities</div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    )
  }
  
  export default AuthLayout
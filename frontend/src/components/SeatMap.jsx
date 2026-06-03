function SeatMap({ tier, onSeatSelect, selectedSeat }) {
  if (!tier) return null

  // Generate demo seats for the selected tier
  const seatCount = 8
  const seats = Array.from({ length: seatCount }, (_, i) => ({
    id: `${tier.row}${i + 1}`,
    row: tier.row,
    number: i + 1,
    price: tier.price,
    status: [2, 5].includes(i + 1) ? 'taken' : 'available', // seats 2 and 5 are taken
  }))

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-4">
      <h3 className="text-gray-900 font-bold text-lg mb-1">Select Your Seat — {tier.name}</h3>
      <p className="text-gray-500 text-sm mb-6">Row {tier.row} · ${tier.price} per seat</p>

      {/* Stage */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-r from-transparent via-orange-100 to-transparent border border-orange-200 rounded-xl py-2 text-center">
          <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">Stage</span>
        </div>
      </div>

      {/* Seats */}
      <div className="flex justify-center gap-3 flex-wrap">
        {seats.map(seat => (
          <button
            key={seat.id}
            disabled={seat.status === 'taken'}
            onClick={() => onSeatSelect(seat)}
            className={`
              w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 border
              ${seat.status === 'taken'
                ? 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
                : selectedSeat?.id === seat.id
                ? 'bg-orange-500 border-orange-400 text-white scale-110 shadow-lg shadow-orange-500/30'
                : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:scale-105'
              }
            `}
          >
            {seat.number}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-white border border-gray-300" />
          Available
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-orange-500" />
          Selected
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded bg-gray-200" />
          Taken
        </div>
      </div>
    </div>
  )
}

export default SeatMap

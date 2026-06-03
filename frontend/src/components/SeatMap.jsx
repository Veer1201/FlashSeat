function SeatMap({ tier, seats, onSeatSelect, selectedSeat }) {
  if (!tier || !seats) return null

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-4">
      <h3 className="text-gray-900 font-bold text-lg mb-1">Select Your Seat — {tier.name}</h3>
      <p className="text-gray-500 text-sm mb-6">Row {tier.row} · ${tier.price} per seat</p>

      <div className="relative mb-8">
        <div className="bg-gradient-to-r from-transparent via-orange-100 to-transparent border border-orange-200 rounded-xl py-2 text-center">
          <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">Stage</span>
        </div>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {seats.map(seat => (
          <button
            key={seat.seat_id}
            disabled={seat.status === 'sold' || seat.status === 'held'}
            onClick={() => onSeatSelect({
              id: seat.seat_id,
              row: seat.row_number,
              number: seat.seat_number,
              price: parseFloat(seat.price)
            })}
            className={`
              w-12 h-12 rounded-xl text-sm font-bold transition-all duration-200 border
              ${seat.status === 'sold' || seat.status === 'held'
                ? 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
                : selectedSeat?.id === seat.seat_id
                ? 'bg-orange-500 border-orange-400 text-white scale-110 shadow-lg shadow-orange-500/30'
                : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:scale-105'
              }
            `}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>

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
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchEvent, fetchEventSeats } from '../data/events'
import SeatMap from '../components/SeatMap'
import CheckoutPanel from '../components/CheckoutPanel'
import EventCard from '../components/EventCard'

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

  const similarEvents = [] // no longer using mock data for similar events

  const handleTierSelect = (tier) => {
    setSelectedTier(tier)
    setSelectedSeat(null)
  }
}
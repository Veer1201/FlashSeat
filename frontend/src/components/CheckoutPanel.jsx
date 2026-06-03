import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const cardStyle = {
  style: {
    base: {
      color: '#1f2937',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#9ca3af' }
    },
    invalid: { color: '#ef4444' }
  }
}

function PaymentForm({ selectedSeat, token, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const intentRes = await fetch(`${import.meta.env.VITE_API_URL}/seats/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ seatId: selectedSeat.id })
      })
      const intentData = await intentRes.json()
      if (!intentRes.ok) throw new Error(intentData.message || 'Failed to create payment')

      const clientSecret = intentData.data.clientSecret

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      })

      if (stripeError) throw new Error(stripeError.message)

      const payRes = await fetch(`${import.meta.env.VITE_API_URL}/seats/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          paymentIntentId: paymentIntent.id
        })
      })
      const payData = await payRes.json()
      if (!payRes.ok) throw new Error(payData.message || 'Payment confirmation failed')

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mb-4">
        <CardElement options={{ hidePostalCode: true, style: cardStyle.style }} />
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={loading || !stripe}
        className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold hover:from-orange-600 hover:to-purple-600 transition-all disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${selectedSeat.price}`}
      </button>
    </div>
  )
}

function CheckoutPanel({ event, selectedTier, selectedSeat, token, onNeedAuth }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [held, setHeld] = useState(false)
  const [paid, setPaid] = useState(false)

  if (!selectedSeat) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline"><path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" fill="#f97316" stroke="#f97316" strokeWidth="1" strokeLinejoin="round"/></svg>
          <h3 className="font-bold text-gray-900 text-lg">Select Tickets</h3>
        </div>
        <p className="text-gray-400 text-sm text-center py-8">Choose a tier, then select your seat</p>
      </div>
    )
  }

  const handleBook = async () => {
    if (!token) {
      onNeedAuth()
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/seats/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ seatId: selectedSeat.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Booking failed')
      setHeld(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline"><path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" fill="#f97316" stroke="#f97316" strokeWidth="1" strokeLinejoin="round"/></svg>
        <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Event</span>
          <span className="text-gray-900 font-medium text-right max-w-[180px] truncate">{event.name}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Section</span>
          <span className="text-gray-900 font-medium">{selectedTier.name}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Seat</span>
          <span className="text-gray-900 font-medium">Row {selectedSeat.row} · #{selectedSeat.number}</span>
        </div>
      </div>

      <div className="flex justify-between items-center font-bold text-lg border-t border-gray-200 pt-4 mt-4">
        <span className="text-gray-900">Total</span>
        <span className="text-orange-600">${selectedSeat.price}</span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mt-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      {paid ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mt-4 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V9z"/><path d="M9 6v12"/><circle cx="15" cy="12" r="2"/></svg>
          <div className="font-bold">Payment Successful!</div>
          <div className="text-sm mt-1">Your ticket is confirmed.</div>
        </div>
      ) : held ? (
        <div className="mt-4">
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm text-center mb-4">
            Seat held for 5 minutes — complete payment
          </div>
          <Elements stripe={stripePromise}>
            <PaymentForm
              selectedSeat={selectedSeat}
              token={token}
              onSuccess={() => setPaid(true)}
            />
          </Elements>
        </div>
      ) : (
        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold mt-6 hover:from-orange-600 hover:to-purple-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Holding seat...' : token ? 'Book Now' : 'Sign In to Book'}
        </button>
      )}

      <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 100% buyer guarantee · Secure checkout
      </p>
    </div>
  )
}

export default CheckoutPanel

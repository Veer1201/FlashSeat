export const CATEGORIES = ["All Events", "Concerts", "Sports", "Theater", "Comedy", "Festivals"];

export const fetchEvents = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/events`)
  const data = await res.json()
  return data.data
}

export const fetchEvent = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`)
  const data = await res.json()
  return data.data
}

export const fetchEventSeats = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}/seats`)
  const data = await res.json()
  return data.data
}
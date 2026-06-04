# FlashSeat 🎟️

A full-stack seat booking and payment application with real-time seat availability, built as a structured learning project to develop backend and full-stack engineering skills from scratch.

**Live Demo:** [flash-seat.vercel.app](https://flash-seat.vercel.app) · **API:** [flashseat.onrender.com](https://flashseat.onrender.com)

---

## What It Does

FlashSeat lets users browse events, select seats, and complete purchases via Stripe — with real-time seat map updates across all connected clients. When a user holds a seat, every other browser viewing that event sees it update instantly, no refresh required.

---

## Tech Stack

**Backend**
- Node.js / Express
- PostgreSQL (Supabase) — persistent seat and user data
- Redis (Upstash) — 5-minute seat holds with TTL-based expiry
- Socket.io — real-time seat status broadcasting
- Stripe — payment intent creation and verification
- Resend — booking confirmation emails
- JWT + bcrypt — authentication and password hashing
- Winston — structured logging
- Helmet, express-rate-limit, express-validator — security hardening

**Frontend**
- React / Vite
- Tailwind CSS + Shadcn/ui

**Infrastructure**
- Render (backend deployment)
- Vercel (frontend deployment)
- Docker + Docker Compose (containerization)

---

## Engineering Highlights

**Race condition prevention**
Seat holds use atomic SQL `UPDATE ... WHERE status = 'available'` — only one user can hold a seat at a time, regardless of concurrent requests. No application-level locking needed.

**Redis TTL-based holds with zombie seat recovery**
Seats are held in Redis with a 5-minute expiry. Keyspace notifications trigger a subscriber that automatically releases expired holds back to `available` in PostgreSQL. A zombie seat detection layer also handles cases where PostgreSQL shows `held` but Redis has no corresponding key.

**Real-time seat updates**
Socket.io maintains persistent WebSocket connections with all connected clients. On every seat transition (held → sold → available), the server broadcasts the change so every user's seat map updates live.

**Payment integrity**
The Stripe payment intent is verified server-side before any seat is marked `sold`. The Redis hold is only deleted after confirmed payment — preventing seats from being released on failed payments.

---

## Architecture

```
Client (React) ←──── Socket.io ────→ Express Server
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                          PostgreSQL     Redis        Stripe
                          (Supabase)   (Upstash)
```

---

## Running Locally

### Prerequisites
- Node.js 20+
- Docker + Docker Compose (optional)

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=your_supabase_connection_string
REDIS_URL=your_upstash_redis_url
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
RESEND_API_KEY=your_resend_api_key
PORT=3000
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Without Docker

```bash
# Backend
cd backend
npm install
node index.js

# Frontend
cd frontend
npm install
npm run dev
```

### With Docker

```bash
docker compose up --build
```

Backend available at `http://localhost:3001` · Frontend at `http://localhost:80`

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user/register` | ❌ | Register a new user |
| POST | `/user/login` | ❌ | Login and receive JWT |
| GET | `/events` | ❌ | List all events |
| GET | `/events/:id` | ❌ | Get event details |
| GET | `/events/:id/seats` | ❌ | Get seat map for event |
| POST | `/seats/hold` | ✅ | Hold a seat for 5 minutes |
| POST | `/seats/payment-intent` | ✅ | Create Stripe payment intent |
| POST | `/seats/pay` | ✅ | Confirm payment and mark seat sold |

---

## Project Structure

```
FlashSeat/
├── backend/
│   ├── config/          # DB, Redis, Socket.io setup
│   ├── controllers/     # Route logic (seats, users)
│   ├── middleware/      # Auth, error handling, validation
│   ├── routes/          # Express route definitions
│   ├── utils/           # Response helpers, AppError, email
│   ├── Dockerfile
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/  # SeatMap, CheckoutPanel, Navbar, etc.
│   │   ├── pages/       # EventDetail, Landing, SignIn, SignUp
│   │   └── data/        # API fetch helpers
│   └── Dockerfile
└── docker-compose.yml
```

---

## License

MIT
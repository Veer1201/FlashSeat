// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const { bookSeat, payForSeat, createPaymentIntent } = require('../controllers/seatController');
const {middleware} = require('../middleware/authMiddleware')

// Define the endpoints
router.post('/book', middleware, bookSeat);
router.post('/create-payment-intent', middleware, createPaymentIntent)
router.post('/pay', middleware, payForSeat);

module.exports = router;
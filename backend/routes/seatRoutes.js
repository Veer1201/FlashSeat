// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const { bookSeat, payForSeat } = require('../controllers/seatController');
const {middleware} = require('../middleware/authMiddleware')

// Define the endpoints
router.post('/book', middleware, bookSeat);
router.post('/pay', middleware, payForSeat);

module.exports = router;
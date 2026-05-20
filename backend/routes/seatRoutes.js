// routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const { bookSeat, payForSeat } = require('../controllers/seatController');

// Define the endpoints
router.post('/book', bookSeat);
router.post('/pay', payForSeat);

module.exports = router;
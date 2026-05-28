const express = require('express')
const router = express.Router()
const {loginLimiter} = require('../middleware/rateLimiter')

const {registerUser, userLogin} = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login', loginLimiter, userLogin)

module.exports = router
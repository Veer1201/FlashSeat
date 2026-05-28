const express = require('express')
const router = express.Router()
const {loginLimiter} = require('../middleware/rateLimiter')
const {registerValidator, loginValidator, validate} = require('../middleware/validators')

const {registerUser, userLogin} = require('../controllers/userController')

router.post('/register', registerValidator, validate, registerUser)
router.post('/login', loginLimiter, loginValidator, validate, userLogin)

module.exports = router
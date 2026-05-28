const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 900000,
    max: 10,
    message: "Please try again in 15 minutes"
})

module.exports = {loginLimiter}
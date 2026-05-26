const jwt = require('jsonwebtoken')
const { sendError } = require('../utils/responseHelper')

const middleware =  (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return sendError(res, 401, "Unauthorized")
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send("Token expired, please sign in again.")    
        }
        return sendError(res, 401, "No valid credentials")
       
    }
}

module.exports = {middleware}
const jwt = require('jsonwebtoken')

const middleware =  (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).send("Unauthorized")
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send("Token expired, please sign in again.")    
        }
        res.status(401).send("No valid credentials")
       
    }
}

module.exports = {middleware}
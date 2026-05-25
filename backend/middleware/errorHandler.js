const { sendError } = require("../utils/responseHelper")

const errorHandler = (err, req, res, next) => {
    console.error(err.stack)
    if (process.env.NODE_ENV === 'development') {
        sendError(res, 500, err.message)
    }
    else { 
        const msg = "Internal Server error"
        sendError(res, 500, msg)
    }
    
    
}

module.exports = errorHandler
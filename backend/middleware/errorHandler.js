const errorHandler = (err, req, res, next) => {
    console.error(err.stack)

    const statusCode = err.statusCode || 500
    const status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({ status, message: err.message, stack: err.stack })
    }
    else { 
        res.status(statusCode).json({ status, message: err.message })
    }
}

module.exports = errorHandler
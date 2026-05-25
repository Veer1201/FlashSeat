const sendSuccess = (res, statusCode, data) => {
    res.status(statusCode).json({
        status: "success",
        data: data
    })
}

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: "error",
        message: message
    })
}

module.exports = {sendSuccess, sendError}
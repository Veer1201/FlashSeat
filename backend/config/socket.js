const { Server } = require('socket.io')

let io = null

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'https://flash-seat.vercel.app']
        }
    })
    return io
}

const getIO = () => {
    if (!io) throw new Error('Socket.io not initialized')
    return io
}

module.exports = { initSocket, getIO }
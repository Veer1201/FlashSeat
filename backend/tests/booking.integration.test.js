require('dotenv').config()

const pool = require('../config/db')
const {client, subscriber, connectRedis} = require('../config/redis')
const {bookSeat, payForSeat} = require('../controllers/seatController')
const { registerUser } = require('../controllers/userController')

describe('Booking Integration tests',  () => {

    let userId = null

    beforeAll(async() => {
        await connectRedis()
        await pool.query("DELETE FROM users WHERE email = 'testuser@test.com'")
        await pool.query("UPDATE seats SET status = 'available', user_id = NULL WHERE seat_id = 6")
    })

    afterAll(async() => {
        await pool.query("DELETE FROM users WHERE email = 'testuser@test.com'")
        await pool.query("UPDATE seats SET status = 'available', user_id = NULL WHERE seat_id = 6")

        await client.del('seat_hold:6')
        await pool.end()
        await client.quit()
        await subscriber.quit()
    })
    
    test('registerUser()', async() => {
        const req = {
            body: {email: 'testuser@test.com', phone_number: '1023456789', password: 'Test1234@'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()
        await registerUser(req, res, next)

        const user = await pool.query("SELECT * FROM users WHERE email = 'testuser@test.com'")

        expect(user.rows.length).toBe(1)
        userId = user.rows[0].id
    })

    test('bookSeat', async() => {
        const req = {
            body: {seatId: 6},
            user: {id: userId}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()
        await bookSeat(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            data: {
                seatId: 6,
                status: 'held'
            }
        })

        const seatStatus = await pool.query("SELECT status FROM seats WHERE seat_id = 6")
        expect(seatStatus.rows[0].status).toBe('held')
    })

    test('payForSeat', async() => {
        const req = {
            body: {seatId: 6},
            user: {id: userId}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()
        await payForSeat(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            data: {User: userId, Seat: 6, status: "sold", message: "Payment Successful! Ticket is yours"}
        })

        const seatStatus = await pool.query("SELECT status FROM seats WHERE seat_id = 6")
        expect(seatStatus.rows[0].status).toBe('sold')
    })
})
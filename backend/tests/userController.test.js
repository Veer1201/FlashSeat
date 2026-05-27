const {registerUser, userLogin} = require('../controllers/userController')
const pool = require('../config/db')
const bcrypt = require('bcrypt')
process.env.JWT_SECRET = 'testsecret'

jest.mock('../config/db', () => ({
    query: jest.fn()
}))

jest.mock('bcrypt')

describe('registerUser', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should return 400 if fields are missing', async() => {
        const req = {
            body: {email: ' ', phone_number: '1234567890', password: 'pass123'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const next = jest.fn()
        await registerUser(req, res, next)

        // Assert
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "All fields are required!"
        })
    })

    test('should return 409 if account already exists', async () => {
        const req = {
            body: {email: 'hello@gmail.com', phone_number: '7567047671', password: 'Hello1234@'}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const next = jest.fn()
        pool.query.mockResolvedValue({rows: [{id: 1, email: 'hello@gmail.com'}]})
        await registerUser(req, res, next)

        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Account already exists. Please log in."
        })
    })

    test('should return 201 if it is a new account', async() => {
        const req = {
            body: {email: 'hello@gmail.com', phone_number: '7567047671', password: 'Hello1234@'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()
        pool.query.mockResolvedValueOnce({rows: []})
        pool.query.mockResolvedValueOnce({rows: [{id: 1, email: 'hello@gmail.com'}]})

        bcrypt.hash = jest.fn().mockResolvedValue('fakehash')

        await registerUser(req, res, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            data: {
                id: 1,
                userEmail: "hello@gmail.com"
            }

    })})

    test('should return 500 if there is an unexpected error', async() => {
        const req = {
            body: {email: 'hello@gmail.com', phone_number: '7567047671', password: 'Hello1234@'}
        } 

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        pool.query.mockRejectedValueOnce(new Error('DB connection failed'))

        await registerUser(req, res, next)

        expect(next).toHaveBeenCalled()
    })
})


describe('userLogin', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should return 400 if any fields are missing', async() => {

        const req = {
            body: {email: ' ', password: 'Hello1234@'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()
        await userLogin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "All fields are required!"
        })
    })

    test('should return 401 if account does not exists', async() => {
        const req = {
            body: {email: 'hello@gmail.com', password: 'Hello1234@'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()
        pool.query.mockResolvedValueOnce({rows: []})

        await userLogin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Invalid email or password'
        })
    })

    test('should return 401 if invalid password', async() => {
        const req = {
            body: {email: 'hello@gmail.com', password: 'Hello1234@'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        pool.query.mockResolvedValueOnce({rows: [{id: 1, pass_hash: 'fakehash'}]})
        bcrypt.compare = jest.fn().mockResolvedValue(false)

        await userLogin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Invalid email or password'
        })
    })

    test('should return 200 if login is successfull', async() => {
        const req = {
            body: {email: 'hello@gmail.com', password: 'Hello1234@'}
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        pool.query.mockResolvedValueOnce({rows: [{id: 1, pass_hash: 'fakehash'}]})
        bcrypt.compare = jest.fn().mockResolvedValueOnce(true)

        await userLogin(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({token: expect.any(String)})
            })
        )
    })

    test('should return 500 if any unexpected error', async() => {
        const req = {
            body: {email: 'hello@gmail.com', password: 'Hello1234@'}
        } 

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const next = jest.fn()

        pool.query.mockRejectedValueOnce(new Error('DB connection failed'))

        await userLogin(req, res, next)

        expect(next).toHaveBeenCalled()
    })
})
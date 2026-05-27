const pool = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendError, sendSuccess } = require('../utils/responseHelper')

const saltRounds = 10

// User Registration
const registerUser = async (req, res, next) => {
    try {
        const {email, phone_number, password} = req.body;

        if (!email?.trim() || !phone_number?.trim() || !password?.trim()) {
            return sendError(res, 400, "All fields are required!")
        }
        // Scenario: User Already Exists
        const duplicateUser = await pool.query("SELECT * FROM flashseat_data WHERE email = $1", [email])

        if (duplicateUser.rows.length > 0) {
            return sendError(res, 409, "Account already exists. Please log in.")
        }

        // Generating a password hash
        const password_hash =  await bcrypt.hash(password, saltRounds)
        const newEntry = await pool.query(
            "INSERT INTO flashseat_data (email, phone, pass_hash) VALUES ($1, $2, $3) RETURNING *",
            [email, phone_number, password_hash]
        );

        const {id, email: userEmail} = newEntry.rows[0]
        sendSuccess(res, 201, {id, userEmail})

    } catch (err) {
        next(err)
    }
}

// User Login
const userLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body

        if (!email?.trim() || !password?.trim()) {
            return sendError(res, 400, "All fields are required!")
        }

        //Scenario: Does User Exists ?
        const User = await pool.query("SELECT * FROM flashseat_data WHERE email = $1", [email])
        if (User.rows.length === 0) {
            return sendError(res, 401, "Invalid email or password")
        }
        else {
            const hash = User.rows[0].pass_hash
            const id = User.rows[0].id
            const compare = await bcrypt.compare(password, hash)
            
            if (!compare) {
                return sendError(res, 401, "Invalid email or password")
            }
            const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '2h'})
            sendSuccess(res, 200, {message: "Login Successfull!", token})
        }

    }
    catch(err){
        next(err)
    }
}

module.exports = {registerUser, userLogin}
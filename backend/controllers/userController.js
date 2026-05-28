const pool = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendSuccess } = require('../utils/responseHelper')
const { AppError } = require('../utils/AppError')

const saltRounds = 10

// User Registration
const registerUser = async (req, res, next) => {
    try {
        const {email, phone_number, password} = req.body;

        if (!email?.trim() || !phone_number?.trim() || !password?.trim()) {
            return next(new AppError("All fields are required!", 400))
        }
        // Scenario: User Already Exists
        const duplicateUser = await pool.query("SELECT * FROM flashseat_data WHERE email = $1", [email])

        if (duplicateUser.rows.length > 0) {
            return next(new AppError("Account already exists. Please log in.", 409))
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
            return next(new AppError("All fields are required!", 400))
        }

        //Scenario: Does User Exists ?
        const User = await pool.query("SELECT * FROM flashseat_data WHERE email = $1", [email])
        if (User.rows.length === 0) {
            return next(new AppError("Invalid email or password", 401))
        }
        else {
            const hash = User.rows[0].pass_hash
            const id = User.rows[0].id
            const compare = await bcrypt.compare(password, hash)
            
            if (!compare) {
                return next(new AppError("Invalid email or password", 401))
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
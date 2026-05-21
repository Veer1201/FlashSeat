const pool = require('../config/db')
const bcrypt = require('bcrypt')

const saltRounds = 10

// User Registration
const registerUser = async (req, res) => {
    try {
        const {email, phone_number, password} = req.body;

        if (!email?.trim() || !phone_number?.trim() || !password?.trim()) {
            return res.status(400).send("All fields are required!")
        }
        // Scenario: User Already Exists
        const duplicateUser = await pool.query("SELECT * FROM flashseat_data WHERE email = $1", [email])

        if (duplicateUser.rows.length > 0) {
            return res.status(409).send("Account already exists. Please log in")
        }

        // Generating a password hash
        const password_hash =  await bcrypt.hash(password, saltRounds)
        const newEntry = await pool.query(
            "INSERT INTO flashseat_data (email, phone, pass_hash) VALUES ($1, $2, $3) RETURNING *",
            [email, phone_number, password_hash]
        );

        res.json(newEntry.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
}

// User Login
const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body

        //Scenario: User Already Exists
        const User = await pool.query("SELECT * FROM flashseat_data WHERE email = $1", [email])
        if (User.rows.length === 0) {
            return res.status(401).send("Invalid email or password")
        }
        else {
            const hash = User.rows[0].pass_hash
            const compare = await bcrypt.compare(password, hash)
            
            if (!compare) {
                return res.status(401).send("Invalid email or password")
            }
            res.status(200).send("login successful!")
        }

    }
    catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {registerUser, userLogin}
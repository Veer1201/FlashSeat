const {body} = require('express-validator')
const {validationResult} = require('express-validator')
const { AppError } = require('../utils/AppError')

const registerValidator = [
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('phone_number').isMobilePhone().withMessage("Please enter a valid phone number"),
    body('password')
    .isLength({min: 8})
    .withMessage("Password must be 8 characters long")
    .isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
    .withMessage("Password must contain atleast 1 uppercase, 1 lowercase, 1 number, and 1 symbol.")
]

const loginValidator = [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email"),
    body('password').trim().notEmpty().withMessage("Password is required")
]

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array()[0].msg, 400))
    }
    next()
}

module.exports = {registerValidator, loginValidator, validate}
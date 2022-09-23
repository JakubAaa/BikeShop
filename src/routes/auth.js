const express = require('express')
const {body} = require('express-validator')

const router = express.Router()

const authController = require('../controllers/auth')
const User = require('../models/user')

router.get('/login', authController.getLogin)

router.post(
    '/login',
    [
        body('email', 'Please enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Please enter a password with at least 5 characters')
            .isString()
            .isLength({min: 5})
            .trim()
    ],
    authController.postLogin
)

router.get('/signup', authController.getSignup)

router.post(
    '/signup',
    [
        body('email', 'Please enter a valid email')
            .isEmail()
            .normalizeEmail()
            .custom((value, {req}) => {
                return User
                    .findOne({email: value})
                    .then(user => {
                        if (user) {
                            return Promise.reject('This user already exist!')
                        }
                    })
            }),
        body('password', 'Please enter a valid password with at least 5 characters')
            .isString()
            .isLength({min: 5})
            .trim(),
        body('confirmPassword', 'Passwords have to match!')
            .trim()
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!')
                }
                return true
            })
    ],
    authController.postSignup)

router.post('/logout', authController.postLogout)

module.exports = router
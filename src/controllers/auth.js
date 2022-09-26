const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const {validationResult} = require('express-validator')
const crypto = require('crypto')

const User = require('../models/user')
const {throwError404} = require("../utils/error-handler");
const HOUR = 60 * 60 * 1000

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}))

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: null,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    })
}

exports.postLogin = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    email: email,
                    password: password
                }
            })
    }

    const user = await User.findOne({email})
    if (!user) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email.',
                validationErrors: [],
                oldInput: {
                    email: email,
                    password: password
                }
            })
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
        return res.status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid password.',
                validationErrors: [],
                oldInput: {
                    email: email,
                    password: password
                }
            })
    }

    req.session.isLoggedIn = true;
    req.session.isAdmin = user.isAdmin;
    req.session.user = user;
    return req.session.save(() => {
        if (user.isAdmin) {
            res.redirect('/admin/products')
        } else {
            res.status(201)
                .redirect('/')
        }
    })
}

exports.getSignup = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: null,
        validationResult: [],
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.postSignup = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password,
                    confirmPassword: req.body.confirmPassword
                },
                validationErrors: errors.array()
            })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
        email: email,
        password: hashedPassword,
        isAdmin: false,
        cart: {items: []}
    })
    await user.save()
    res.status(201)
        .redirect('/login')

    await transporter.sendMail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Signup successfully!',
        html: `
            <h1>Hello!</h1>
            <h2>You successfully signup!</h2>
            `
    })
}

exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

exports.getReset = (req, res) => {
    res.status(200)
        .render('auth/reset', {
            path: '/path',
            pageTitle: 'Reset Password',
            errorMessage: null
        })
}

exports.postReset = async (req, res) => {
    const email = req.body.email
    const token = crypto.randomBytes(32)
        .toString('hex')

    const user = await User.findOne({email})
    if (!user) {
        return res.status(422).render('auth/reset', {
            path: '/path',
            pageTitle: 'Reset Password',
            errorMessage: 'No account with that email found!'
        })
    }

    user.resetToken = token
    user.resetTokenExpiration = Date.now() + HOUR
    await user.save()

    res.status(200)
        .redirect('/login')

    await transporter.sendMail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Reset password',
        html: `
            <p>You requested password reset.</p>
            <p>Click this <a href="${process.env.URL_DOMAIN}${process.env.PORT}/reset/${token}">link</a> to set new password.</p>
            `
    })
}

exports.getNewPassword = async (req, res) => {
    const token = req.params.token
    const user = await User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    if (!user)
        return throwError404(res)

    res.status(200)
        .render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: null,
            userId: user._id.toString(),
            passwordToken: token,
            validationErrors: [],
            hasError: false
        })
}

exports.postNewPassword = async (req, res) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New password',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    password: newPassword
                },
                validationErrors: errors.array(),
                userId: userId.toString(),
                passwordToken: passwordToken,
                hasError: true,
                password: newPassword
            })
    }

    const user = await User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now()}
    })
    if (!user)
        return throwError404(res)

    user.password = await bcrypt.hash(newPassword, 12)
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()
    res.status(201)
        .redirect('/login')
}
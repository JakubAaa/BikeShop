const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const {validationResult} = require('express-validator')

const User = require('../models/user')
const HOUR = 60*60*1000

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}))

exports.getLogin = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
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

    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
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

    const user = await User.findOne({email: email})
    if(!user){
        return res.status(422).render('auth/login', {
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
    if(!passwordsMatch){
        return res.status(422).render('auth/login', {
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
        if(user.isAdmin){
            res.redirect('/admin/products')
        }
        else{
            res.redirect('/')
        }
    })
}

exports.getSignup = (req, res) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }

    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
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

    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
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
        cart: []
    })
    await user.save()

    transporter.sendMail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Signup successfully!',
        html: `
            <h1>Hello!</h1>
            <h2>You successfully signup!</h2>
            `
    })
    return res.redirect('/login')
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
require('dotenv')
    .config()

const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const errorRouter = require('./routes/error')

const {setLocalVariables} = require("./utils/locals")
const {setSession} = require("./utils/session")
const {checkIsLogIn} = require("./utils/isLogIn")
const {renderError500} = require("./utils/error-handler");
const {setMulter} = require("./utils/multer");

const app = express()
const csrfProtection = csrf();

app.set('views', 'src/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))
app.use(setMulter)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(setSession)

app.use(csrfProtection)
app.use(flash())

app.use(checkIsLogIn)

app.use(setLocalVariables)

app.use('/admin', adminRouter)
app.use(authRouter)
app.use(errorRouter)

app.use((error, req, res, next) =>
    renderError500(req, res))


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 3000)
    })
    .catch(err => console.log(err))
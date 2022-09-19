const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')
require('dotenv')
    .config()

const adminRouter = require('./routes/admin')

const {setLocalVariables} = require("./util/locals")
const {setSession} = require("./util/session")

const app = express()

app.set('views', 'src/views')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(setSession)

app.use(csrf())
app.use(flash())

app.use(setLocalVariables)

app.use('/admin', adminRouter)

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 3000)
    })
    .catch(err => console.log(err))
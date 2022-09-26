const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)

const store = new MongoDbStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions'
})

exports.setSession = session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
})

const User = require('../models/user')
const {throwError404} = require("./error-handler");

exports.checkIsLogIn = async (req, res, next) => {
    if(!req.session.user)
        next()

    const user = await User.findById(req.session.user._id)
    if(!user)
        return throwError404()

    req.user = user
    next()
}
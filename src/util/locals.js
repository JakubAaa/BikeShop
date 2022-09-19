exports.setLocalVariables = (req, res, next) => {
    //res.locals.isAuthenticated = req.session.isLoggedIn;
    //res.locals.isAdmin = req.session.isAdmin;
    res.locals.isAuthenticated = true;
    res.locals.isAdmin = true;
    res.locals.csrfToken = req.csrfToken();
    next();
}
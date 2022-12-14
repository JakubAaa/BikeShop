exports.throwError404 = res =>
    res.status(404)
        .redirect('/404')

exports.throwError403 = res =>
    res.status(403)
        .redirect('/403')

exports.renderError500 = (req, res) => {
    return res.status(500).render('error/500', {
        pageTitle: '500 Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
}


exports.get404 = (req, res) => {
    res.status(404).render('error/404',{
        pageTitle: '404 Not Found',
        path: '/404'
    })
}

exports.get403 = (req, res) => {
    res.status(403).render('error/403',{
        pageTitle: '403 Forbidden',
        path: '/403'
    })
}
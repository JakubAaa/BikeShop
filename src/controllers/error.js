exports.get404 = (req, res) =>{
    res.status(404).render('error/404',{
        pageTitle: '404 Not Found',
        path: '/404'
    });
}

exports.get500 = (req, res) =>{
    res.status(500).render('error/500', {
        pageTitle: '500 Error',
        path: '/500'
    });
};

exports.render500 = (error, req, res) => {
    console.log(error)
    res.status(500).render('error/500', {
        pageTitle: '500 Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
}
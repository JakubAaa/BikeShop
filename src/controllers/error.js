exports.get404 = (req, res) =>{
    res.status(404).render('error/404',{
        pageTitle: '404 Not Found',
        path: '/404'
    });
}
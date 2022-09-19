exports.throwError404 = res =>
    res.status(404)
        .redirect('/404')

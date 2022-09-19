const Product = require('../models/product')

exports.getProducts = async (req, res) => {
    const page = +req.query.page || 1
    const products = await Product.find()
    const productsNumber = await Product.find().countDocuments()
    const productsOnPage = await Product.find().skip((page - 1) * process.env.PRODUCTS_PER_PAGE_ADMIN)
        .limit(process.env.PRODUCTS_PER_PAGE_ADMIN)
    res.render('admin/products', {
        pageTitle: 'Products',
        path: '/admin/products',
        productsList: productsOnPage,
        currentPage: page,
        hasNextPage: productsNumber > page * process.env.PRODUCTS_PER_PAGE_ADMIN,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productsNumber / process.env.PRODUCTS_PER_PAGE_ADMIN)
    })
}
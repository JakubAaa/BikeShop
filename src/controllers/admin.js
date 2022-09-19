const Product = require('../models/product')
const Order = require('../models/order')
const {throwError404} = require('../utils/error-handler')

exports.getProducts = async (req, res) => {
    const page = +req.query.page || 1
    const productsNumber = await Product.find()
        .countDocuments()
    if (!productsNumber)
        throwError404(res)

    const productsOnPage = await Product.find()
        .skip((page - 1) * process.env.PRODUCTS_PER_PAGE_ADMIN)
        .limit(process.env.PRODUCTS_PER_PAGE_ADMIN)
    if (!productsOnPage)
        throwError404(res)

    res.render('admin/products', {
        pageTitle: 'Products',
        path: '/admin/products',
        products: productsOnPage,
        currentPage: page,
        hasNextPage: productsNumber > page * process.env.PRODUCTS_PER_PAGE_ADMIN,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productsNumber / process.env.PRODUCTS_PER_PAGE_ADMIN)
    })
}

exports.getOrders = async (req, res) => {
    const orders = await Order.find()
    if (!orders)
        throwError404(res);

    res.render('admin/orders', {
        pageTitle: 'Orders',
        path: '/admin/orders',
        orders: orders
    })
}


const Product = require("../models/product");
const {throwError404} = require("../utils/error-handler");
exports.getIndex = (req, res) => {
    res.render('user/index', {
        pageTitle: 'Main',
        path: '/'
    })
}

exports.getProducts = async (req, res) => {
    const page = +req.query.page || 1
    const productsNumber = await Product.find()
        .countDocuments()
    const productsOnPage = await Product.find()
        .skip((page - 1) * process.env.PRODUCTS_PER_PAGE_ADMIN)
        .limit(process.env.PRODUCTS_PER_PAGE_ADMIN)
    if (!productsOnPage)
        return throwError404(res)

    res.status(200)
        .render('user/products', {
            adminView: false,
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

exports.getProductsCategories = (req, res) => {
    res.render('user/categories', {
        pageTitle: 'Categories',
        path: '/products'
    })
}

exports.getProductsByCategory = async (req, res) => {
    const category = req.params.category
    const page = +req.query.page || 1
    const productsNumber = await Product.find({category})
        .countDocuments()
    const productsOnPage = await Product.find({category})
        .skip((page - 1) * process.env.PRODUCTS_PER_PAGE)
        .limit(process.env.PRODUCTS_PER_PAGE)
    if (!productsOnPage)
        return throwError404(res)

    res.status(200)
        .render('user/products', {
            adminView: false,
            pageTitle: 'Products',
            path: '/products',
            products: productsOnPage,
            currentPage: page,
            hasNextPage: productsNumber > page * process.env.PRODUCTS_PER_PAGE,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(productsNumber / process.env.PRODUCTS_PER_PAGE)
        })
}

exports.getProductById = async (req, res) => {
    const prodId = req.params.prodId
    const product = await Product.findById(prodId)
    res.render('user/product-details', {
        pageTitle: 'Details',
        path: '/products',
        product: product
    })
}

exports.getContact = (req, res) => {
    res.render('user/contact', {
        pageTitle: 'Contact',
        path: '/contact'
    })
}
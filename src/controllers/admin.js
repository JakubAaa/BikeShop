const {validationResult} = require('express-validator')

const Product = require('../models/product')
const Order = require('../models/order')
const {throwError404} = require('../utils/error-handler')

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
            adminView: true,
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

    res.status(200)
        .render('admin/orders', {
            pageTitle: 'Orders',
            path: '/admin/orders',
            orders: orders
        })
}

exports.getAddProduct = (req, res) => {
    res.status(200)
        .render('admin/edit-item', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: null,
            hasError: false,
            validationErrors: []
        })
}

exports.postAddProduct = async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    if (!image) {
        return res.status(422)
            .render('admin/edit-item', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: {
                    name: name,
                    price: price,
                    description: description
                },
                errorMessage: 'Attached file is not an image.',
                validationErrors: []
            });
    }

    const imageUrl = image.path;
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422)
            .render('admin/edit-item', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false,
                hasError: true,
                product: {
                    name: name,
                    category: category,
                    price: price,
                    description: description
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
    }

    const product = new Product({
        name: name,
        category: category,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    })
    await product.save()

    return res.status(201)
        .redirect('/admin/product')
}
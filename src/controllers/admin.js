const {validationResult} = require('express-validator')

const Product = require('../models/product')
const Order = require('../models/order')
const {throwError404} = require('../utils/error-handler')
const {deleteFile} = require('../utils/files')

exports.getProducts = async (req, res) => {
    const page = +req.query.page || 1
    const products = await Product.find()
    if (!products)
        return throwError404(res)

    const productsNumber = products.length
    const productsOnPage = await Product.find()
        .skip((page - 1) * process.env.PRODUCTS_PER_PAGE_ADMIN)
        .limit(process.env.PRODUCTS_PER_PAGE_ADMIN)

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
        return throwError404(res)

    res.status(200)
        .render('admin/orders', {
            pageTitle: 'Orders',
            path: '/admin/orders',
            orders: orders
        })
}

exports.getAddProduct = (req, res) => {
    res.status(200)
        .render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: null,
            hasError: false,
            validationErrors: []
        })
}

exports.postAddProduct = async (req, res) => {
    const name = req.body.name
    const category = req.body.category
    const image = req.file
    const price = req.body.price
    const description = req.body.description

    if (!image) {
        return res.status(422)
            .render('admin/edit-product', {
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

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        deleteFile(image.path)
        return res.status(422)
            .render('admin/edit-product', {
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
        imageUrl: image.path,
        price: price,
        description: description,
        userId: req.user
    })
    await product.save()

    res.status(201).redirect('/admin/products')
}

exports.getEditProduct = async (req, res) => {
    const prodId = req.params.prodId
    const product = await Product.findById(prodId)
    if (!product)
        return throwError404(res)

    res.status(200)
        .render('admin/edit-product', {
            pageTitle: 'Edit Item',
            path: '/admin/edit-item',
            editing: true,
            product: product,
            errorMessage: null,
            hasError: false,
            validationErrors: []
        })
}

exports.postEditProduct = async (req, res) => {
    const prodId = req.body.productId
    const updatedName = req.body.name
    const image = req.file
    const updatedPrice = req.body.price
    const updatedDescription = req.body.description

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422)
            .render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                hasError: true,
                product: {
                    name: updatedName,
                    category: req.body.category,
                    price: updatedPrice,
                    description: updatedDescription,
                    _id: prodId
                },
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
    }

    const product = await Product.findById(prodId)
    if(!product)
        return throwError404(res)

    product.name = updatedName
    product.price = updatedPrice
    product.description = updatedDescription
    if (image) {
        deleteFile(product.imageUrl)
        product.imageUrl = image.path
    }
    await product.save()
    res.status(201)
        .redirect('/admin/products')
}

exports.postDeleteProduct = async (req, res) => {
    const prodId = req.body.productId
    const product = await Product.findById(prodId)
    if (!product)
        return throwError404(res)

    deleteFile(product.imageUrl)
    await Product.deleteOne({_id: prodId})
    res.status(200)
        .redirect('/admin/products')
}
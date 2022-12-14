const path = require("path")
const fs = require("fs")
const PDFDocument = require('pdfkit')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Product = require("../models/product")
const Order = require("../models/order")

const {throwError404, throwError403} = require("../utils/error-handler")
const {setPrices} = require('../utils/payments')

exports.getIndex = (req, res) => {
    res.status(200)
        .render('user/index', {
            pageTitle: 'Main',
            path: '/'
        })
}

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
    res.status(200)
        .render('user/categories', {
            pageTitle: 'Categories',
            path: '/products'
        })
}

exports.getProductsByCategory = async (req, res) => {
    const category = req.params.category
    const page = +req.query.page || 1
    const products = await Product.find({category})
    if (!products)
        return throwError404(res)

    const productsNumber = products.length
    const productsOnPage = await Product.find({category})
        .skip((page - 1) * process.env.PRODUCTS_PER_PAGE_ADMIN)
        .limit(process.env.PRODUCTS_PER_PAGE_ADMIN)

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
    if(!product)
        return throwError404(res)

    res.status(200)
        .render('user/product-details', {
            pageTitle: 'Details',
            path: '/products',
            product: product
        })
}

exports.getContact = (req, res) => {
    res.status(200)
        .render('user/contact', {
            pageTitle: 'Contact',
            path: '/contact'
        })
}

exports.getCart = async (req, res) => {
    const user = await req.user.populate('cart.items.productId')
    res.status(200)
        .render('user/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: user.cart.items
        })
}

exports.postAddToCart = async (req, res) => {
    const prodId = req.body.prodId
    const product = await Product.findById(prodId)
    await req.user.addToCart(product)
    res.status(201)
        .redirect('/cart')
}

exports.postDeleteFromCart = async (req, res) => {
    const prodId = req.body.prodId
    await req.user.deleteFromCart(prodId)
    res.status(200)
        .redirect('/cart')
}

exports.getOrders = async (req, res) => {
    const orders = await Order.find({'user.userId': req.user._id})
    res.status(200)
        .render('user/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders
        })
}

exports.getInvoice = async (req, res) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order)
        return throwError404(res)

    if (order.user.userId.toString() !== req.user._id.toString())
        return throwError403(res)

    const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoicePath = path.join('src', 'data', 'invoices', invoiceName)

    const pdfDoc = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
    pdfDoc.pipe(fs.createWriteStream(invoicePath))
    pdfDoc.pipe(res)

    pdfDoc.fontSize(26)
        .text('Invoice', {
            underline: true
        })

    let total = 0
    pdfDoc.text('------------------------------------------')
    order.products.forEach(prod => {
        total += prod.quantity * prod.product.price
        pdfDoc.fontSize(14)
            .text(
                prod.product.name + ' - ' + prod.quantity + ' x ' + prod.product.price + '$ = ' + prod.quantity * prod.product.price + '$')
    })
    pdfDoc.text('--------------------------------')
    pdfDoc.fontSize(20)
        .text('Total: ' + total + '$')

    pdfDoc.end()
}

exports.getCheckout = async (req, res) => {
    const user = await req.user.populate('cart.items.productId')
    let products = user.cart.items
    let total = 0
    products.forEach(p => total += p.quantity * p.productId.price)

    const session = await stripe.checkout.sessions.create({
        line_items: await setPrices(products),
        mode: 'payment',
        success_url: `${process.env.URL_DOMAIN}${process.env.PORT}/checkout/success`,
        cancel_url: `${process.env.URL_DOMAIN}${process.env.PORT}/checkout/cancel`
    })
    res.status(200)
        .render('user/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout',
            products: products,
            totalSum: total,
            sessionId: session.id
        })
}

exports.getCheckoutSuccess = async (req, res) => {
    const user = await req.user.populate('cart.items.productId')
    const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}}
    })
    const order = new Order({
        user: {
            email: user.email,
            userId: user
        },
        products: products
    })
    await order.save()
    await user.clearCart()
    res.status(201)
        .redirect('/orders')
}




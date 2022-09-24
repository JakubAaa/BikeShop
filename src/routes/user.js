const express = require('express')

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/', userController.getIndex)

router.get('/products', userController.getProducts)

router.get('/products/categories', userController.getProductsCategories)

router.get('/products/categories/:category', userController.getProductsByCategory)

router.get('/products/:prodId', userController.getProductById)

router.get('/contact', userController.getContact)

router.use(isAuth)

router.get('/cart', userController.getCart)

router.post('/add-to-cart', userController.postAddToCart)

router.post('/delete-from-cart', userController.postDeleteFromCart)

router.post('/create-order', userController.postCreateOrder)

router.get('/orders', userController.getOrders)

router.get('/orders/:orderId', userController.getInvoice)

module.exports = router;
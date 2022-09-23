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

router.get(isAuth)

module.exports = router;
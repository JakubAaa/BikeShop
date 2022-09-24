const express = require('express')
const {body} = require('express-validator')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')

const router = express.Router()

const productValidation = [
    body('name')
        .isString()
        .isLength({min: 2})
        .trim(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 400})
        .trim()
]

router.use(isAuth, isAdmin)

router.get('/products', adminController.getProducts)

router.get('/orders', adminController.getOrders)

router.get('/add-product', adminController.getAddProduct)

router.post('/add-product', productValidation, adminController.postAddProduct)

module.exports = router
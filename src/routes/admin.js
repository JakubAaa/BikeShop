const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

router.get('/products', adminController.getProducts)

router.get('/orders', adminController.getOrders);

module.exports = router
const express = require('express')

const errorController = require('../controllers/error')

const router = express.Router()

router.get('/404', errorController.get404)

router.get('/500', errorController.get500)

router.use(errorController.get404)

router.use(errorController.render500)

module.exports = router
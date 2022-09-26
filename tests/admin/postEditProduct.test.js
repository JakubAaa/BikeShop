const mongoose = require('mongoose')
const sinon = require('sinon')
require('dotenv')
    .config()

const adminController = require('../../src/controllers/admin')
const Product = require('../../src/models/product')
const {product2, product3, product4, images, names, prices, descriptions} = require("../utils/insertProduct")
const {adminUser} = require('../utils/insertUser')

describe('postEditProduct', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await Product.create(product2)
        await Product.create(product3)
        await Product.create(product4)
    })

    afterAll(async () => {
        await Product.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should edit one product and redirect to admin-products page', async () => {
        const req = {
            file: images.image1,
            body: {
                productId: product2,
                name: names.name3,
                price: prices.price3,
                description: descriptions.description3
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postEditProduct(req, res)
        const product = await Product.findById(product2._id.toString())

        expect(res.status.mock.calls[0][0])
            .toBe(201)

        expect(product.name)
            .toBe(names.name3)
        expect(product.description)
            .toBe(descriptions.description3)
        expect(product.imageUrl)
            .toBe(images.image1.path)
        expect(product.userId)
            .toStrictEqual(adminUser._id)

        expect(res.redirect.mock.calls[0][0])
            .toBe('/admin/products')
    })

    it('should edit one product(unchanged image) and redirect to admin-products page', async () => {
        const req = {
            body: {
                productId: product3,
                name: names.name2,
                price: prices.price2,
                description: descriptions.description2
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postEditProduct(req, res)
        const product = await Product.findById(product3._id.toString())

        expect(res.status.mock.calls[0][0])
            .toBe(201)

        expect(product.imageUrl)
            .toBe(product3.imageUrl)

        expect(res.redirect.mock.calls[0][0])
            .toBe('/admin/products')
    })

    it('should throw 404 error - db failed', async () => {
        sinon.stub(Product, 'findById')
        Product.findById.returns(null)

        const req = {
            file: images.image1,
            body: {
                productId: product4,
                name: names.name2,
                price: prices.price2,
                description: descriptions.description2
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postEditProduct(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)

        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')

        Product.findById.restore()
    })
})
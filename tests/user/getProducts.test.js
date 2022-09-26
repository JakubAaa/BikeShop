const mongoose = require('mongoose')
const sinon = require('sinon')
require('dotenv')
    .config()

const userController = require('../../src/controllers/user')
const Product = require('../../src/models/product')
const {product2, product3, insertManyProducts} = require("../utils/insertProduct")

describe('User getProducts', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertManyProducts([product2, product3])
    })

    afterAll(async () => {
        await Product.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should render page with 2 products', async () => {
        const req = {
            query: {}
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getProducts(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][1].products[0]._id.toString())
            .toStrictEqual(product2._id.toString())
        expect(res.render.mock.calls[0][1].products[1]._id.toString())
            .toStrictEqual(product3._id.toString())

        expect(res.render.mock.calls[0][0])
            .toBe('user/products')
    })

    it('should throw 404 error - db failed', async () => {
        sinon.stub(Product, 'find')
        Product.find.returns(null)

        const req = {
            query: {}
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getProducts(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')

        Product.find.restore()
    })
})
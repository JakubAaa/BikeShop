const mongoose = require('mongoose')
const sinon = require('sinon')
require('dotenv')
    .config()

const adminController = require('../../src/controllers/admin')
const Product = require('../../src/models/product')
const {product2, product3} = require("../utils/insertProduct")

describe('postDeleteProduct', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await Product.create(product2)
    })

    afterAll(async () => {
        await Product.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should delete product from fb', async () => {
        const req = {
            body: {
                productId: product2._id.toString()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postDeleteProduct(req, res)
        const product = await Product.findById(product2._id.toString())

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(product).toBeNull()

        expect(res.redirect.mock.calls[0][0])
            .toBe('/admin/products')
    })

    it('should throw 404 error - db failed', async () => {
        sinon.stub(Product, 'findById')
        Product.findById.returns(null)

        const req = {
            body: {
                productId: product3._id.toString()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postDeleteProduct(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')

        Product.findById.restore()
    })
})
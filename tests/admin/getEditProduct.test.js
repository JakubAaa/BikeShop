const mongoose = require('mongoose')
const sinon = require('sinon')
require('dotenv')
    .config()

const adminController = require('../../src/controllers/admin')
const Product = require('../../src/models/product')
const {product2} = require("../utils/insertProduct")

describe('getEditProduct', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await Product.create(product2)
    })

    afterAll(async () => {
        await Product.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should render edit-product page with product properties', async () => {
        const req = {
            params: {
                prodId: product2._id
            }
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.getEditProduct(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('admin/edit-product')
        expect(res.render.mock.calls[0][1].editing)
            .toBe(true)
        expect(res.render.mock.calls[0][1].product.name)
            .toStrictEqual(product2.name)
    })

    it('should throw 404 error - db failed', async () => {
        sinon.stub(Product, 'findById')
        Product.findById.returns(null)

        const req = {
            params: {
                prodId: product2._id
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.getEditProduct(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')

        Product.findById.restore()
    })
})
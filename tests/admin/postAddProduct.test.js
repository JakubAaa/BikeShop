const mongoose = require('mongoose')
require('dotenv')
    .config()

const adminController = require('../../src/controllers/admin')
const Product = require('../../src/models/product')
const {product1, images} = require("../utils/insertProduct")
const {adminUser} = require('../utils/insertUser')

describe('postAddProduct', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await Product.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should add one new product to db and render admin-products page', async () => {
        const req = {
            file: images.image1,
            body: product1,
            user: adminUser
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postAddProduct(req, res)
        const product = await Product.findOne({name: product1.name, description: product1.description})

        expect(res.status.mock.calls[0][0])
            .toBe(201)

        expect(product.name)
            .toBe(product1.name)
        expect(product.description)
            .toBe(product1.description)
        expect(product.imageUrl)
            .toBe(images.image1.path)
        expect(product.userId)
            .toStrictEqual(adminUser._id)

        expect(res.redirect.mock.calls[0][0])
            .toBe('/admin/products')
    })

    it('should render add-products page with status 422 - no image', async () => {
        const req = {
            body: product1,
            user: adminUser
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.postAddProduct(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(422)

        expect(res.render.mock.calls[0][0])
            .toBe('admin/edit-product')
        expect(res.render.mock.calls[0][1].errorMessage)
            .toBe('Attached file is not an image.')
    })
})
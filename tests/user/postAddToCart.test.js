const mongoose = require('mongoose')
require('dotenv')
    .config()

const userController = require('../../src/controllers/user')
const Product = require('../../src/models/product')
const {product2, insertOneProduct} = require("../utils/insertProduct")
const {user2} = require("../utils/insertUser")

describe('postAddToCart', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertOneProduct(product2)
    })

    afterAll(async () => {
        await Product.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should call addToCart function and render cart page', async () => {
        const req = {
            body: {
                prodId: product2._id.toString()
            },
            user: {
                ...user2,
                addToCart: jest.fn()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.postAddToCart(req, res)

        expect(req.user.addToCart.mock.calls[0][0]._id.toString())
            .toBe(product2._id.toString())

        expect(res.status.mock.calls[0][0])
            .toBe(201)

        expect(res.redirect.mock.calls[0][0])
            .toBe('/cart')
    })
})
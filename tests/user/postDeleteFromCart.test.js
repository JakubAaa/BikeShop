const mongoose = require('mongoose')
require('dotenv')
    .config()

const userController = require('../../src/controllers/user')
const {product2} = require("../utils/insertProduct")
const {user2} = require("../utils/insertUser")

describe('postDeleteFromCart', () => {
    it('should call deleteFromCart function and render cart page', async () => {
        const req = {
            body: {
                prodId: product2._id.toString()
            },
            user: {
                ...user2,
                deleteFromCart: jest.fn()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.postDeleteFromCart(req, res)

        expect(req.user.deleteFromCart.mock.calls[0][0])
            .toBe(product2._id.toString())

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.redirect.mock.calls[0][0])
            .toBe('/cart')
    })
})
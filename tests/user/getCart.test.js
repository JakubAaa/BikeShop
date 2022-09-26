const mongoose = require('mongoose')
require('dotenv')
    .config()

const userController = require('../../src/controllers/user')
const User = require('../../src/models/user')
const {user2} = require("../utils/insertUser")
const {insertOneUser} = require("../utils/insertUser")

describe('getCart', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertOneUser(user2)
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should render cart page', async () => {
        const req = {
            user: {
                ...user2,
                populate: jest.fn().mockReturnThis()
            }
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getCart(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][1].products)
            .toBe(user2.cart.items)

        expect(res.render.mock.calls[0][0])
            .toBe('user/cart')
    })
})
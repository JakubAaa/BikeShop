const mongoose = require('mongoose')
require('dotenv')
    .config()

const userController = require('../../src/controllers/user')
const Order = require('../../src/models/order')
const {user2} = require("../utils/insertUser")
const {order2, insertOneOrder} = require("../utils/insertOrder")

describe('getOrders', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertOneOrder(order2)
    })

    afterAll(async () => {
        await Order.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should get orders and render order page', async () => {
        const req = {
            user: user2
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getOrders(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][1].orders[0]._id)
            .toStrictEqual(order2._id)

        expect(res.render.mock.calls[0][0])
            .toBe('user/orders')
    })
})
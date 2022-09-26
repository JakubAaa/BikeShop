const mongoose = require('mongoose')
const sinon = require('sinon')
require('dotenv')
    .config()

const adminController = require('../../src/controllers/admin')
const Order = require('../../src/models/order')
const {order1, order2, insertManyOrders} = require("../utils/insertOrder")

describe('getOrders', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertManyOrders([order1, order2])
    })

    afterAll(async () => {
        await Order.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should render page with 2 orders', async () => {
        const req = {}
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.getOrders(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('admin/orders')
        expect(res.render.mock.calls[0][1].orders[0]._id)
            .toStrictEqual(order1._id)
        expect(res.render.mock.calls[0][1].orders[1]._id)
            .toStrictEqual(order2._id)
    })

    it('should throw 404 error - db failed', async () => {
        sinon.stub(Order, 'find')
        Order.find.returns(null)

        const req = {}
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.getOrders(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')

        Order.find.restore()
    })
})
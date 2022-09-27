const mongoose = require('mongoose')
require('dotenv')
    .config()

const User = require('../../../src/models/user')
const {adminUser, user1, user2} = require("../../utils/insertUser")
const {product2, product3} = require("../../utils/insertProduct");

describe('getCart', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should add product to empty cart', async () => {
        const user = await new User(adminUser)
        await user.addToCart(product3)

        expect(user.cart.items.length).toBe(adminUser.cart.items.length + 1)
        expect(user.cart.items[0].productId).toBe(product3._id)
        expect(user.cart.items[0].quantity).toBe(1)
    })

    it('should add product to not empty cart', async () => {
        const user = await new User(user1)
        await user.addToCart(product2)

        expect(user.cart.items.length).toBe(user1.cart.items.length + 1)
        expect(user.cart.items[1].productId).toBe(product2._id)
        expect(user.cart.items[1].quantity).toBe(1)
    })

    it('should add the next item of product to cart', async () => {
        const user = await new User(user2)
        await user.addToCart(product3)
        await user.addToCart(product3)

        expect(user.cart.items.length).toBe(user2.cart.items.length + 1)
        expect(user.cart.items[2].productId).toBe(product3._id)
        expect(user.cart.items[2].quantity).toBe(2)
    })
})
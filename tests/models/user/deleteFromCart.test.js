const mongoose = require('mongoose')
require('dotenv')
    .config()

const User = require('../../../src/models/user')
const {adminUser, user1} = require("../../utils/insertUser")
const {product2, product3} = require("../../utils/insertProduct");

describe('deleteFromCart', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should delete product from cart', async () => {
        const user = await new User(adminUser)
        await user.addToCart(product3)
        await user.deleteFromCart(product3._id)

        expect(user.cart.items.length).toBe(adminUser.cart.items.length)
    })

    it('should not delete product from cart - product is not in cart', async () => {
        const user = await new User(user1)
        await user.deleteFromCart(product2._id)

        expect(user.cart.items.length).toBe(user1.cart.items.length)
    })
})
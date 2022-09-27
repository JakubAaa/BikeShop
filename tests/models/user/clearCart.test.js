const mongoose = require('mongoose')
require('dotenv')
    .config()

const User = require('../../../src/models/user')
const {adminUser, user2} = require("../../utils/insertUser")

describe('clearCart', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should clear user cart', async () => {
        const user = await new User(user2)
        await user.clearCart()

        expect(user.cart.items.length).toBe(0)
    })

    it('should not change anything - empty user Cart', async () => {
        const user = await new User(adminUser)
        await user.clearCart()

        expect(user.cart.items.length).toBe(adminUser.cart.items.length)
    })
})
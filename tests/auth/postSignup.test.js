const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
require('dotenv')
    .config()

const authController = require('../../src/controllers/auth')
const {user1} = require("../utils/insertUser")
const User = require("../../src/models/user")

describe('postSignup', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should signup user and redirect to login page', async () => {
        const req = {
            body: {
                email: user1.email,
                password: user1.password
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postSignup(req, res)
        const user = await User.findOne({email: user1.email})

        expect(user)
            .not
            .toBeNull()
        expect(user.password)
            .not
            .toBe(user1.password)
        expect(await bcrypt.compare(user1.password, user.password))
            .toBe(true)
        expect(res.status.mock.calls[0][0])
            .toBe(201)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/login')
    })
})
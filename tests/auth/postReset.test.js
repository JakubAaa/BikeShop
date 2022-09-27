const mongoose = require("mongoose")
const sinon = require("sinon")
const crypto = require("crypto")
require('dotenv')
    .config()

const authController = require('../../src/controllers/auth')
const {insertManyUsers, user1, user2} = require("../utils/insertUser")
const User = require("../../src/models/user");

describe('postReset', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertManyUsers([user1, user2])
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should send email with link to reset to user and redirect to login page', async () => {
        Date.now = jest.fn(() => new Date(Date.UTC(2022, 10, 1)).valueOf())
        sinon.stub(crypto, 'randomBytes')
        crypto.randomBytes.returns('abc')
        const req = {
            body: {
                email: user1.email
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postReset(req, res)
        const user = await User.findOne({email: user1.email})

        expect(user.resetToken).toBe('abc')
        expect(user.resetTokenExpiration.getTime()).toBe(Date.now() + 3600000)
        expect(res.status.mock.calls[0][0])
            .toBe(201)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/login')
        crypto.randomBytes.restore()
    })

    it('should render reset page with status 422 - db failed', async () => {
        sinon.stub(User, 'findOne')
        User.findOne.returns(null)
        const req = {
            body: {
                email: user2.email
            }
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postReset(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(422)
        expect(res.render.mock.calls[0][0])
            .toBe('auth/reset')
        expect(res.render.mock.calls[0][1].errorMessage)
            .toBe('No account with that email found!')
        User.findOne.restore()
    })
})
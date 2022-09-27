const mongoose = require("mongoose")
require('dotenv')
    .config()

const authController = require('../../src/controllers/auth')
const {user3, insertManyUsers, user4} = require("../utils/insertUser")
const User = require("../../src/models/user");

describe('getNewPassword', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertManyUsers([user3,
            user4])
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should check user and render new-password page', async () => {
        const req = {
            params: {
                token: user3.resetToken
            }
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.getNewPassword(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)
        expect(res.render.mock.calls[0][0])
            .toBe('auth/new-password')
    })

    it('should render reset page with status 404 - wrong Token', async () => {
        const req = {
            params: {
                resetToken: 'wrongToken'
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.getNewPassword(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')
    })

    it('should render reset page with status 404 - wrong token expiration', async () => {
        const req = {
            params: {
                resetToken: user4.resetToken
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.getNewPassword(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')
    })
})
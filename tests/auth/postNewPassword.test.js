const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
require('dotenv')
    .config()

const authController = require('../../src/controllers/auth')
const {insertManyUsers, user3, user4, passwords} = require("../utils/insertUser")
const User = require("../../src/models/user");

describe('postNewPassword', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertManyUsers([user3, user4])
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should reset user password and redirect to login page', async () => {
        const req = {
            body: {
                userId: user3._id,
                password: passwords.password1,
                passwordToken: user3.resetToken
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postNewPassword(req, res)
        const user = await User.findOne({email: user3.email})

        expect(await bcrypt.compare(passwords.password1, user.password)).toBe(true)
        expect(user.resetToken).toBeUndefined()
        expect(user.resetTokenExpiration).toBeUndefined()
        expect(res.status.mock.calls[0][0])
            .toBe(201)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/login')
    })

    it('should render new-password page with status 404 - user not found', async () => {
        const req = {
            body: {
                userId: user4._id,
                password: passwords.password1,
                passwordToken: user4.resetToken
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postNewPassword(req, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/404')
    })
})
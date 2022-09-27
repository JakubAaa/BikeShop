const mongoose = require("mongoose")
const sinon = require('sinon')
const bcrypt = require('bcrypt')
require('dotenv')
    .config()

const authController = require('../../src/controllers/auth')
const {insertManyUsers, adminUser, user1, user2, emails} = require("../utils/insertUser")
const User = require("../../src/models/user");

describe('postLogin', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL)
        await insertManyUsers([adminUser, user1, user2])
    })

    afterAll(async () => {
        await User.collection.drop()
        await mongoose.disconnect(process.env.MONGO_URL)
    })

    it('should login not-admin user and redirect to products page', async () => {
        sinon.stub(bcrypt, 'compare')
        bcrypt.compare.returns(true)
        const req = {
            body: {
                email: user1.email,
                password: user1.password
            },
            session: {
                isLoggedIn: null,
                isAdmin: null,
                user: null,
                save: jest.fn()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postLogin(req, res)

        expect(req.session.isLoggedIn).toBe(true)
        expect(req.session.isAdmin).toBe(user1.isAdmin)
        expect(req.session.user._id).toStrictEqual(user1._id)

        expect(res.status.mock.calls[0][0])
            .toBe(201)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/')
        bcrypt.compare.restore()
    })

    it('should login admin user and redirect to admin products page', async () => {
        sinon.stub(bcrypt, 'compare')
        bcrypt.compare.returns(true)
        const req = {
            body: {
                email: adminUser.email,
                password: adminUser.password
            },
            session: {
                isLoggedIn: null,
                isAdmin: null,
                user: null,
                save: jest.fn()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postLogin(req, res)

        expect(req.session.isLoggedIn).toBe(true)
        expect(req.session.isAdmin).toBe(adminUser.isAdmin)
        expect(req.session.user._id).toStrictEqual(adminUser._id)

        expect(res.status.mock.calls[0][0])
            .toBe(201)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/admin/products')
        bcrypt.compare.restore()
    })

    it('should render login page with status 422 - db failed', async () => {
        const req = {
            body: {
                email: emails.email4,
                password: user1.password
            },
            session: {
                isLoggedIn: null,
                isAdmin: null,
                user: null,
                save: jest.fn()
            }
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postLogin(req, res)

        expect(req.session.isLoggedIn).toBe(null)
        expect(req.session.isAdmin).toBe(null)
        expect(req.session.user).toBe(null)

        expect(res.status.mock.calls[0][0])
            .toBe(422)
        expect(res.render.mock.calls[0][0])
            .toBe('auth/login')
        expect(res.render.mock.calls[0][1].errorMessage)
            .toBe('Invalid email.')
    })

    it('should render login page with status 422 - password does not match', async () => {
        sinon.stub(bcrypt, 'compare')
        bcrypt.compare.returns(false)
        const req = {
            body: {
                email: user2.email,
                password: user2.password
            },
            session: {
                isLoggedIn: null,
                isAdmin: null,
                user: null,
                save: jest.fn()
            }
        }
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postLogin(req, res)

        expect(req.session.isLoggedIn).toBe(null)
        expect(req.session.isAdmin).toBe(null)
        expect(req.session.user).toBe(null)

        expect(res.status.mock.calls[0][0])
            .toBe(422)
        expect(res.render.mock.calls[0][0])
            .toBe('auth/login')
        expect(res.render.mock.calls[0][1].errorMessage)
            .toBe('Invalid password.')
        bcrypt.compare.restore()
    })
})
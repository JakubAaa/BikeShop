const authController = require('../../src/controllers/auth')

describe('getLogin', () => {
    it('should render login page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.getLogin({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('auth/login')

        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Login')
    })
})
const authController = require('../../src/controllers/auth')

describe('getSignup', () => {
    it('should render signup page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.getSignup({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('auth/signup')

        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Signup')
    })
})
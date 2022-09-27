const authController = require('../../src/controllers/auth')

describe('getReset', () => {
    it('should render reset page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.getReset({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('auth/reset')

        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Reset Password')
    })
})
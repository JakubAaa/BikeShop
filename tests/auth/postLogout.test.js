const authController = require('../../src/controllers/auth')

describe('postLogout', () => {
    it('should logout user and redirect to product page', async () => {
        const req = {
            session: {
                destroy: jest.fn()
            }
        }
        const res = {
            redirect: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await authController.postLogout(req, res)

        expect(req.session.destroy).toBeCalled()
        expect(res.status.mock.calls[0][0])
            .toBe(200)
        expect(res.redirect.mock.calls[0][0])
            .toBe('/')
    })
})
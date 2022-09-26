const userController = require('../../src/controllers/user')

describe('getContact', () => {
    it('should render contact page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getContact({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('user/contact')
        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Contact')
    })
})
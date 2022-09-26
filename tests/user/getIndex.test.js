const userController = require('../../src/controllers/user')

describe('getIndex', () => {
    it('should render index page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getIndex({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('user/index')
        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Main')
    })
})
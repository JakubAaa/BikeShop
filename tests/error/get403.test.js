const errorController = require('../../src/controllers/error')

describe('get403', () => {
    it('should render 403 error page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await errorController.get403({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(403)

        expect(res.render.mock.calls[0][0])
            .toBe('error/403')
        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('403 Forbidden')
    })
})
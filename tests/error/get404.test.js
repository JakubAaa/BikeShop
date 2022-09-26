const errorController = require('../../src/controllers/error')

describe('get404', () => {
    it('should render 404 error page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await errorController.get404({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(404)

        expect(res.render.mock.calls[0][0])
            .toBe('error/404')
        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('404 Not Found')
    })
})
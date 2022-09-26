const userController = require('../../src/controllers/user')

describe('getProductsCategories', () => {
    it('should render products categories page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await userController.getProductsCategories({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('user/categories')
        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Categories')
    })
})
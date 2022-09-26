const adminController = require('../../src/controllers/admin')

describe('getAddProduct', () => {
    it('should render addProduct page', async () => {
        const res = {
            render: jest.fn(),
            status: jest.fn()
                .mockReturnThis()
        }
        await adminController.getAddProduct({}, res)

        expect(res.status.mock.calls[0][0])
            .toBe(200)

        expect(res.render.mock.calls[0][0])
            .toBe('admin/edit-product')
        expect(res.render.mock.calls[0][1].pageTitle)
            .toBe('Add Product')
    })
})
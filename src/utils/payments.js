const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.setPrices = products => {
    let lineItems = []
    products.forEach(async p => {
        const product = await stripe.products.create({
            name: p.productId.name
        })
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(p.productId.price * 100),
            currency: 'usd'
        })
        lineItems.push({price: price.id, quantity: p.quantity})
    })

    return new Promise(result => {
        setTimeout(() => {
            result(lineItems)
        }, 2000)
    })
}
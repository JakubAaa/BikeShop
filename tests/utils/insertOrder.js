const {product2, product3} = require('./insertProduct')
const {user1, user2} = require("./insertUser");
const {ObjectId} = require("mongodb");

const order1 = {
    _id: new ObjectId(),
    products: [{product: product2, quantity: 1}],
    user: {
        email: user1.email,
        userId: user1._id
    }
}

const order2 = {
    _id: new ObjectId(),
    products: [{product: product2, quantity: 1}, {product: product3, quantity: 3}],
    user: {
        email: user2.email,
        userId: user2._id
    }
}

exports.order1 = order1
exports.order2 = order2
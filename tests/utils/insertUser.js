const {ObjectId} = require('mongodb')
const emails = {
    email1: 'test1@test.com',
    email2: 'test2@test.com',
    email3: 'test3@test.com',
}

const passwords = {
    password1: '12345',
    password2: 'abcdefg',
    password3: '5gd62cccx',
}

const carts = {
    emptyCart: {},
    cart1: {items: [{productId: new ObjectId(), quantity: 1}]},
    cart2: {
        items: [{productId: new ObjectId(), quantity: 1},
            {productId: new ObjectId(), quantity: 3}]
    }
}

const adminUser = {
    _id: new ObjectId(),
    email: emails.email1,
    password: passwords.password1,
    isAdmin: true,
    cart: carts.emptyCart
}

const user1 = {
    _id: new ObjectId(),
    email: emails.email2,
    password: passwords.password2,
    isAdmin: false,
    cart: carts.cart1
}

const user2 = {
    _id: new ObjectId(),
    email: emails.email3,
    password: passwords.password3,
    isAdmin: false,
    cart: carts.cart2
}

exports.emails = emails
exports.passwords = passwords
exports.carts = carts

exports.adminUser = adminUser
exports.user1 = user1
exports.user2 = user2
const {ObjectId} = require('mongodb')
const User = require("../../src/models/user")

const emails = {
    email1: 'test1@test.com',
    email2: 'test2@test.com',
    email3: 'test3@test.com',
    email4: 'test4@test.com',
    email5: 'test5@test.com'
}

const passwords = {
    password1: '12345',
    password2: 'abcdefg',
    password3: '5gd62cccx',
    password4: 'addsasaddsaassad'
}

const carts = {
    emptyCart: {items: []},
    cart1: {items: [{productId: new ObjectId(), quantity: 1}]},
    cart2: {
        items: [
            {productId: new ObjectId(), quantity: 1},
            {productId: new ObjectId(), quantity: 3}
        ]
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

const user3 = {
    _id: new ObjectId(),
    email: emails.email5,
    password: passwords.password4,
    isAdmin: false,
    cart: carts.cart1,
    resetToken: 'abcde',
    resetTokenExpiration: new Date(Date.UTC(2111, 1, 2))
}

const user4 = {
    _id: new ObjectId(),
    email: emails.email5,
    password: passwords.password4,
    isAdmin: false,
    cart: carts.cart1,
    resetToken: 'abcdefgh',
    resetTokenExpiration: new Date(Date.UTC(1990, 1, 2))
}

const insertOneUser = async user =>
    await User.collection.insertOne(user)


const insertManyUsers = async users =>
    await User.collection.insertMany(users)

exports.emails = emails
exports.passwords = passwords
exports.carts = carts

exports.adminUser = adminUser
exports.user1 = user1
exports.user2 = user2
exports.user3 = user3
exports.user4 = user4

exports.insertOneUser = insertOneUser
exports.insertManyUsers = insertManyUsers
const {ObjectId} = require('mongodb')

const names = {
    name1: 'Canyon',
    name2: 'T-shirt',
    name3: 'Wrench',
    name4: 'name4'
}

const categories = {
    category1: 'bike',
    category2: 'component',
    category3: 'clothing',
    category4: 'workshop',
    category5: 'accessories'
}

const images = {
    image1: {path: 'src\\images\\8cea8fa9-3d70-4440-b20e-8d9410392abe-shoes.jpg'},
    image2: {path: 'src\\images\\463eaae9-aa0c-4ab3-8d6e-c5c5feff1445-Book.jpg'},
    image3: {path: 'src\\images\\f0b0f87b-078e-43ed-b9a3-57cab72d7147-shoes.jpg'},
}

const prices = {
    price1: 123,
    price2: 10.45,
    price3: 12342.435,
    price4: 8764453
}

const descriptions = {
    description1: 'description1',
    description2: 'test description',
    description3: 'Good wrench!',
    description4: 'abcefghijk'
}

const product1 = {
    name: names.name1,
    category: categories.category1,
    price: prices.price1,
    description: descriptions.description1
}

const product2 = {
    _id: new ObjectId(),
    name: names.name2,
    category: categories.category2,
    imageUrl: images.image2.path,
    price: prices.price2,
    description: descriptions.description2,
    userId: new ObjectId()
}

const product3 = {
    _id: new ObjectId(),
    name: names.name3,
    category: categories.category3,
    imageUrl: images.image3.path,
    price: prices.price3,
    description: descriptions.description3,
    userId: new ObjectId()
}

const product4 = {
    _id: new ObjectId(),
    name: names.name4,
    category: categories.category4,
    imageUrl: images.image3.path,
    price: prices.price4,
    description: descriptions.description4,
    userId: new ObjectId()
}

exports.names = names
exports.categories = categories
exports.images = images
exports.prices = prices
exports.descriptions = descriptions

exports.product1 = product1
exports.product2 = product2
exports.product3 = product3
exports.product4 = product4
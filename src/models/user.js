const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    cart: {
        items: [
            {
                productId: {type: Schema.Types.ObjectId, ref:'Product', required: true},
                quantity: {type: Number, required: true}
            }
        ]
    }
})

userSchema.methods.addToCart = product => {
    const cartProductIndex = this.cart.items.findIndex(i => {
        return i.productId.toString() === product._id.toString();
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else{
        updatedCartItems.push({productId: product._id, quantity: newQuantity})
    }
    this.cart = {items: updatedCartItems};
    return this.save();
}

userSchema.methods.deleteFromCart = prodId => {
    this.cart.items = this.cart.items.filter(i => {
        return i.productId.toString() !== prodId.toString();
    })
    return this.save();
}

userSchema.methods.clearCart = () => {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
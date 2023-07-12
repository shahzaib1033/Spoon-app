const mongoose = require("mongoose")


const variant = new mongoose.Schema({
    ProductId: {
        type: mongoose.Types.ObjectId,
        ref: "product",
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})


const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "userinfo",
        required: true
    },
    products: [{
        type: variant,
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {

        type: Date,
        default: Date.now

    }



})
const AddToCart = mongoose.model('Cart', cartSchema);

module.exports = AddToCart;
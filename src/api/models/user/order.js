
const mongoose = require('mongoose');


const variants = mongoose.Schema({
    ProductId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    }



})
const orderModel = mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "userinfo",
        required: true
    },
    products: [{
        type: variants,
        required: true
    }],
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    payment: {
        type: String,
        enum: ['pending', 'Payment Successful'],
        default: 'pending'
    },
    paymentMethode: {
        type: String,
        enum: ['Credit Card', 'Cash on Delivery'],
        default: 'Cash on Delivery'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const OrderModel = mongoose.model('order', orderModel)
module.exports = OrderModel
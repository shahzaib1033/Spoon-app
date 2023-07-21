const mongoose = require('mongoose')

const reviews = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'userInfo',
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products',
        required: true
    },
    rating: {
        type: Number,
        required: true

    },
    content: {
        type: String,
        trim: true
    }
})

const Review = mongoose.model('review', reviews)
module.exports = Review

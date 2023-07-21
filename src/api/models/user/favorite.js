const mongoose = require('mongoose')


const favorite = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "userinfo",
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products',
        required: true
    }


})

const Favorite = mongoose.model('favorite', favorite)
module.exports = Favorite
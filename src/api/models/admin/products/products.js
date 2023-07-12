const mongoose = require('mongoose');
// const { Category, Subcategory } = require('./category');

const skuschema = new mongoose.Schema({
    size: {
        type: String,
        required: true
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

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    skus: {
        type:[skuschema],
        required : true
    }
    
})

const productSchema = new mongoose.Schema({
    productImage: {
        type: String,
        required : true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
   
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    variants:
    {
        type: [variantSchema],
        required: true
        
         }
      ,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;









// colors: [{
//     type: String,
//     required: true
// }],
// sizes: [{
//     type: String,
//     required: true
// }],
// availableQuantity: {
//     type: Number,
//     required: true,
//     min: 0
// }
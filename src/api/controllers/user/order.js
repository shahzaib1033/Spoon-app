const OrderModel = require('../../models/user/order')
const Product = require('../../models/admin/products/products')
const AddToCart = require('../../models/user/cart')
// const { update } = require('./userProfile')

const ordering = async (req, res) => {
    try {
        const { _id } = req.user

        const { cartId, paymentMethod, orderStatus } = req.body
        const existeCart = await AddToCart.findOne({ _id: cartId })
        if (existeCart) {

            const order = await OrderModel.create({
                userId: _id,
                products: existeCart.products,
                paymentMethod: paymentMethod,
                orderStatus: orderStatus
            })
            const saveorder = order.save();
            // for (let i = 0; i < existeCart.products.length; i++) {
            //     const ProductId = existeCart.products[i].ProductId
            //     const product = await Product.findOne({ _id: ProductId })
            //     for (let j = 0; j < product.variants.length; j++) {
            //         if (existeCart.products[i].color == product.variants[j].name) {
            //             // const productToupdate = product.variants[j];
            //             for (let k = 0; k < product.variants[j].skus.length; k++) {
            //                 if (product.variants[j].skus[k].size == existeCart.products[i].size) {
            //                     const quantityUpdate = product.variants[j].skus[k].quantity - existeCart.products[i].quantity
            //                     product.variants[j].skus[k] = {
            //                         size: product.variants[j].skus[k].size,
            //                         price: product.variants[j].skus[k].price,
            //                         quantity: quantityUpdate,
            //                         _id: product.variants[j].skus[k]._id,
            //                     }
            //                     var saveData = product.save();
            //                 }
            //             }
            //         }
            //     }
            // }
            for (const cartProduct of existeCart.products) {
                const product = await Product.findOne({ _id: cartProduct.ProductId });

                const variant = product.variants.find((v) => v.name === cartProduct.color);
                if (variant) {
                    const sku = variant.skus.find((s) => s.size === cartProduct.size);
                    if (sku) {
                        const updatedQuantity = sku.quantity - cartProduct.quantity;
                        sku.quantity = updatedQuantity;

                        try {
                            await product.save();
                        } catch (error) {
                            // Handle database save error
                            console.error(`Error updating product: ${error}`);
                            // Implement rollback if necessary
                        }
                    }
                }
            }




            // if (saveorder && saveData) {
            await AddToCart.findOneAndDelete({ _id: cartId })
                .then((deletedCart) => {
                    if (deletedCart) {
                        console.log('cart deleted')
                    } else {
                        console.log('not fond the Cart')
                    }
                }).catch((error) => {
                    console.log('Error in deleting cart checkOut the Problem:', error);
                });
            res.status(200).send('order successfully done');
            // }
            // else {
            //     res.status(200).send('inner error');
            // }
        } else {
            res.status(404).send('cart not found ')
        }
    }
    catch (err) {
        console.log(err)
    }
}
const orderStatus = async (req, res) => {
    try {
        const userId = req.user._id
        const { orderStatus } = req.body
        const orderDetails = await OrderModel.findOne(userId)
        if (orderDetails) {
            orderDetails.orderStatus = orderStatus || orderDetails.AddToCartStatus
            const saveData = await orderDetails.save();
            if (saveData) {
                return res.status(200).send('order Status successfully UPDATED')
            }
        }
    } catch (error) {

    }
}

module.exports = {
    ordering,
    orderStatus
}













// Assuming existeCart and Product model are defined


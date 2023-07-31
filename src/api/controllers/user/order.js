const OrderModel = require('../../models/user/order')
const Product = require('../../models/admin/products/products')
const AddToCart = require('../../models/user/cart')
// const { update } = require('./userProfile')
const { useSuccessResponse, useErrorResponse } = require('../../../config/methods/response')
const massages = require('../../../config/methods/massage')
const ordering = async (req, res) => {
    try {
        const { _id } = req.user

        const { cartId, paymentMethod, orderStatus, address } = req.body
        const existeCart = await AddToCart.findOne({ _id: cartId })
        if (existeCart) {

            const order = await OrderModel.create({
                userId: _id,
                products: existeCart.products,
                paymentMethod: paymentMethod,
                orderStatus: orderStatus,
                address: address
            })
            const saveorder = await order.save();

            for (const cartProduct of existeCart.products) {
                await Product.updateMany(
                    {
                        variants: {
                            $elemMatch: {
                                name: cartProduct.color,
                                skus: {
                                    $elemMatch: {
                                        size: cartProduct.size,
                                    },
                                },
                            },
                        },
                    },
                    {
                        $inc: {
                            "variants.$[variant].skus.$[sku].quantity": -cartProduct.quantity,
                        },
                    },
                    {
                        arrayFilters: [
                            { "variant.name": cartProduct.color },
                            { "sku.size": cartProduct.size },
                        ],
                    }
                );
            }



            // const variant = product.variants.find((v) => v.name === cartProduct.color);
            // if (variant) {
            //     const sku = variant.skus.find((s) => s.size === cartProduct.size);
            //     if (sku) {
            //         const updatedQuantity = sku.quantity - cartProduct.quantity;
            //         sku.quantity = updatedQuantity;

            // try {

            // } catch (error) {
            //     // Handle database save error
            //     console.error(`Error updating product: ${error}`);
            //     // Implement rollback if necessary
            // }
            // }
            // }





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
            return useSuccessResponse(res, massages.successInOrder, saveorder, 200)
            // }
            // else {
            //     res.status(200).send('inner error');
            // }
        } else {

            return useErrorResponse(res, 'cart not found ', 404)
            // res.status(404).send('')
        }
    }
    catch (err) {
        console.log(err)
        return useErrorResponse(res, massages.unexpectedError, 500)
    }
}
const orderStatus = async (req, res) => {
    try {
        const userId = req.user._id
        const { orderStatus, orderId } = req.body
        const orderDetails = await OrderModel.findOne({ _id: orderId })
        if (orderDetails) {
            orderDetails.status = orderStatus || orderDetails.status
            const saveData = await orderDetails.save();
            if (saveData) {
                return useSuccessResponse(res, massages.successInUpdateOrder, saveData, 200)

            } else {
                return useErrorResponse(res, massages.internalError, 500)
            }
        }
    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)

    }
}
const getOrder = async (req, res) => {
    try {
        const { page, pageSize, skip } = req.query;

        const userId = req.user._id
        const { _id, role } = req.user;
        if ((role === 'superAdmin' || role === 'admin')) {
            const data = await OrderModel.find().skip(skip).limit(pageSize);
            return useSuccessResponse(res, massages.success, data, 200)

        }
        const orderDetails = await OrderModel.find({ userId }).skip(skip).limit(pageSize);
        if (orderDetails) {
            return useSuccessResponse(res, massages.success, orderDetails, 200)

        } else {
            return useErrorResponse(res, massages.internalError, 500)

        }
    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)

    }
}
module.exports = {
    ordering,
    orderStatus,
    getOrder
}













// Assuming existeCart and Product model are defined
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



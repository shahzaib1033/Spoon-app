

const massages = require('../../../config/methods/massage');
const { useSuccessResponse, useErrorResponse } = require('../../../config/methods/response');
const AddToCart = require('../../models/user/cart');

const AddCart = async (req, res) => {
    const { _id } = req.user;
    const { products } = req.body
    const cartexist = await AddToCart.findOne({ userId: _id })
    if (cartexist) {

        let product = products;
        let productId = product.ProductId;
        let color = product.color;
        // console.log(cartexist.totalAmount)
        // const foundproduct = await AddToCart.find(product.productId, product.color)
        let foundproduct = await AddToCart.findOne({
            'products.color': color, 'products.ProductId': productId
        });

        if (!foundproduct) {
            cartexist.products.push(product);
            cartexist.totalAmount = (cartexist.totalAmount + product.price).toFixed(2);

            const data = await cartexist.save();
            if (data)
                return useSuccessResponse(res, massages.successInAddcart, data, 201)

            else
                return useErrorResponse(res, massages.internalError, 500)

        }
        else {
            return useErrorResponse(res, massages.alreadyexistings, 403)

        }

    } else {
        // console.log('i am here '+products.price);

        const cart = await AddToCart.create({ userId: _id, products: products, totalAmount: products.price })
        cart.save();
        if (cart) {
            return useSuccessResponse(res, massages.successInAddcart, data, 201)
        }
        return useErrorResponse(res, massages.internalError, 500)
    }
}
const deleteCartProduct = async (req, res) => {

    try {
        const { _id } = req.user;
        const { cartProductId, cartProductColor } = req.body;
        const cartExist = await AddToCart.findOne({ userId: _id });

        const product = cartExist.products.find(item => item.ProductId == cartProductId && item.color == cartProductColor);

        await AddToCart.findByIdAndUpdate(cartExist,
            {
                $pull:
                {
                    products:
                    {
                        ProductId: cartProductId,
                        color: cartProductColor
                    }
                }

            }, { new: true })
            .then(updatedCart => {
                cartExist.totalAmount = Number((cartExist.totalAmount - product.price).toFixed(2));

                cartExist.save();
                return useSuccessResponse(res, massages.successInDelete, cartExist, 200)


            })
            .catch(error => {
                return useErrorResponse(res, massages.internalError, 500)

            });
    } catch (err) {
        console.error(err);
        return useErrorResponse(res, massages.internalError, 500)
    }


}
const getCartProducts = async (req, res) => {
    try {

        const { _id } = req.user
        const exists = await AddToCart.findOne({ userId: _id })
        if (exists) {
            console.log(exists);
            const products = exists.products
            const totalPrice = exists.totalAmount
            const data = {
                products,
                totalPrice
            }
            return useSuccessResponse(res, massages.success, data, 201)

        }
        else {
            return useErrorResponse(res, massages.internalError, 500)
        }
    } catch (err) {
        console.log(err)
        return useErrorResponse(res, massages.internalError, 500)

    }
}

module.exports = {
    AddCart,
    deleteCartProduct,
    getCartProducts
}
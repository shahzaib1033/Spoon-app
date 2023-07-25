const Favorite = require('../../models/user/favorite');
const productModel = require('../../models/admin/products/products');
const { useErrorResponse, useSuccessResponse } = require('../../../config/methods/response');
const massages = require('../../../config/methods/massage');


const addToFavorite = async (req, res) => {
    try{const { _id } = req.user;
    const { productId } = req.body;
    const foundproduct = await Favorite.findOne({ productId: productId });

    if (foundproduct) {
        // const product = modelExists.products.find(
        //     (product) => product.productId.toString() === productId
        // );

        // if (!product) {
        //     modelExists.products.push(products);
        //     const data = await modelExists.save();
        //     return res.status(200).json({ message: 'pushed', data });
        // } else {
        return useErrorResponse(res, massages.alreadyexistings, 403)

    }

    const favorite = await Favorite.create({
        userId: _id,
        productId: productId,
    });

    const saveData = await favorite.save();

    if (saveData) {
        return useSuccessResponse(res, massages.success, saveData, 200)

    } else {
        return useErrorResponse(res,massages.unabletoadd)
        }
    } catch (err) {
        console.log(err);
        return useErrorResponse(res,massages.internalError,500)
    }
};
const getFavorite = async (req, res) => {
    try{const { _id } = req.user
    var data = [];
    const modelExsist = await Favorite.find({ userId: _id })
    if (modelExsist) {
        for (const Product of modelExsist) {

            const id = Product.productId
            const product = await productModel.findOne({ _id: id })
            data.push(product);
        }
        //     const product = modelExists.products.find(
        //         (product) => product.productId.toString() === productId
        //     );
        return useSuccessResponse(res,massages.success,data,200)

    } else {
        return useErrorResponse(res,massages.userNotfondfavorite,404 )
        }
    } catch (err) {
        console.log(err);
        return useErrorResponse(res, massages.internalError,500)
    }
}
const removeFavorite = async (req, res) => {
   try{ const { _id } = req.user
    const { productId } = req.body
    const deleted = await Favorite.findOneAndDelete({ userId: _id, productId: productId })
    return useSuccessResponse(res,massages.successInDelete,200)
    } catch (err){
       console.log(err);
       return useErrorResponse( res,massages.internalError,500)
    }
}
module.exports = {
    addToFavorite,
    getFavorite,
    removeFavorite
}
const Favorite = require('../../models/user/favorite');
const productModel = require('../../models/admin/products/products');


const addToFavorite = async (req, res) => {
    const { _id } = req.user;
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
        return res.json({
            message: 'already exists', foundproduct
        });
    }

    const favorite = await Favorite.create({
        userId: _id,
        productId: productId,
    });

    const saveData = await favorite.save();

    if (saveData) {
        return res.status(201).json({ message: 'favorite added', saveData });
    } else {
        return res.send('unable to add');
    }
};
const getFavorite = async (req, res) => {
    const { _id } = req.user
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
        return res.status(200).json({ message: 'FAVORITE PRODUCTS ARE', data })

    }
}
const removeFavorite = async (req, res) => {
    const { _id } = req.user
    const { productId } = req.body
    const deleted = await Favorite.findOneAndDelete({ userId: _id  , productId: productId })
    return res.status(200).json({ message: 'removed', deleted })
}
module.exports = {
    addToFavorite,
    getFavorite,
    removeFavorite
}
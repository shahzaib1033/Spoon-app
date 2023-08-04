const massages = require('../../../config/methods/massage');
const { useSuccessResponse, useErrorResponse } = require('../../../config/methods/response');
const { Category, Subcategory } = require('../../models/admin/products/productCategory');

const productModel = require('../../models/admin/products/products');



const createProduct = async (req, res) => {

    try {
        const { productName, description, category, subcategory, imagePath, variants } = req.body;

        const { _id, role } = req.user;
        if ((role === 'superAdmin' || role === 'admin')) {
            const Categorys = await Category.findOne({ _id: category });

            const SubCategory = await Subcategory.findOne({ _id: subcategory });
            const exists = await productModel.findOne({ name: productName })
            // console.log("Main Category " + category)
            // console.log("product " + exists)
            // && category && SubCategory
            if (!exists && SubCategory && Categorys) {
                const productData = await productModel.create({
                    productImage: imagePath,
                    name: productName,
                    description: description,
                    category: category,
                    subcategory: subcategory,
                    variants: variants
                });

                const data = await productData.save();
                if (data)
                    return useSuccessResponse(res, massages.success, productData, 201)
                else
                    return useErrorResponse(res, massages.internalError, 500)
            } else {
                return useErrorResponse(res, massages.alreadyexistings, 404)
            }


        } else {
            return useErrorResponse(res, massages.unAutherized, 403)
        }

    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }

}
const getProduct = async (req, res) => {


    try {
        const { page, pageSize, skip } = req.query;
        // const filters = {
        //     sizes: req.query.sizes ? req.query.sizes.split(',') : [],
        //     colors: req.query.colors ? req.query.colors.split(',') : [],
        //     variants: req.query.variants ? req.query.variants.split(',') : [],
        // };

        // if (true) {
        //     productModel.find({
        //         $and: [
        //             { sizes: { $in: filters.sizes } },
        //             { colors: { $in: filters.colors } },
        //             { variants: { $in: filters.variants } },
        //         ],
        //     }).then(filteredProducts => {
        //         return res.json(filteredProducts);
        //     })
        //         .catch(error => {
        //             return console.error(error);
        //         });
        // }
        console.log(req.query);
        if (req.query._id) {

            const data = await productModel.findOne({ _id: req.query._id }).populate('category').populate('subcategory').skip(skip).limit(pageSize);
            if (data) {
                return useSuccessResponse(res, massages.success, data, 200)
            } else {
                return useErrorResponse(res, massages.notfound, 404)
            }
        } else {
            const data = await productModel.find().populate('category').populate('subcategory').skip(skip).limit(pageSize);
            if (data) {
                return useSuccessResponse(res, massages.success, data, 200)
            } else {
                return useErrorResponse(res, massages.notfound, 404)
            }

        }



    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }

}
const updateProduct = async (req, res) => {
    try {
        const { productName, ProductId, description, category, subcategory, imagePath, variants } = req.body;
        const { _id, role } = req.user;
        if ((role === 'superAdmin' || role === 'admin')) {
            // const category = await Category.findOne({ _id: categoryId });

            // const productData = await Subcategory.findOne({ _id: subcategoryId });
            const productData = await productModel.findOne({ _id: ProductId })
            // console.log("Main Category " + category)
            // console.log("Sub Category " + SubCategory)

            if (productData) {
                productData.productImage = imagePath || productData.productImage
                productData.name = productName || productData.name
                productData.description = description || productData.description
                productData.category = category || productData.category
                productData.subcategory = subcategory || productData.subcategory

                productData.variants = variants || productData.variants

                const ProductData = await productData.save();
                if (ProductData) {
                    const data = await productModel.findOne({ _id: ProductId })
                    return useSuccessResponse(res, massages.successInUpdate, data, 200)
                } else
                    return useErrorResponse(res, massages.internalError, 500)
            } else {
                return useErrorResponse(res, massages.notfound, 404)
            }


        }
        return useErrorResponse(res, massages.unAutherized, 403)

    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }
}
const deleteProduct = async (req, res) => {

    try {
        // console.log(req.body)

        const { ProductId } = req.body
        const { _id, role } = req.user;
        if (!(role === 'superAdmin' || role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 403)
        }

        const data = await productModel.findByIdAndDelete({ _id: ProductId })
        if (data) {
            return useSuccessResponse(res, massages.successInDelete, data, 200)
        }
        return useErrorResponse(res, massages.notfound, 404)
    }
    catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }

}
const categoryFilter = async (req, res) => {
    const { page, pageSize, skip, categoryId } = req.query;
    const { _id, role } = req.user

    const subcategorys = await Subcategory.find({ category: categoryId }).populate('category').skip(skip).limit(pageSize);
    // await productModel.find({ category: categoryId })
    if (subcategorys) {
        const data = {
            subcategorys,
            page
        }
        return useSuccessResponse(res, massages.success, data, 200)
    }
}
const searchProduct = async (req, res) => {
    const { _id, role } = req.user
    const { page, pageSize, skip, subcategory } = req.query;
    console.log(subcategory)

    const subcategoryId = await Subcategory.findOne({ name: subcategory })
    console.log(subcategoryId._id)
    const productToSearch = await productModel.find({ subcategory: subcategoryId._id }).populate('category').populate('subcategory').skip(skip).limit(pageSize);
    if (productToSearch) {
        const data = {
            productToSearch,
            page
        }
        return useSuccessResponse(res, massages.success,data,200)
    } else {
        return useErrorResponse(res, massages.notfound, 404)

    }
}
const subcategoryFilter = async (req, res) => {
    const { page, pageSize, skip, categoryId, subcategoryId } = req.query;
    const products = await productModel.find({ subcategory: subcategoryId, category: categoryId }).populate('category').populate('subcategory').skip(skip).limit(pageSize);
    if (products) {
        const data = {
            products,
            page
        }
        return useSuccessResponse(res, massages.success, data, 200)

    }
    else {
        return useErrorResponse(res, massages.notfound, 404)


    }
}
const filteredProducts = async (req, res) => {
    try {
        const { _id, role
        } = req.user
        const { page, pageSize, skip, size, color } = req.query;
        const Product = await productModel.find({
            variants: {
                $elemMatch: {
                    name: color,
                    skus: {
                        $elemMatch: { size: size }
                    }
                },
            },
        }).populate('category').populate('subcategory').skip(skip).limit(pageSize);

        // const products = Product.find({
        //     variants: {
        //         $elemMatch: {
        //             name: color,
        //             sku: {
        //                 $elemMatch: { size: size }
        //             }
        //         },
        //     },
        // })
        // const products = Product.find({
        //     variants: {
        //         $elemMatch: {
        //             name: color,
        //             sku: {
        //                 $elemMatch: { size: size }
        //             }
        //         },
        //     },
        // })
        // .populate('category').populate('subcategory').skip(skip).limit(pageSize);


        return useSuccessResponse(res, success, Product, 200)
    } catch (err) {
        return useErrorResponse(res, 'error', 500)
    }
    // if () { // } // else {//     return res.status(404).json('not fond') // }

}
module.exports =
{
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    categoryFilter,
    searchProduct,
    subcategoryFilter,
    filteredProducts
}
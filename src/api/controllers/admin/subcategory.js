const massages = require('../../../config/methods/massage');
const { useErrorResponse, useSuccessResponse } = require('../../../config/methods/response');
const { Category, Subcategory } = require('../../models/admin/products/productCategory');

const createsubCategory = async (req, res) => {
    try {

        const { name, categoryId, subCategoryImage } = req.body
        const { _id, role } = req.user;
        console.log(role)
        if (!(role === 'superAdmin' || role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 403)
        }

        const existingcategory = await Subcategory.findOne({ name: name.toLowerCase() })

        // const { name } = req.body
        if (!(existingcategory)) {
            const savedata = await Subcategory.create(
                {
                    category: categoryId,
                    name: name.toLowerCase(),
                    subcategoryImage: subCategoryImage
                }
            )
            const data = await savedata.save();
            if (data) {
                return useSuccessResponse(res, massages.success, data, 201)

            }
        }
        else
            return useErrorResponse(res, massages.alreadyexisting, 400)

    }
    catch (err) {
        console.log(err)
        return useErrorResponse(res, massages.internalError, 500)

    }
}
const updatesubCategory = async (req, res) => {
    try {
        const { name, categoryId, subCategoryId, subCategoryImage } = req.body;
        const { _id, role } = req.user;
        if (!(role === 'superAdmin' || role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 403)

        }

        const subcategory = await Subcategory.findOne({ _id: subCategoryId })
        if (subcategory) {
            subcategory.name = name || subcategory.name,
                subcategory.category = categoryId || subcategory.category
            subcategory.subcategoryImage = subCategoryImage || subcategory.subcategoryImage
            subcategory.save();
            return useSuccessResponse(res, massages.successInUpdate, subcategory, 200)
        }
        else {
            return useErrorResponse(res, massages.notfound, 404)

        }
    } catch (error) {
        console.log(error)

        return useErrorResponse(res, massages.internalError, 500)
    }
}
const deletesubCategory = async (req, res) => {

    try {
        console.log(req.body)

        const { categoryId, subCategoryId } = req.body
        const { _id, role } = req.user;
        if (!(role === 'superAdmin' || role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 403)
        }

        const SubCategory = await Subcategory.findByIdAndDelete({ _id: subCategoryId })
        return useSuccessResponse(res, massages.successInDelete, SubCategory, 200)
    }
    catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }

}
const readsinglesubCategory = async (req, res) => {

}
const readAllsubCategory = async (req, res) => {
    try {

        const { category, subCategoryId } = req.query
        if (subCategoryId) {

            const data = await Subcategory.findOne({ _id: subCategoryId }).populate('category')
            return useSuccessResponse(res, massages.success, data, 200)
        }
        console.log(category)
        const data = await Subcategory.find({ category: category }).populate('category')
        return useSuccessResponse(res, massages.success, data, 200)

    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }

}
module.exports = {
    createsubCategory,
    updatesubCategory,
    readsinglesubCategory,
    readAllsubCategory,
    deletesubCategory

}
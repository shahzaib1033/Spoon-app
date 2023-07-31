const massages = require('../../../config/methods/massage');
const { useErrorResponse, useSuccessResponse } = require('../../../config/methods/response');
const { Category, Subcategory } = require('../../models/admin/products/productCategory');

const createCategory = async (req, res) => {
    try {

        const { name } = req.body
        const { _id, role } = req.user;
        console.log(role);
        if (!(role ==='superAdmin'|| role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 401)
        }

        const existingcategory = await Category.findOne({ name })
        // console.log(existingcategory)
        // const { name } = req.body
        if (!(existingcategory)) {
            const savedata = await Category.create(
                {
                    name: name
                }
            )
            const data = savedata.save();
            if (data) {
                return useSuccessResponse(res, massages.success, savedata, 201)

            }
        }
        else
            return useErrorResponse(res, massages.alreadyexistings, 403)


    }
    catch (err) {
        console.log(err)
        return useErrorResponse(res, massages.internalError, 500)
    }
}
const updateCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const { _id, role } = req.user;
        if (!(role ==='superAdmin'|| role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 401)
        }

        const existingcategory = await Category.findOne({ _id: categoryId })
        if (existingcategory) {
            existingcategory.name = name || Category.name
            const data = existingcategory.save();
            return useSuccessResponse(res, massages.successInUpdate, data, 200)

        }
        else {
            return useErrorResponse(res, massages.notfound, 404)

        }
    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)

    }

}
const deleteCategory = async (req, res) => {
    try {
        // console.log(req.body)

        const { categoryId } = req.body
        const { _id, role } = req.user;
        if (!(role ==='superAdmin'|| role === 'admin')) {
            return useErrorResponse(res, massages.unAutherized, 401)


        }

        const maincategory = await Category.findByIdAndDelete({ _id: categoryId })
        return useSuccessResponse(res, massages.successInDelete, maincategory || categoryId, 200)
    }
    catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.unAutherized, 401)


    }

}
const readsingleCategory = async (req, res) => {

}
const readAllCategory = async (req, res) => {

    try {
        console.log(req.query)
        const categorys = await Category.find(req.query)
        return useSuccessResponse(res, massages.success, categorys, 200)
    } catch (error) {
        console.log(error)
        return useErrorResponse(res, massages.internalError, 500)
    }




}
module.exports = {
    createCategory,
    updateCategory,
    readsingleCategory,
    readAllCategory,
    deleteCategory

}
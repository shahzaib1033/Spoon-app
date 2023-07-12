const { Category, Subcategory } = require('../../models/admin/products/productCategory');

const createsubCategory = async (req, res) => {
    try {

        const { name, CategoryId } = req.body
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
        }

        const existingcategory = await Category.findOne({ name })

        // const { name } = req.body
        if (!(existingcategory)) {
            const savedata = await Subcategory.create(
                {
                    category: CategoryId,
                    name: name
                }
            )
            savedata.save();
            if (savedata) {
                const { category, _id } =savedata
                res.status(201).json({
                    massage: "the subCategory created", savedata, category, _id
                })
            }
        }
        else
            return res.status(201).send("something went wrong/category already existing")
    }
    catch (err) {
        console.log(err)
    }
}
const updatesubCategory = async (req, res) => {
    try {
        const { name, categoryId, subCategoryId } = req.body;
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
        }

        const subcategory = await Subcategory.findOne({ _id: subCategoryId })
        if (subcategory) {
            subcategory.name = name || subcategory.name,
                subcategory.category = categoryId || subcategory.category
            subcategory.save();
            return res.status(201).json({
                massage: "updated successfully",
                subcategory
            })
        }
        else {
            return res.status(201).send("category not found")

        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Error Occur", error })
    }
}
const deletesubCategory = async (req, res) => {

    try {
        // console.log(req.body)

        const { categoryId, subCategoryId } = req.body
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
        }

        const SubCategory = await Subcategory.findByIdAndDelete({ _id: subCategoryId })

        return res.json({
            massage: "deleted successfully",
            SubCategory

        });
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Error Occur", error })
    }

}
const readsinglesubCategory = async (req, res) => {

}
const readAllsubCategory = async (req, res) => {
    try {
        const existingcategory = await Subcategory.find()
        return res.json({
            massage: " successfully",
            existingcategory

        });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Error,", error })
    }

}
module.exports = {
    createsubCategory,
    updatesubCategory,
    readsinglesubCategory,
    readAllsubCategory,
    deletesubCategory

}
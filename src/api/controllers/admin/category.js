const { Category, Subcategory } = require('../../models/admin/products/productCategory');

const createCategory = async (req, res) => {
    try {

        const { name } = req.body
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
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
            savedata.save();
            if (savedata) {
                return res.status(201).json({ massage: "the category created", savedata })
            }
        }
        else
            return res.status(201).send("something went wrong/category already existing")

    }
    catch (err) {
        console.log(err)
    }
}
const updateCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
        }

        const existingcategory = await Category.findOne({ _id: categoryId })
        if (existingcategory) {
            existingcategory.name = name || Category.name
            existingcategory.save();
            return res.status(201).json({
                massage: "updated successfully",
                existingcategory
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
const deleteCategory = async (req, res) => {
    try {
        // console.log(req.body)

        const { categoryId } = req.body
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
        }

        const maincategory = await Category.findByIdAndDelete({ _id: categoryId })
        return res.json({
            massage: "deleted successfully",
            maincategory

        });
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Error Occur", error })
    }

}
const readsingleCategory = async (req, res) => {

}
const readAllCategory = async (req, res) => {

    try {
        const maincategory = await Category.find(req.query)
        return res.json({
            massage: " successfully",
            maincategory

        });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Error,", error })
    }



    const existingcategory = await Category.findOne({ name })

}
module.exports = {
    createCategory,
    updateCategory,
    readsingleCategory,
    readAllCategory,
    deleteCategory

}
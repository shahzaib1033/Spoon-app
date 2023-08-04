const express = require('express');
const router = express.Router();
// const Product = require('../../models/admin/products/products');

const {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    categoryFilter,
    searchProduct,
    subcategoryFilter,
    filteredProducts
} = require('../../controllers/admin/products')
const {
    createsubCategory,
    readsinglesubCategory,
    readAllsubCategory,
    updatesubCategory,
    deletesubCategory
} = require('../../controllers/admin/subcategory')
const {
    createCategory,
    readsingleCategory,
    readAllCategory,
    updateCategory,
    deleteCategory
} = require('../../controllers/admin/category')

const { deleteAdmin, addAdmin, getAdmin } = require('../../controllers/admin/addAdmin');

const { checktokenValidation } = require('../../middlewears/jwttoken');
const { uploads } = require('../../middlewears/uploads');
router

    // category
    .post("/addCategory", checktokenValidation, createCategory)
    .get("/readSingleSategory", checktokenValidation, readsingleCategory)
    .get("/getAllCategory", checktokenValidation, readAllCategory)
    .post("/updateCategory", checktokenValidation, updateCategory)
    .delete("/deleteCategory", checktokenValidation, deleteCategory)
    // subcategory
    .post("/addsubCategory", checktokenValidation, createsubCategory)
    .get("/readSingleSategory", checktokenValidation, readsinglesubCategory)
    .get("/getsubCategory", checktokenValidation, readAllsubCategory)
    .post("/updatesubCategory", checktokenValidation, updatesubCategory)
    .delete("/deletesubCategory", checktokenValidation, deletesubCategory)
    // produsts
    .post('/createproducts', checktokenValidation, createProduct)
    .get('/getProducts', checktokenValidation, getProduct)
    .get('/getWithCategory', checktokenValidation, categoryFilter)
    .get('/getProductsWithSubcategory', checktokenValidation, subcategoryFilter)
    .get('/getProductsBySearch', checktokenValidation, searchProduct)
    .get('/filteredProducts', checktokenValidation, filteredProducts)
    .put('/updateproducts', checktokenValidation, updateProduct)
    .delete('/deleteproduct', checktokenValidation, deleteProduct)
    //superAdmin (add admin and user)
    .post('/createaccount', checktokenValidation, addAdmin)
    .get('/getAdmins', checktokenValidation, getAdmin)
    .delete('/deleteAccount', checktokenValidation, deleteAdmin)

module.exports = router
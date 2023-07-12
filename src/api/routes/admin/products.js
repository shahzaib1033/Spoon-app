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

const { checktokenValidation } = require('../../middlewears/jwttoken');
const { uploads } = require('../../middlewears/uploads');

router

    // category
    .post("/addCategory", checktokenValidation, createCategory)
    .get("/readSingleSategory", checktokenValidation, readsingleCategory)
    .get("/getAllCategory", checktokenValidation, readAllCategory)
    .post("/updateCategory", checktokenValidation, updateCategory)
    .post("/deleteCategory", checktokenValidation, deleteCategory)
    // subcategory
    .post("/addsubCategory", checktokenValidation, createsubCategory)
    .get("/readSingleSategory", checktokenValidation, readsinglesubCategory)
    .get("/getsubCategory", checktokenValidation, readAllsubCategory)
    .post("/updatesubCategory", checktokenValidation, updatesubCategory)
    .post("/deletesubCategory", checktokenValidation, deletesubCategory)
    // produsts
    .post('/createproducts', checktokenValidation, createProduct)
    .get('/getProducts', checktokenValidation, getProduct)
    .get('/getProductsWithCategory', checktokenValidation, categoryFilter)
    .get('/getProductsWithSubcategory', checktokenValidation, subcategoryFilter)
    .get('/getProductsBySearch', checktokenValidation, searchProduct)
    .get('/filteredProducts', checktokenValidation, filteredProducts)
    .put('/updateproducts', checktokenValidation, updateProduct)
    .post('/deleteproducts', checktokenValidation, deleteProduct);

module.exports = router
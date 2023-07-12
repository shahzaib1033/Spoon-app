const { Category, Subcategory } = require('../../models/admin/products/productCategory');
const productModel = require('../../models/admin/products/products');



const createProduct = async (req, res) => {

    try {
        const { name, description, categoryId, subcategoryId, variants, productImage } = req.body;
        const { _id, isAdmin } = req.user;

        if (isAdmin == true) {
            const category = await Category.findOne({ _id: categoryId });

            const SubCategory = await Subcategory.findOne({ _id: subcategoryId });
            const exists = await productModel.findOne({ name: name })
            // console.log("Main Category " + category)
            // console.log("product " + exists)

            if (!exists && category && SubCategory) {
                console.log("Sub Category " + SubCategory)
                const productData = await productModel.create({
                    productImage: productImage,
                    name: name,
                    description: description,
                    category: categoryId,
                    subcategory: subcategoryId,
                    variants: variants
                });

                const ProductData = await productData.save();
                res.status(201).json({ message: "Product has been created", ProductData })
            } else {
                res.status(201).json({ message: "Product Already Exist" })
            }


        } else {
            res.status(403).json({ message: "Unauthorized User is not Admin " })
        }

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Error Occur", error })
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
        const { sizes, colors, variants } = req.query
        const ExistingProducts = await productModel.find().populate('category').populate('subcategory').skip(skip).limit(pageSize);

        if (ExistingProducts) {
            res.status(201).json({ message: "Sub Categories has been Displayed", ExistingProducts, page })
        } else {
            res.status(404).json({ message: "Sub Categorie Does not Exist" })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });

    }

}
const updateProduct = async (req, res) => {
    try {
        const { productImage, ProductId, name, description, price, categoryId, subcategoryId, variants } = req.body;
        const { _id, isAdmin } = req.user;

        if (isAdmin == true) {
            // const category = await Category.findOne({ _id: categoryId });

            // const productData = await Subcategory.findOne({ _id: subcategoryId });
            const productData = await productModel.findOne({ _id: ProductId })
            // console.log("Main Category " + category)
            // console.log("Sub Category " + SubCategory)

            if (productData) {
                productData.productImage = productData.productImage || productImage
                productData.name = name || productData.name
                productData.description = description || productData.description
                productData.price = price || productData.price
                productData.category = categoryId || productData.category
                productData.subcategory = subcategoryId || productData.subcategory

                productData.variants = variants || productData.variants

                const ProductData = await productData.save();
                return res.status(201).json({ message: "Product has been updated", ProductData })
            } else {
                return res.status(201).json({ message: "Product couldn't updated" })
            }


        }
        res.status(403).json({ message: "Unauthorized User is not Admin " })

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Error Occur", error })
    }
}
const deleteProduct = async (req, res) => {

    try {
        // console.log(req.body)

        const { ProductId } = req.body
        const { _id, isAdmin } = req.user;
        if (isAdmin == false) {
            return res.status(403).send("unAutherized the user is not a admin")
        }

        const SubCategory = await Subcategory.findByIdAndDelete({ _id: ProductId })

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
const categoryFilter = async (req, res) => {
    const { page, pageSize, skip, categoryId } = req.query;
    const { _id, isAdmin } = req.user

    const productofcategory = await productModel.find({ category: categoryId }).populate('category').populate('subcategory').skip(skip).limit(pageSize);
    // await productModel.find({ category: categoryId })
    if (productofcategory) {
        res.status(200).json({ productofcategory, page })
    }
}
const searchProduct = async (req, res) => {
    const { _id, isAdmin } = req.user
    const { page, pageSize, skip, productName } = req.query;



    const productToSearch = await productModel.find({ name: productName }).populate('category').populate('subcategory').skip(skip).limit(pageSize);
    if (productToSearch) {
        return res.status(200).json({ productToSearch, page })
    } else {
        return res.status.send('No products')
    }
}
const subcategoryFilter = async (req, res) => {
    const { page, pageSize, skip, subcategoryId } = req.query;
    const productofsubcategory = await productModel.find({ subcategory: subcategoryId }).populate('category').populate('subcategory').skip(skip).limit(pageSize);
    if (productofsubcategory) {
        return res.status(200).json({ productofsubcategory, page });
    }
    else {
        return res.status().send('No subcategories found')
    }
}
const filteredProducts = async (req, res) => {
    const { _id, isAdmin } = req.user

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
    });
    
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



    return res.status(200).json(Product)
    // if () {
    // }
    // else {
    //     return res.status(404).json('not fond')
    // }
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
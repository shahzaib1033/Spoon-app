

const AddToCart = require('../../models/user/cart');

const AddCart = async (req, res) => {
    const { _id } = req.user;
    const { products } = req.body
    const cartexist = await AddToCart.findOne({ userId: _id })
    if (cartexist) {

        let product = products;
        let productId = product.ProductId;
        let color = product.color;
        // console.log(cartexist.totalAmount)
        // const foundproduct = await AddToCart.find(product.productId, product.color)
        let foundproduct = await AddToCart.findOne({
            'products.color': color, 'products.ProductId': productId
        });

        if (!foundproduct) {
            cartexist.products.push(product);
            cartexist.totalAmount = (cartexist.totalAmount + product.price).toFixed(2);

            const data = await cartexist.save();
            if (data)
                res.status(201).json({ message: 'product added to cart successfully', data });
            else
                res.send("intrenal error of Saver")
        }
        else {
            res.status(403).json({ massage: "the product already exists in cart" })
        }

    } else {
        // console.log('i am here '+products.price);

        const cart = await AddToCart.create({ userId: _id, products: products, totalAmount: products.price })
        cart.save();
        if (cart) {
            return res.status(201).json({ message: "created cart successfully", cart });
        }
        return res.send("intrenal error of Saver")
    }
}
const deleteCartProduct = async (req, res) => {

    try {
        const { _id } = req.user;
        const { cartProductId, cartProductColor } = req.body;
        const cartExist = await AddToCart.findOne({ userId: _id });

        const product = cartExist.products.find(item => item.ProductId == cartProductId && item.color == cartProductColor);

        await AddToCart.findByIdAndUpdate(cartExist,
            {
                $pull:
                {
                    products:
                    {
                        ProductId: cartProductId,
                        color: cartProductColor
                    }
                }

            }, { new: true })
            .then(updatedCart => {
                cartExist.totalAmount = Number((cartExist.totalAmount - product.price).toFixed(2));

                cartExist.save();
                return res.status(200).json({ message: 'item has been deleted' });
            })
            .catch(error => {
                return res.status(400).json({ message: 'Error removing item from cart:', error });
            });
    } catch (err) {
        console.error(err);
        return res.status(500).send("An error occurred while deleting the cart product");
    }


}
const getCartProducts = async (req, res) => {
    try {

        const { _id } = req.user
        const exists = await AddToCart.findOne({ userId: _id })
        if (exists) {
            console.log(exists);
            const products = exists.products
            const totalPrice = exists.totalAmount
            return res.status(200).json({ products, totalPrice });
        }
        else {
            return res.status(404).send("cart not found");
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    AddCart,
    deleteCartProduct,
    getCartProducts
}
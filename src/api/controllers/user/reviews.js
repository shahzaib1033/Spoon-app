const Review = require('../../models/user/reviews')
const productModel = require('../../models/admin/products/products')
const OrderModel = require('../../models/user/order')


const giveReview = async (req, res) => {
    try {
        const { _id } = req.user
        const { productId, rating, message } = req.body
        const orders = await OrderModel.find({ userId: _id })
        const deliveredOrders = orders.filter(order => order.status == "Delivered");
        const productIds = deliveredOrders.flatMap(order => order.products.map(product => product.ProductId));
        const isMatch = productIds.some(id => id.toString() === productId);
        console.log(productIds, isMatch, productId);
        if (isMatch) {

            const foundItem = await Review.findOne({ userId: _id, productId: productId })
            if (!foundItem) {
                const review = await Review.create({
                    userId: _id,
                    productId: productId,
                    rating: rating,
                    content: message
                })
                try {
                    const saveData = review.save();
                    if (saveData) {
                        const reviews = await Review.find({ productId: productId })

                        const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                        const product = await productModel.findOne({ productId: productId })
                        const length = reviews.length
                        product.rating = sum / length
                        const Data = await product.save();
                        if (Data) {
                            return res.status(200).json({ saveData, ProductRating: Data.rating })
                        } else {
                            return res.json({ massage: 'internel error' })
                        }
                    }
                    else {
                        return res.json({ message: 'internal error' })
                    }
                }
                catch (error) {
                    console.log(error)
                    return res.json({ message: 'error', error: error })
                }
            } else {


                foundItem.rating = rating || foundItem.rating
                foundItem.content = message || foundItem.content
                const update = await foundItem.save();
                if (update) {
                    const reviews = await Review.find({ productId: productId })

                    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
                    const product = await productModel.findOne({ _id: productId });
                    const length = reviews.length
                    averageRating = sum / length;

                    product.rating = averageRating


                    const Data = await product.save();
                    if (Data) {
                        return res.status(200).json({ foundItem, ProductRating: Data.rating })
                    } else {
                        return res.json({ massage: 'internel error' })
                    }
                }
            }
        } else {
            return res.status(404).json({ massage: 'this prodcut is not ordered until the order you are unable to rate it' })
        }
    } catch (error) {
        console.log(error);
    }
}

const showReviews = async (req, res) => {
    try {
        const { _id } = req.user
        const { productId, skip, pageSize, page } = req.query
        const reviews = await Review.find({ productId }).populate('userId').skip(skip).limit(pageSize);
        return res.status(200).json({ massage: 'reviews are', reviews, page })
    } catch (err) {
        console.log(err)
        res.json({ massage: 'error', error: err })
    }
}

module.exports = {
    giveReview,
    showReviews
}
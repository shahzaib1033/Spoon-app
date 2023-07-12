const jwt = require('jsonwebtoken');
const checktokenValidation = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1]
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        if (decoded) {
            next();
        }
    }
    catch (err) {
        console.log(err)
        return res.status(404).json(
            {
                error: err
            }
        )
    }
}

module.exports = { checktokenValidation }

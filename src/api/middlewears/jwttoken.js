const jwt = require('jsonwebtoken');
const massages = require('../../config/methods/massage');
const { useErrorResponse } = require('../../config/methods/response');
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
        return useErrorResponse(res, 'error or token not found', 404)

    }
}

module.exports = { checktokenValidation }

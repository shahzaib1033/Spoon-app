const jwt = require('jsonwebtoken');
const massages = require('../../config/methods/massage');
const { useErrorResponse } = require('../../config/methods/response');
const userInfo = require('../models/user/userRegister');
const checktokenValidation = async (req, res, next) => {
    try {
            const token = req.headers.authorization.split('Bearer ')[1]
            const decoded = jwt.verify(token, process.env.SECRET);
            req.user = decoded;
            const { _id } = req.user
            const user = await userInfo.findOne({ _id })
            if (user.tokenVersion == req.user.tokenVersion && decoded) {
                next();
            }
        
            else {
                return useErrorResponse(res, 'the token expired or invalid', 404);
            }
        
    }
    catch (err) {
        console.log(err)
        return useErrorResponse(res, 'error or token not found', 404)

    }
}

module.exports = { checktokenValidation }

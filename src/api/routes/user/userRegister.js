const express = require('express');
const Handler = require('../../controllers/user/user');
const { checktokenValidation } = require('../../../config/methods/tokenValidation');


const {
    signUpHandler,
    resendpassword,
    signinHandler,
    deleteHandler,
    emailValidator,
    updateHandler,
    changePassword,
    forgetPassword,
    resetThePassword,
} = Handler;
const router = express.Router();


router.post('/signup', signUpHandler)
    .post('/signin', signinHandler)
    .post('/verfication', emailValidator)
    .post('/changePassword', checktokenValidation, changePassword)
    .put('/forgetpassword', forgetPassword)
    .put('/resendOTP', resendpassword)
    .put('/resetThePassword', resetThePassword)
    .put('/uptadeUserName', checktokenValidation, updateHandler)
    .delete('/deleteUser', checktokenValidation, deleteHandler);
module.exports = router; 